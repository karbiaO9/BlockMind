import "next-auth";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
      email?: string | null;
      image?: string | null;
      image?: string;
    walletAddress?: string | null;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      image?: string;
      name: string;
      walletAddress?: string;
    };
  }
} 