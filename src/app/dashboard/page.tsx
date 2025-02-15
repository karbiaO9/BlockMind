import { Suspense } from "react";
import { CryptoAPI } from "@/lib/api/crypto";
import { MarketOverview } from "@/components/dashboard/market-overview";
import { TrendingCoins } from "@/components/dashboard/trending-coins";
import { CryptoTable } from "@/components/dashboard/crypto-table";
import { NewsWidget } from "@/components/dashboard/news-widget";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketHeader } from "@/components/dashboard/market-header";
import { AnalysisSection } from "@/components/dashboard/analysis-section";

export const revalidate = 60; // Revalidate every minute

export default async function DashboardPage() {
  const [marketData, trendingCoins, topCoins] = await Promise.all([
    CryptoAPI.getMarketOverview(),
    CryptoAPI.getTrendingCoins(),
    CryptoAPI.getTopCoins(),
  ]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4">
        <MarketHeader />
        <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <MarketOverview data={marketData} />
        </Suspense>
      </div>

      <Tabs defaultValue="market" className="space-y-4">
        <TabsList>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 lg:col-span-3">
              <Suspense fallback={<Skeleton className="h-[400px]" />}>
                <CryptoTable coins={topCoins} />
              </Suspense>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Trending Coins</h2>
            <Suspense fallback={<Skeleton className="h-[400px]" />}>
              <TrendingCoins coins={trendingCoins} />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <AnalysisSection />
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
        <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <NewsWidget />
        </Suspense>
      </div>
    </div>
  );
}
