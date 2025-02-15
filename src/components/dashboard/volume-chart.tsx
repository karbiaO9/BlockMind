"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import { DeFiAPI } from "@/lib/api/defi";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DisplayVolumeData {
  day: string;
  volume: number;
  dailyVolume: number;
}

interface VolumeChartProps {
  symbol: string;
}

const LoadingSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-4 w-[60px]" />
    </div>
    <div className="space-y-2">
      {/* Skeleton bars */}
      <div className="flex items-end justify-between h-[350px] pt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-[40px]"
            style={{
              height: `${Math.max(30, Math.random() * 100)}%`,
            }}
          />
        ))}
      </div>
      {/* X-axis skeleton */}
      <div className="flex justify-between pt-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-8" />
        ))}
      </div>
    </div>
  </div>
);

export function VolumeChart({ symbol }: VolumeChartProps) {
  const [volumeData, setVolumeData] = useState<DisplayVolumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolumeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await DeFiAPI.getWeeklyVolumeData(symbol);

        // Process the data to show daily volumes and format dates
        const processedData = data.map((item) => ({
          day: new Date(item.time_period_start).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          volume: item.volume_traded * item.price_close, // Calculate volume in USD
          dailyVolume: item.volume_traded * item.price_close,
          timestamp: new Date(item.time_period_start).getTime(),
        }));

        // Sort by timestamp to ensure correct order
        const sortedData = processedData.sort(
          (a, b) => a.timestamp - b.timestamp
        );

        // Calculate cumulative volume
        const cumulativeData = sortedData.map((item, index) => ({
          day: item.day,
          volume: sortedData
            .slice(0, index + 1)
            .reduce((sum, curr) => sum + curr.dailyVolume, 0),
          dailyVolume: item.dailyVolume,
        }));

        setVolumeData(cumulativeData);
      } catch (error) {
        console.error("Error fetching volume data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load volume data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolumeData();
  }, [symbol]);

  // Update the CustomTooltip to show both daily and cumulative volume
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-popover p-2 shadow-sm">
          <div className="text-sm font-medium text-popover-foreground">
            {label}
          </div>
          <div className="text-base font-bold text-primary">
            ${formatNumber(data.volume)}
          </div>
          <div className="text-xs text-muted-foreground">
            Daily: ${formatNumber(data.dailyVolume)}
          </div>
          <div className="text-xs text-muted-foreground">
            Total volume until {label}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-card-foreground">
            Cumulative Trading Volume
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {symbol}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="flex h-[350px] items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">{error}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Volume data not available for {symbol}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={volumeData}
                margin={{ left: 40, right: 20, bottom: 5, top: 5 }}
              >
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  className="opacity-20 dark:opacity-10"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "hsl(var(--foreground))",
                    fontSize: 12,
                  }}
                  dy={10}
                />
                <YAxis
                  tickFormatter={(value) => `$${formatNumber(value)}`}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "hsl(var(--foreground))",
                    fontSize: 12,
                  }}
                  dx={-10}
                  width={80}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "hsl(var(--muted))",
                    opacity: 0.05,
                  }}
                />
                <Bar
                  dataKey="volume"
                  fill="url(#colorVolume)"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
