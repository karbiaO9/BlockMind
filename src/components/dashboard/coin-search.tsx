"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { TopCoin } from "@/lib/api/crypto";

interface CoinSearchProps {
  coins: TopCoin[];
  onSearch: (filtered: TopCoin[]) => void;
}

export function CoinSearch({ coins, onSearch }: CoinSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    const filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(value.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(value.toLowerCase())
    );
    onSearch(filtered);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search coins..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-8 w-8"
          onClick={() => handleSearch("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 