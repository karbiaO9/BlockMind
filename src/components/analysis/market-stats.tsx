import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MarketStatsProps {
  data: {
    totalMarketCap: number;
    totalVolume: number;
    btcDominance: number;
    marketCapChange: number;
  } | null;
  isLoading: boolean;
}

export function MarketStats({ data, isLoading }: MarketStatsProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Failed to load market stats</div>;
  }

  const stats = [
    {
      title: "Total Market Cap",
      value: `$${(data.totalMarketCap / 1e9).toFixed(2)}B`,
      change: data.marketCapChange,
    },
    {
      title: "24h Volume",
      value: `$${(data.totalVolume / 1e9).toFixed(2)}B`,
    },
    {
      title: "BTC Dominance",
      value: `${data.btcDominance.toFixed(2)}%`,
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change && (
              <p
                className={`text-sm ${
                  stat.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change >= 0 ? "+" : ""}
                {stat.change.toFixed(2)}%
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
