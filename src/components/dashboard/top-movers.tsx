"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";

interface TopMoversProps {
  movers: {
    id: string;
    symbol: string;
    name: string;
    change: number;
    price: number;
    image: string;
  }[];
}

export function TopMovers({ movers = [] }: TopMoversProps) {
  return (
    <div className="space-y-4">
      {movers.map((coin) => (
        <Card key={coin.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Image
                src={coin.image}
                alt={coin.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <h3 className="font-medium">{coin.name}</h3>
                <p className="text-sm text-muted-foreground">{coin.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${formatNumber(coin.price)}</p>
              <p
                className={`flex items-center gap-1 text-sm ${
                  coin.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.change >= 0 ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                {Math.abs(coin.change).toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
