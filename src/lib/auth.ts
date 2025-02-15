import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
    CredentialsProvider({
      id: "metamask",
      name: "MetaMask",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
          const result = await siwe.verify({
            signature: credentials?.signature || "",
          });

          if (result.success) {
            const user = await prisma.user.upsert({
              where: { walletAddress: siwe.address },
              create: { walletAddress: siwe.address },
              update: { walletAddress: siwe.address },
            });
            return user;
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.walletAddress = (user as any).walletAddress as string | undefined;
      }

      if (account?.provider === "metamask") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub! },
          select: { walletAddress: true },
        });
        token.walletAddress = dbUser?.walletAddress as string | undefined;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.walletAddress = token.walletAddress as string | undefined;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === "metamask" && user.walletAddress) {
        await prisma.user.update({
          where: { id: user.id },
          data: { walletAddress: user.walletAddress },
        });
      }
    },
  },
}; 