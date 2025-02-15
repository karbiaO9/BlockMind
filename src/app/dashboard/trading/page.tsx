"use client";
import { useState, Suspense } from "react";
import { CryptoAPI } from "@/lib/api/crypto";
import { TradingSignals } from "@/components/dashboard/trading-signals";
import { MarketSentiment } from "@/components/dashboard/market-sentiment";
import { TradingPredictions } from "@/components/dashboard/trading-predictions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TradingSummary } from "@/components/dashboard/trading-summary";
import { MarketInsights } from "@/components/dashboard/market-insights";
import PriceChart from "@/components/dashboard/price-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bitcoin, Coins } from "lucide-react";

type SupportedCurrency = "ETH" | "BTC";

export default function TradingPage() {
  const [selectedCurrency, setSelectedCurrency] =
    useState<SupportedCurrency>("BTC");

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Advisory</h1>
        <div className="flex items-center gap-4">
          <Select
            value={selectedCurrency}
            onValueChange={(value) =>
              setSelectedCurrency(value as SupportedCurrency)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ETH">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Ethereum (ETH)
                </div>
              </SelectItem>
              <SelectItem value="BTC">
                <div className="flex items-center gap-2">
                  <Bitcoin className="h-4 w-4" />
                  Bitcoin (BTC)
                </div>
              </SelectItem>
              <div className="px-2 py-2 text-xs text-muted-foreground border-t">
                DeFi tokens analysis coming soon
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Main Chart and Analysis */}
        <div className="lg:col-span-4 space-y-6">
          <Suspense fallback={<Skeleton className="h-[500px]" />}>
            <PriceChart symbol={selectedCurrency} />
          </Suspense>

          <Tabs defaultValue="signals" className="space-y-4">
            <TabsList>
              <TabsTrigger value="signals">Trading Signals</TabsTrigger>
              <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
              <TabsTrigger value="analysis">Technical Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="signals" className="space-y-4">
              <TradingSignals symbol={selectedCurrency} />
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <TradingPredictions symbol={selectedCurrency} />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <MarketSentiment symbol={selectedCurrency} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Analysis */}
        <div className="space-y-6">
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="summary" className="flex-1">
                Summary
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex-1">
                Insights
              </TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <TradingSummary symbol={selectedCurrency} />
            </TabsContent>
            <TabsContent value="insights">
              <MarketInsights symbol={selectedCurrency} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
