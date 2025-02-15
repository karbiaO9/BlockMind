"use client";

import { useEffect, useState } from "react";
import { BlockMindAPI } from "@/lib/api/crypto";
import type { CryptoPrice } from "@/lib/api/crypto";

export function PriceDisplay({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const data = await BlockMindAPI.getPrice(symbol);
        setPrice(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrice, 30000);

    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (!price) return <div>Error loading price</div>;

  return (
    <div className="rounded-lg bg-card p-4">
      <h3 className="text-lg font-semibold">{symbol}</h3>
      <div className="mt-2 space-y-1">
        <p className="text-2xl font-bold">${price.price.toLocaleString()}</p>
        <p className={`text-sm ${price.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {price.change24h.toFixed(2)}% (24h)
        </p>
        <p className="text-sm text-muted-foreground">
          Vol: ${price.volume24h.toLocaleString()}
        </p>
      </div>
    </div>
  );
} 