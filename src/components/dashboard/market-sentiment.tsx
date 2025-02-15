"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MarketSentimentProps {
  symbol: string;
}

export function MarketSentiment({ symbol }: MarketSentimentProps) {
  // This would typically come from an API
  const sentiment = {
    fear: 35,
    neutral: 25,
    greed: 40,
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Market Sentiment</span>
          <span className="text-sm font-normal text-muted-foreground">
            {symbol}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fear</span>
            <span>{sentiment.fear}%</span>
          </div>
          <Progress value={sentiment.fear} className="bg-primary/10" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Neutral</span>
            <span>{sentiment.neutral}%</span>
          </div>
          <Progress value={sentiment.neutral} className="bg-primary/20" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Greed</span>
            <span>{sentiment.greed}%</span>
          </div>
          <Progress value={sentiment.greed} className="bg-primary/30" />
        </div>
      </CardContent>
    </Card>
  );
}
