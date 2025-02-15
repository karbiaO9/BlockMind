import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Web3 Platform",
    template: "%s | Web3 Platform",
  },
  description:
    "A modern web3 platform for decentralized applications and digital assets.",
  keywords: ["web3", "blockchain", "crypto", "decentralized", "digital assets"],
  authors: [
    {
      name: "Your Name",
      url: "https://yourwebsite.com",
    },
  ],
  creator: "Your Company Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com",
    title: "Web3 Platform",
    description:
      "A modern web3 platform for decentralized applications and digital assets.",
    siteName: "Web3 Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web3 Platform",
    description:
      "A modern web3 platform for decentralized applications and digital assets.",
    creator: "@yourtwitterhandle",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MainNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
