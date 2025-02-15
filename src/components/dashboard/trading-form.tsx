"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatNumber } from "@/lib/utils";

interface TradingFormProps {
  type: "buy" | "sell";
  currentPrice: number;
}

export function TradingForm({ type, currentPrice }: TradingFormProps) {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(currentPrice.toString());
  const [percentage, setPercentage] = useState([0]);

  const total = Number(amount) * Number(price);
  const isValid = Number(amount) > 0 && Number(price) > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={type === "buy" ? "text-green-500" : "text-red-500"}>
          {type === "buy" ? "Buy" : "Sell"} BTC
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Price (USD)</label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount (BTC)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Percentage</label>
          <Slider
            value={percentage}
            onValueChange={setPercentage}
            max={100}
            step={25}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
        <div className="pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">${formatNumber(total)}</span>
          </div>
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={!isValid}
          variant={type === "buy" ? "default" : "destructive"}
        >
          {type === "buy" ? "Buy" : "Sell"} BTC
        </Button>
      </CardContent>
    </Card>
  );
} 