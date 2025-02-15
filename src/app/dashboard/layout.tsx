import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Dashboard | Web3 Platform",
    template: "%s | Dashboard",
  },
  description:
    "Manage your digital assets and view analytics in your personalized dashboard.",
  keywords: ["dashboard", "analytics", "web3", "assets", "portfolio"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com/dashboard",
    title: "Dashboard | Web3 Platform",
    description:
      "Manage your digital assets and view analytics in your personalized dashboard.",
    siteName: "Web3 Platform Dashboard",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
