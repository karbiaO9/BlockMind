"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CryptoAPI, TrendingCoin } from "@/lib/api/crypto";

export function TrendingCoins() {
  const [coins, setCoins] = useState<TrendingCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const data = await CryptoAPI.getTrendingCoins();
        setCoins(data.data);
      } catch (error) {
        console.error("Failed to fetch trending coins:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrending();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {coins.map((coin) => (
        <div key={coin.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{coin.symbol}</span>
          </div>
          <span className={coin.change24h >= 0 ? "text-green-500" : "text-red-500"}>
            {coin.change24h >= 0 ? "+" : ""}
            {coin.change24h.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
} 