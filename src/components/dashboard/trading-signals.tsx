"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Check } from "lucide-react";

interface TradingSignalsProps {
  symbol: string;
}

export function TradingSignals({ symbol }: TradingSignalsProps) {
  const signals = [
    {
      type: "STRONG_BUY",
      timeframe: "4H",
      confidence: 85,
      indicators: ["RSI", "MACD", "MA Cross"],
      description: "Multiple technical indicators showing bullish convergence",
    },
    {
      type: "NEUTRAL",
      timeframe: "1D",
      confidence: 60,
      indicators: ["Volume", "Bollinger Bands"],
      description: "Price consolidating within a tight range",
    },
    {
      type: "WEAK_SELL",
      timeframe: "1W",
      confidence: 65,
      indicators: ["Fibonacci", "Support/Resistance"],
      description: "Approaching major resistance level",
    },
  ];

  return (
    <div className="grid gap-4">
      {signals.map((signal, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {signal.timeframe} Signal
              </CardTitle>
              <SignalBadge type={signal.type} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  Confidence: {signal.confidence}%
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {signal.indicators.map((indicator) => (
                  <Badge key={indicator} variant="secondary">
                    {indicator}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {signal.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SignalBadge({ type }: { type: string }) {
  switch (type) {
    case "STRONG_BUY":
      return (
        <Badge className="bg-green-500">
          <TrendingUp className="mr-1 h-3 w-3" />
          Strong Buy
        </Badge>
      );
    case "WEAK_SELL":
      return (
        <Badge className="bg-red-500">
          <TrendingDown className="mr-1 h-3 w-3" />
          Weak Sell
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-500">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Neutral
        </Badge>
      );
  }
} 