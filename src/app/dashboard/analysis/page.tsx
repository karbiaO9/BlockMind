"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart } from "@/components/charts/line-chart";
import { MarketStats } from "@/components/analysis/market-stats";
import { TrendingCoins } from "@/components/analysis/trending-coins";
import { VolumeAnalysis } from "@/components/analysis/volume-analysis";
import { DominanceChart } from "@/components/analysis/dominance-chart";
import { CryptoAPI } from "@/lib/api/crypto";

interface MarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  marketCapChange: number;
}

export default function AnalysisPage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const data = await CryptoAPI.getGlobalStats();
        setMarketData(data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMarketData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Market Analysis</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <MarketStats data={marketData} isLoading={isLoading} />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Cap Trend</CardTitle>
                <CardDescription>
                  Total cryptocurrency market capitalization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={{
                    labels: ["1D", "7D", "14D", "30D", "90D", "180D"],
                    datasets: [
                      {
                        label: "Market Cap",
                        data: [2.1, 2.2, 2.0, 2.3, 1.9, 2.4],
                      },
                    ],
                  }}
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume Distribution</CardTitle>
                <CardDescription>
                  24h trading volume by exchange
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VolumeAnalysis />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Dominance</CardTitle>
                <CardDescription>
                  Market share by cryptocurrency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DominanceChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trending Assets</CardTitle>
                <CardDescription>
                  Most discussed cryptocurrencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrendingCoins />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          {/* Add trend analysis content */}
        </TabsContent>

        <TabsContent value="correlations">
          {/* Add correlation analysis content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
