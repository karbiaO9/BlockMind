"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";

interface TradingPredictionsProps {
  symbol: string;
}

export function TradingPredictions({ symbol }: TradingPredictionsProps) {
  const predictions = {
    shortTerm: {
      price: 48500,
      confidence: 85,
      timeframe: "24h",
      factors: [
        "Strong momentum indicators",
        "High volume support",
        "Positive sentiment",
      ],
    },
    mediumTerm: {
      price: 52000,
      confidence: 75,
      timeframe: "7d",
      factors: [
        "Technical breakout expected",
        "Institutional buying pressure",
        "Market cycle analysis",
      ],
    },
    longTerm: {
      price: 60000,
      confidence: 65,
      timeframe: "30d",
      factors: [
        "Historical trend analysis",
        "On-chain metrics",
        "Macro economic factors",
      ],
    },
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Object.entries(predictions).map(([term, data]) => (
        <Card key={term}>
          <CardHeader>
            <CardTitle className="capitalize">
              {term.replace(/([A-Z])/g, " $1").trim()} Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold">
                  ${formatNumber(data.price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {data.timeframe}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Confidence</span>
                  <span>{data.confidence}%</span>
                </div>
                <Progress value={data.confidence} />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Key Factors:</span>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {data.factors.map((factor, i) => (
                  <li key={i}>{factor}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 