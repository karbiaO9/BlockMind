"use client";

import { TopCoin } from "@/lib/api/crypto";
import { useState } from "react";

interface MarketHeaderProps {
  coins: TopCoin[];
}

export function MarketHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Market Overview</h1>
    </div>
  );
}
