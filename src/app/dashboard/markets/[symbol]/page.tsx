import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PriceChart from "@/components/dashboard/price-chart";
import { DeFiAPI } from "@/lib/api/defi";
import { MarketSentiment } from "@/components/dashboard/market-sentiment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

interface MarketPageProps {
  params: {
    symbol: string;
  };
}

export async function generateMetadata({ params }: MarketPageProps) {
  return {
    title: `${params.symbol.toUpperCase()} - Market Data`,
  };
}

async function getCryptoInfo(symbol: string) {
  const cachedData = await fetch(`/api/crypto/${symbol}`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  })
    .then((res) => res.json())
    .catch(() => null);

  if (cachedData) return cachedData;

  try {
    const cryptos = await DeFiAPI.getAllCryptos();
    const cryptoInfo = cryptos.find(
      (crypto) => crypto.symbol.toLowerCase() === symbol.toLowerCase()
    );
    return cryptoInfo || null;
  } catch (error) {
    console.error("Error fetching crypto info:", error);
    return null;
  }
}

export default async function MarketPage({ params }: MarketPageProps) {
  const symbol = params.symbol.toUpperCase();
  const cryptoInfo = await getCryptoInfo(symbol);

  return (
    <div className="space-y-6 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/markets"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Markets
        </Link>
        {cryptoInfo && (
          <Link href={`/dashboard/trading`}>
            <Button className="flex items-center gap-2" variant="outline">
              <Brain className="h-4 w-4" />
              AI Price Prediction
            </Button>
          </Link>
        )}
      </div>

      <Suspense fallback={<PageSkeleton />}>
        {!cryptoInfo ? (
          <NoDataFound symbol={symbol} />
        ) : (
          <MarketContent cryptoInfo={cryptoInfo} />
        )}
      </Suspense>
    </div>
  );
}

// Separate components for better organization
function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[200px]" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
      </div>
    </div>
  );
}

function NoDataFound({ symbol }: { symbol: string }) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="rounded-full bg-yellow-500/10 p-3">
          <AlertTriangle className="h-10 w-10 text-yellow-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No Data Available</h2>
          <p className="text-muted-foreground max-w-[400px]">
            We couldn't find any data for {symbol}. This cryptocurrency might
            not be supported or might have been delisted.
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <Link href="/dashboard/markets">
            <Button variant="outline">View All Markets</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MarketContent({ cryptoInfo }: { cryptoInfo: any }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {cryptoInfo.name}
            <span className="text-xl text-muted-foreground">
              {cryptoInfo.symbol}
            </span>
          </h1>
          {cryptoInfo.price_usd && (
            <p className="text-xl text-muted-foreground mt-1">
              ${cryptoInfo.price_usd.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[540px]" />}>
              <div className="h-[540px]">
                <PriceChart symbol={cryptoInfo.symbol} />
              </div>
            </Suspense>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Market Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[300px]" />}>
                <MarketSentiment symbol={cryptoInfo.symbol} />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-medium">
                  ${(cryptoInfo.market_cap || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">24h Volume</span>
                <span className="font-medium">
                  ${(cryptoInfo.volume_1day_usd || 0).toLocaleString()}
                </span>
              </div>
              {/* Add more statistics as needed */}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
