"use client";

import { TrendingCoin } from "@/lib/api/crypto";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { Sparklines, SparklinesLine } from "react-sparklines";
import Link from "next/link";

interface TrendingCoinsProps {
  coins: TrendingCoin[];
}

export function TrendingCoins({ coins = [] }: TrendingCoinsProps) {
  if (!coins || !Array.isArray(coins)) {
    return null; // Or return a loading/error state
  }

  return (
    <div className="space-y-4">
      {coins.map((coin) => (
        <Card key={coin.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <img src={coin.image} alt={coin.name} className="h-8 w-8" />
              <div>
                <Link
                  href={`/dashboard/markets/${coin.symbol}`}
                  className="font-medium hover:underline"
                >
                  {coin.name}
                </Link>
                <p className="text-sm text-muted-foreground">{coin.symbol}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">${formatNumber(coin.price)}</p>
                <p
                  className={`text-sm ${
                    coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {coin.change24h > 0 ? "+" : ""}
                  {coin.change24h.toFixed(2)}%
                </p>
              </div>

              <div className="w-24 h-12">
                <Sparklines data={coin.sparkline}>
                  <SparklinesLine
                    color={coin.change24h >= 0 ? "#22c55e" : "#ef4444"}
                  />
                </Sparklines>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
