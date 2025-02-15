"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowUpRight,
  Newspaper,
  BookOpen,
  GraduationCap,
  Lightbulb,
  MousePointerClick,
  BarChart2,
  Building2,
  LineChart,
  TrendingUp,
  Wallet,
  ShieldCheck,
  type LucideIcon,
  PuzzleIcon,
  CurlyBracesIcon,
} from "lucide-react";
import Image from "next/image";

const CATEGORY_IMAGES = {
  fundamentals:
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=800",
  trading:
    "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=800",
  defi: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800",
  security:
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=800",
  research:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
};

const RESOURCE_ICONS: Record<string, LucideIcon> = {
  Article: Newspaper,
  Documentation: BookOpen,
  Course: GraduationCap,
  Guide: Lightbulb,
  Tutorial: PuzzleIcon,
  Interactive: MousePointerClick,
  Research: BarChart2,
  Academic: Building2,
  Analysis: LineChart,
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  fundamentals: CurlyBracesIcon,
  trading: TrendingUp,
  defi: Wallet,
  security: ShieldCheck,
  research: Search,
};

const CATEGORIES = {
  fundamentals: [
    {
      title: "What is Cryptocurrency?",
      source: "Binance Academy",
      url: "https://academy.binance.com/en/articles/what-is-cryptocurrency",
      type: "Article",
    },
    {
      title: "Bitcoin Whitepaper",
      source: "Bitcoin.org",
      url: "https://bitcoin.org/bitcoin.pdf",
      type: "Documentation",
    },
    {
      title: "Blockchain Basics",
      source: "Coursera",
      url: "https://www.coursera.org/learn/blockchain-basics",
      type: "Course",
    },
    {
      title: "Web3 Fundamentals",
      source: "Web3 Foundation",
      url: "https://web3.foundation/learn",
      type: "Guide",
    },
    {
      title: "Crypto Security Best Practices",
      source: "Ledger Academy",
      url: "https://www.ledger.com/academy/basic-basics/",
      type: "Guide",
    },
  ],
  trading: [
    {
      title: "Technical Analysis Basics",
      source: "TradingView",
      url: "https://www.tradingview.com/education/techanalysis/",
      type: "Guide",
    },
    {
      title: "Crypto Trading Fundamentals",
      source: "Kraken",
      url: "https://www.kraken.com/learn/trading",
      type: "Course",
    },
    {
      title: "Advanced Trading Strategies",
      source: "FTX Research",
      url: "https://ftxresearch.com",
      type: "Research",
    },
    {
      title: "Risk Management in Crypto",
      source: "CoinGecko",
      url: "https://www.coingecko.com/learn/risk-management",
      type: "Guide",
    },
    {
      title: "Candlestick Patterns",
      source: "Phemex Academy",
      url: "https://phemex.com/academy/candlestick-patterns",
      type: "Tutorial",
    },
  ],
  defi: [
    {
      title: "DeFi Fundamentals",
      source: "Aave",
      url: "https://docs.aave.com/faq/",
      type: "Documentation",
    },
    {
      title: "Yield Farming Guide",
      source: "Compound",
      url: "https://compound.finance/docs",
      type: "Guide",
    },
    {
      title: "Liquidity Pools Explained",
      source: "Uniswap",
      url: "https://docs.uniswap.org/",
      type: "Documentation",
    },
    {
      title: "DeFi Risk Framework",
      source: "Rekt.news",
      url: "https://rekt.news/",
      type: "Analysis",
    },
    {
      title: "Smart Contract Development",
      source: "OpenZeppelin",
      url: "https://docs.openzeppelin.com/contracts/",
      type: "Documentation",
    },
  ],
  security: [
    {
      title: "Wallet Security",
      source: "MetaMask",
      url: "https://metamask.io/security/",
      type: "Guide",
    },
    {
      title: "Smart Contract Auditing",
      source: "CertiK",
      url: "https://www.certik.com/resources",
      type: "Documentation",
    },
    {
      title: "Security Best Practices",
      source: "ConsenSys",
      url: "https://consensys.net/blog/blockchain-security/",
      type: "Article",
    },
    {
      title: "Crypto Scam Prevention",
      source: "CipherTrace",
      url: "https://ciphertrace.com/resources/",
      type: "Guide",
    },
    {
      title: "DeFi Security Guidelines",
      source: "Immunefi",
      url: "https://immunefi.com/learn/",
      type: "Guide",
    },
  ],
  research: [
    {
      title: "Crypto Research Papers",
      source: "ArXiv",
      url: "https://arxiv.org/list/cs.CR/recent",
      type: "Academic",
    },
    {
      title: "Market Research Reports",
      source: "Messari",
      url: "https://messari.io/research",
      type: "Analysis",
    },
    {
      title: "DeFi Research",
      source: "DeFi Pulse",
      url: "https://defipulse.com/blog",
      type: "Research",
    },
    {
      title: "Token Engineering",
      source: "Token Engineering Academy",
      url: "https://tokenengineering.net/",
      type: "Academic",
    },
  ],
};

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Learning Resources</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search resources..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="fundamentals" className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(CATEGORIES).map(([category]) => {
            const Icon =
              CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
            return (
              <TabsTrigger
                key={category}
                value={category}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="capitalize">{category}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(CATEGORIES).map(([category, resources]) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-6 md:grid-cols-2">
              {resources
                .filter(
                  (resource) =>
                    resource.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    resource.source
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((resource) => {
                  const Icon =
                    RESOURCE_ICONS[
                      resource.type as keyof typeof RESOURCE_ICONS
                    ];
                  return (
                    <Card
                      key={resource.title}
                      className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={
                            CATEGORY_IMAGES[
                              category as keyof typeof CATEGORY_IMAGES
                            ]
                          }
                          alt={category}
                          fill
                          className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Icon className="h-4 w-4" />
                            <span className="text-white font-semibold capitalize text-sm">
                              {category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardHeader className="relative z-10 group-hover:bg-muted/50 transition-colors duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
                            <Icon className="h-4 w-4" />
                            <span className="text-xs font-medium">
                              {resource.type}
                            </span>
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors duration-300">
                          {resource.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Image
                            src={`https://www.google.com/s2/favicons?domain=${
                              new URL(resource.url).hostname
                            }&sz=32`}
                            alt={resource.source}
                            width={16}
                            height={16}
                            className="rounded-sm"
                          />
                          {resource.source}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="group-hover:bg-muted/50 transition-colors duration-300">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                        >
                          View Resource
                          <ArrowUpRight className="ml-1 h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </a>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
