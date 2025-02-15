"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface OrderBookProps {
  symbol: string;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export function OrderBook({ symbol }: OrderBookProps) {
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);

  // Mock data generation
  useEffect(() => {
    const basePrice = symbol === "BTC" ? 45000 : 2000;
    const mockOrders = (basePrice: number, type: "ask" | "bid") => {
      return Array.from({ length: 12 }, (_, i) => {
        const offset = type === "ask" ? i : -i;
        const price = basePrice + offset * (basePrice * 0.001);
        const amount = Math.random() * 2;
        return {
          price,
          amount,
          total: price * amount,
        };
      });
    };

    setAsks(mockOrders(basePrice, "ask").reverse());
    setBids(mockOrders(basePrice, "bid"));
  }, [symbol]);

  const spread =
    asks.length && bids.length
      ? formatNumber(asks[asks.length - 1].price - bids[0].price)
      : "0.00";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Asks */}
          <div className="space-y-1">
            {asks.map((order, i) => (
              <div key={i} className="grid grid-cols-3 text-xs text-red-500">
                <span>${formatNumber(order.price)}</span>
                <span className="text-center">{order.amount.toFixed(4)}</span>
                <span className="text-right">${formatNumber(order.total)}</span>
              </div>
            ))}
          </div>

          {/* Spread */}
          <div className="text-center text-xs text-muted-foreground">
            Spread: ${spread}
          </div>

          {/* Bids */}
          <div className="space-y-1">
            {bids.map((order, i) => (
              <div key={i} className="grid grid-cols-3 text-xs text-green-500">
                <span>${formatNumber(order.price)}</span>
                <span className="text-center">{order.amount.toFixed(4)}</span>
                <span className="text-right">${formatNumber(order.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
