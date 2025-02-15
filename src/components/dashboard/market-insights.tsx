"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, BarChart } from "lucide-react";

interface MarketInsightsProps {
  symbol: string;
}

export function MarketInsights({ symbol }: MarketInsightsProps) {
  const insights = [
    {
      type: "Technical",
      icon: BarChart,
      content: "Key resistance level at $48,500. RSI showing oversold conditions.",
    },
    {
      type: "Sentiment",
      icon: TrendingUp,
      content: "Increased institutional buying activity in the past 24 hours.",
    },
    {
      type: "Analysis",
      icon: Lightbulb,
      content: "Potential breakout pattern forming on the 4-hour timeframe.",
    },
  ];

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <insight.icon className="h-4 w-4 text-primary" />
              <Badge variant="outline">{insight.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{insight.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 