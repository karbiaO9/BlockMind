"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface RecentTradesProps {
  symbol: string;
}

interface Trade {
  price: number;
  amount: number;
  time: string;
  type: "buy" | "sell";
}

export function RecentTrades({ symbol }: RecentTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([]);

  // Mock data generation
  useEffect(() => {
    const basePrice = symbol === "BTC" ? 45000 : 2000;
    const mockTrades = Array.from({ length: 20 }, () => ({
      price: basePrice + (Math.random() - 0.5) * basePrice * 0.01,
      amount: Math.random() * 2,
      time: new Date().toLocaleTimeString(),
      type: Math.random() > 0.5 ? "buy" : "sell" as const,
    }));

    setTrades(mockTrades);
  }, [symbol]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-1">
          {trades.map((trade, i) => (
            <div
              key={i}
              className="grid grid-cols-3 text-xs"
            >
              <span className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>
                ${formatNumber(trade.price)}
              </span>
              <span className="text-center">{trade.amount.toFixed(4)}</span>
              <span className="text-right text-muted-foreground">{trade.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 