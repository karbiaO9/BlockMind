"use client";

import { MarketData } from "@/lib/api/crypto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { FaBitcoin } from "react-icons/fa";
import { SiEthereum } from "react-icons/si";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DeFiAPI } from "@/lib/api/defi";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface MarketOverviewProps {
  data: MarketData;
}

function MarketOverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MarketOverview({ data }: MarketOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState(data.btcPrice || 0);
  const [ethPrice, setEthPrice] = useState(data.ethPrice || 0);
  const [dionePrice, setDionePrice] = useState(data.dionePrice || 0);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [btc, eth, dione] = await Promise.all([
          DeFiAPI.getCurrentPrice("BTC"),
          DeFiAPI.getCurrentPrice("ETH"),
          DeFiAPI.getCurrentPrice("DIONE"),
        ]);
        setBtcPrice(btc);
        setEthPrice(eth);
        setDionePrice(dione);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prices:", error);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <MarketOverviewSkeleton />;
  }

  // Default value for market sentiment if it's undefined
  const marketSentiment = data.marketSentiment ?? 50;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Market Cap
          </CardTitle>
          {data.marketCapChange24h >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${formatNumber(data.totalMarketCap)}
          </div>
          <p
            className={`text-xs ${
              data.marketCapChange24h >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {data.marketCapChange24h > 0 ? "+" : ""}
            {data.marketCapChange24h.toFixed(2)}% (24h)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          <div className="flex items-center gap-2">
            <p
              className={`text-xs ${
                data.totalVolume24h >= data.totalVolume24h
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {formatNumber(data.totalVolume24h)}
            </p>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${formatNumber(data.totalVolume24h)}
          </div>
          <p className="text-xs text-muted-foreground">
            Global 24h trading volume
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Market Sentiment
          </CardTitle>
          {marketSentiment >= 50 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {marketSentiment.toFixed(2)}%
          </div>
          <p
            className={`text-xs ${
              marketSentiment >= 50 ? "text-green-500" : "text-red-500"
            }`}
          >
            {marketSentiment >= 50 ? "Bullish" : "Bearish"}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:bg-accent/50 transition-colors">
        <Link href="/dashboard/markets/BTC">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Price</CardTitle>
            <div className="flex items-center gap-2">
              <p
                className={`text-xs ${
                  (data.btcChange24h || 0) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {(data.btcChange24h || 0) > 0 ? "+" : ""}
                {(data.btcChange24h || 0).toFixed(2)}%
              </p>
              <FaBitcoin className="h-4 w-4 text-[#F7931A]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${formatNumber(Number(btcPrice) || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Volume: ${formatNumber(data.btcVolume24h || 0)}
            </p>
          </CardContent>
        </Link>
      </Card>

      <Card className="hover:bg-accent/50 transition-colors">
        <Link href="/dashboard/markets/ETH">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ETH Price</CardTitle>
            <div className="flex items-center gap-2">
              <p
                className={`text-xs ${
                  (data.ethChange24h || 0) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {(data.ethChange24h || 0) > 0 ? "+" : ""}
                {(data.ethChange24h || 0).toFixed(2)}%
              </p>
              <SiEthereum className="h-4 w-4 text-[#627EEA]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${formatNumber(Number(ethPrice) || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Volume: ${formatNumber(data.ethVolume24h || 0)}
            </p>
          </CardContent>
        </Link>
      </Card>

      <Card className="hover:bg-accent/50 transition-colors">
        <Link href="/dashboard/markets/DIONE">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dione Protocol DIONE
            </CardTitle>
            <div className="flex items-center gap-2">
              <p
                className={`text-xs ${
                  (data.dioneChange24h || 0) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {(data.dioneChange24h || 0) > 0 ? "+" : ""}
                {(data.dioneChange24h || 0).toFixed(2)}%
              </p>
              <Image
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/21473.png"
                alt="DIONE"
                width={16}
                height={16}
                className="rounded-full"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(Number(dionePrice) || 0).toFixed(8)}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Vol: ${formatNumber(data.dioneVolume24h || 0)}
              </p>
              <p
                className={`text-xs ${
                  (data.dioneChange24h || 0) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                24h
              </p>
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}
