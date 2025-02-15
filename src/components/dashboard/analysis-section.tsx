"use client";

import { Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MarketSentiment } from "./market-sentiment";
import PriceChart from "./price-chart";
import { DeFiAPI, CryptoInfo } from "@/lib/api/defi";

export function AnalysisSection() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [searchQuery, setSearchQuery] = useState("");
  const [cryptoList, setCryptoList] = useState<CryptoInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const data = await DeFiAPI.getAllCryptos();
        setCryptoList(data);
      } catch (error) {
        console.error("Error fetching crypto list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  const filteredCrypto = cryptoList.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCrypto = filteredCrypto.slice(0, page * itemsPerPage);
  const hasMore = paginatedCrypto.length < filteredCrypto.length;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Price Analysis</h2>
          <div className="w-[300px]">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger>
                <SelectValue
                  placeholder={isLoading ? "Loading..." : "Select crypto"}
                />
              </SelectTrigger>
              <SelectContent onScroll={handleScroll} className="max-h-[300px]">
                <div className="p-2 sticky top-0 bg-background z-10">
                  <Input
                    placeholder="Search any cryptocurrency..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="mb-2"
                  />
                </div>
                {isLoading ? (
                  <div className="p-2">
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : paginatedCrypto.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No cryptocurrencies found
                  </div>
                ) : (
                  <>
                    {paginatedCrypto.map((crypto) => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {crypto.symbol} - {crypto.name}
                          </span>
                          {crypto.price_usd && (
                            <span className="text-sm text-muted-foreground">
                              $
                              {crypto.price_usd.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                    {hasMore && (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Scroll for more...
                      </div>
                    )}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <PriceChart symbol={selectedSymbol} />
        </Suspense>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Market Sentiment</h2>
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <MarketSentiment symbol={selectedSymbol} />
        </Suspense>
      </div>
    </div>
  );
}
