"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Activity, DollarSign } from "lucide-react";

interface TradingSummaryProps {
  symbol: string;
}

export function TradingSummary({ symbol }: TradingSummaryProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Market Summary</h3>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Trend</span>
              <span className="flex items-center text-green-500">
                <ArrowUp className="h-4 w-4 mr-1" /> Bullish
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Volatility</span>
              <span className="flex items-center">
                <Activity className="h-4 w-4 mr-1" /> Medium
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Risk Level</span>
              <span className="flex items-center text-yellow-500">
                <DollarSign className="h-4 w-4 mr-1" /> Moderate
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 