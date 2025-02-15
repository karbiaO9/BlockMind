"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MarketData } from "@/lib/api/crypto";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

interface MarketStatsProps {
  data: MarketData;
}

export function MarketStats({ data }: MarketStatsProps) {
  const stats = [
    {
      title: "Total Market Cap",
      value: `$${formatNumber(data.totalMarketCap)}`,
      change: data.marketCapChange24h,
      icon: DollarSign,
    },
    {
      title: "24h Volume",
      value: `$${formatNumber(data.totalVolume24h)}`,
      icon: TrendingUp,
    },
    {
      title: "BTC Dominance",
      value: `${data.btcDominance.toFixed(2)}%`,
      icon: PieChart,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/10 p-3">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.change && (
                <p
                  className={`text-sm ${
                    stat.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.change >= 0 ? (
                    <TrendingUp className="mr-1 inline h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 inline h-4 w-4" />
                  )}
                  {Math.abs(stat.change).toFixed(2)}%
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
