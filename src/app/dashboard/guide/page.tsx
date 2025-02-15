"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  ArrowLeftRight,
  Bot,
  Target,
  Newspaper,
  BookOpen,
  Lightbulb,
  Bell,
  Settings,
  Search,
  Code,
} from "lucide-react";

const DASHBOARD_PAGES = [
  {
    title: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
    description: "Main dashboard with market overview and key metrics",
    features: [
      "Market Overview",
      "Price Charts",
      "Trading Volume",
      "Trending Coins",
      "Market Sentiment",
      "Top Movers",
      "Latest News",
    ],
  },
  {
    title: "Markets",
    path: "/dashboard/markets",
    icon: LineChart,
    description: "Detailed market data and cryptocurrency listings",
    features: [
      "All Assets Overview",
      "Trending Cryptocurrencies",
      "Top Gainers & Losers",
      "Market Statistics",
      "Price Alerts",
      "Market Filters",
    ],
  },
  {
    title: "Wallets",
    path: "/dashboard/wallets",
    icon: Wallet,
    description: "Wallet tracking and transaction monitoring",
    features: [
      "Wallet Management",
      "Transaction History",
      "Balance Tracking",
      "Gas Analytics",
      "Portfolio Overview",
    ],
  },
  {
    title: "Trading",
    path: "/dashboard/trading",
    icon: ArrowLeftRight,
    description: "Trading analysis and market signals",
    features: [
      "Trading Signals",
      "Price Analysis",
      "Market Sentiment",
      "Trading Volume",
      "Technical Indicators",
    ],
  },
  {
    title: "AI Expert",
    path: "/dashboard/ai-expert",
    icon: Bot,
    description: "AI-powered market analysis and predictions",
    features: [
      "Market Predictions",
      "AI Trading Signals",
      "Pattern Recognition",
      "Risk Analysis",
      "Sentiment Analysis",
    ],
    badge: "New",
  },
  // {
  //   title: "Market Analysis",
  //   path: "/dashboard/analysis",
  //   icon: Target,
  //   description: "In-depth market analysis and research tools",
  //   features: [
  //     "Technical Analysis",
  //     "Fundamental Analysis",
  //     "Market Correlations",
  //     "Volume Analysis",
  //     "Trend Detection",
  //   ],
  // },
  {
    title: "News & Research",
    path: "/dashboard/news",
    icon: Newspaper,
    description: "Latest cryptocurrency news and market research",
    features: [
      "Breaking News",
      "Market Updates",
      "Project Announcements",
      "Regulatory News",
      "Industry Research",
    ],
  },
  {
    title: "Learning Hub",
    path: "/dashboard/learn",
    icon: BookOpen,
    description: "Educational resources and trading guides",
    features: [
      "Trading Tutorials",
      "Market Education",
      "Technical Analysis Guides",
      "Security Best Practices",
      "DeFi Learning",
    ],
  },
  {
    title: "Trading Ideas",
    path: "/dashboard/ideas",
    icon: Lightbulb,
    description: "Community trading ideas and market insights",
    features: [
      "Popular Trading Ideas",
      "Market Strategies",
      "Technical Setups",
      "Community Analysis",
      "Trending Discussions",
    ],
  },
  {
    title: "Alerts",
    path: "/dashboard/alerts",
    icon: Bell,
    description: "Customizable alerts and notifications",
    features: [
      "Price Alerts",
      "Volume Alerts",
      "Trend Alerts",
      "News Alerts",
      "Custom Alert Rules",
    ],
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
    description: "Dashboard preferences and account settings",
    features: [
      "Account Settings",
      "Notification Preferences",
      "Display Options",
      "API Configuration",
      "Security Settings",
    ],
  },
  {
    title: "Pattern Analysis",
    path: "/dashboard/token-analysis",
    icon: LineChart,
    description: "Advanced pattern detection and token analysis tools",
    features: [
      "Token Pattern Detection",
      "Historical Pattern Analysis",
      "Market Behavior Analysis",
      "Trend Pattern Recognition",
      "Custom Pattern Alerts",
    ],
  },
  {
    title: "API Access",
    path: "/dashboard/api",
    icon: Code,
    description: "Programmatic access to BlockMind's features and data",
    features: [
      "REST API Documentation",
      "API Key Management",
      "Rate Limits & Usage",
      "Sample Code & SDKs",
      "API Endpoints Reference",
    ],
    badge: "Coming Soon",
  },
];

export default function GuidePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = DASHBOARD_PAGES.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.features.some((feature) =>
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Guide</h1>
        <p className="text-muted-foreground mt-2">
          Complete reference for all dashboard features and pages
        </p>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search features, pages, or functionality..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Dashboard Pages Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPages.map((page) => (
          <Link href={page.path} key={page.path}>
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <page.icon className="h-5 w-5" />
                  {page.title}
                  {page.badge && (
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {page.badge}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {page.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
