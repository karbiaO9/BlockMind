import { Suspense } from "react";
import { CryptoAPI } from "@/lib/api/crypto";
import { MarketStats } from "@/components/dashboard/market-stats";
import { CryptoTable } from "@/components/dashboard/crypto-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 1;

export default async function MarketsPage() {
  const marketData = await CryptoAPI.getMarketOverview();
  const topCoins = await CryptoAPI.getTopCoins();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Markets</h1>

      <Suspense fallback={<Skeleton className="h-[120px]" />}>
        <MarketStats data={marketData} />
      </Suspense>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[600px]" />}>
            <CryptoTable coins={topCoins} />
          </Suspense>
        </TabsContent>

        <TabsContent value="trending">
          <Suspense fallback={<Skeleton className="h-[600px]" />}>
            <CryptoTable coins={topCoins.slice(0, 10)} />
          </Suspense>
        </TabsContent>

        <TabsContent value="gainers">
          <Suspense fallback={<Skeleton className="h-[600px]" />}>
            <CryptoTable
              coins={topCoins
                .sort((a, b) => b.change24h - a.change24h)
                .slice(0, 10)}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="losers">
          <Suspense fallback={<Skeleton className="h-[600px]" />}>
            <CryptoTable
              coins={topCoins
                .sort((a, b) => a.change24h - b.change24h)
                .slice(0, 10)}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
