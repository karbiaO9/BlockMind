"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  Network,
  Wallet,
  Settings,
  ArrowLeftRight,
  ChevronRight,
  Menu,
  Bot,
  Newspaper,
  Bell,
  BookOpen,
  Target,
  Lightbulb,
  LogOut,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type SidebarItem = {
  title: string;
  href: string;
  icon: any; // Or use the proper Lucide icon type
  badge?: string;
  description?: string;
  subItems?: Array<{
    title: string;
    href: string;
    icon: any;
    description?: string;
  }>;
  onClick?: () => Promise<void>;
};

const sidebarLinks: SidebarItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Markets",
    href: "/dashboard/markets",
    icon: LineChart,
  },
  {
    title: "Wallet Tracker",
    href: "/dashboard/wallets",
    icon: Wallet,
  },
  {
    title: "Trading",
    href: "/dashboard/trading",
    icon: ArrowLeftRight,
  },
  {
    title: "AI Expert",
    href: "/dashboard/ai-expert",
    icon: Bot,
  },
  // {
  //   title: "Market Analysis",
  //   href: "/dashboard/analysis",
  //   icon: Target,
  // },
  {
    title: "Pattern Analysis",
    href: "/dashboard/token-analysis",
    icon: LineChart,
  },
  {
    title: "News & Research",
    href: "/dashboard/news",
    icon: Newspaper,
  },
  {
    title: "Learning Hub",
    href: "/dashboard/learn",
    icon: BookOpen,
  },
  {
    title: "Trading Ideas",
    href: "/dashboard/ideas",
    icon: Lightbulb,
  },
  {
    title: "API",
    href: "/dashboard/api",
    icon: Code,
    badge: "Coming Soon",
  },
  {
    title: "Guide",
    href: "/dashboard/guide",
    icon: BookOpen,
  },
  {
    title: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

// Separate array for footer items
const footerLinks: SidebarItem[] = [
  {
    title: "Sign Out",
    href: "#",
    icon: LogOut,
    onClick: async () => {
      await signOut({ redirect: true, callbackUrl: "/" });
    },
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const router = useRouter();

  const handleItemClick = async (item: SidebarItem) => {
    if (item.onClick) {
      await item.onClick();
    } else if (item.href !== "#") {
      router.push(item.href);
    }
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        expanded ? "w-80" : "w-16"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b px-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="h-8 w-8"
        >
          <Menu className="h-4 w-4" />
        </Button>
        {expanded && (
          <a
            href="/"
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Logo />
            <span className="font-semibold">BlockMind</span>
          </a>
        )}
      </div>

      {/* Main Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="grid gap-1">
          {sidebarLinks.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                // Submenu Item
                <div className="grid gap-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between",
                      openSubmenu === item.title && "bg-accent"
                    )}
                    onClick={() =>
                      setOpenSubmenu(
                        openSubmenu === item.title ? null : item.title
                      )
                    }
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {expanded && <span>{item.title}</span>}
                    </span>
                    {expanded && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openSubmenu === item.title && "rotate-90"
                        )}
                      />
                    )}
                  </Button>
                  {expanded && openSubmenu === item.title && (
                    <div className="grid gap-1 pl-6">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={cn(
                            "group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                            pathname === subItem.href &&
                              "bg-accent text-accent-foreground",
                            "transition-colors"
                          )}
                        >
                          <subItem.icon className="h-4 w-4" />
                          <div className="grid gap-0.5">
                            <span>{subItem.title}</span>
                            {subItem.description && (
                              <span className="text-xs text-muted-foreground">
                                {subItem.description}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    item.title === "Sign Out" &&
                      "text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50",
                    pathname === item.href && "bg-accent"
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon
                    className={cn("h-4 w-4 mr-2", !expanded && "mr-0")}
                  />
                  {expanded && (
                    <>
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer Navigation */}
      <div className="mt-auto border-t px-3 py-4">
        <nav className="grid gap-1">
          {footerLinks.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                item.title === "Sign Out" &&
                  "text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50",
                pathname === item.href && "bg-accent"
              )}
              onClick={() => handleItemClick(item)}
            >
              <item.icon className={cn("h-4 w-4 mr-2", !expanded && "mr-0")} />
              {expanded && (
                <>
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
