"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DeFiAPI, ChartData } from "@/lib/api/defi";
import { useTheme } from "next-themes";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const timeRanges = ["24h", "7d", "30d", "90d"] as const;
type TimeRange = (typeof timeRanges)[number];

// More frequent updates for real-time data
const UPDATE_INTERVAL = {
  "24h": 15000, // 15 seconds for 24h view
  "7d": 60000, // 1 minute for 7d view
  "30d": 300000, // 5 minutes for 30d view
  "90d": 900000, // 15 minutes for 90d view
} as const;

// Add symbol prop to component interface
interface PriceChartProps {
  symbol: string;
}

// Update component definition to use props
export default function PriceChart({ symbol }: PriceChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("24h");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    switch (selectedRange) {
      case "24h":
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      case "7d":
        return date.toLocaleDateString([], {
          weekday: "short",
          day: "numeric",
        });
      case "30d":
      case "90d":
        return date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
    }
  };

  useEffect(() => {
    let mounted = true;
    let updateInterval: NodeJS.Timeout;

    const calculatePriceChange = (data: ChartData[]) => {
      if (data.length < 2) return 0;
      const firstPrice = data[0].price;
      const lastPrice = data[data.length - 1].price;
      return ((lastPrice - firstPrice) / firstPrice) * 100;
    };

    const updateLatestPrice = async () => {
      if (!mounted) return;
      try {
        const latest = await DeFiAPI.getCurrentPrice(symbol);
        if (mounted && latest) {
          setCurrentPrice(latest);
          setChartData((prevData) => {
            const newData = [...prevData];
            if (newData.length > 0) {
              newData[newData.length - 1] = {
                ...newData[newData.length - 1],
                price: latest,
              };
            }
            return newData;
          });
        }
      } catch (error) {
        console.error("Error updating latest price:", error);
      }
    };

    const fetchChartData = async () => {
      if (!mounted) return;
      setLoading(true);
      setError(null);

      try {
        const { historicalData, latestPrice } = await DeFiAPI.getDeFiChartData(
          selectedRange,
          symbol
        );
        if (mounted) {
          if (historicalData.length === 0) {
            setError(`Chart data not available for ${symbol}`);
            setChartData([]);
            setCurrentPrice(null);
            return;
          }

          // Filter out any duplicate timestamps
          const uniqueData = historicalData.reduce(
            (acc: ChartData[], current) => {
              const exists = acc.find(
                (item) => item.timestamp === current.timestamp
              );
              if (!exists) {
                acc.push(current);
              }
              return acc;
            },
            []
          );

          setChartData(uniqueData);
          setCurrentPrice(latestPrice);
          setPriceChange(calculatePriceChange(uniqueData));
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        if (mounted) {
          setChartData([]);
          setCurrentPrice(null);
          setError(`Chart data not supported for ${symbol}`);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchChartData();

    // Set up real-time price updates
    if (selectedRange === "24h") {
      updateInterval = setInterval(updateLatestPrice, 3000); // Update price every 3 seconds for 24h view
    } else {
      updateInterval = setInterval(
        fetchChartData,
        UPDATE_INTERVAL[selectedRange]
      );
    }

    return () => {
      mounted = false;
      clearInterval(updateInterval);
    };
  }, [selectedRange, symbol]);

  const chartColor = isDark ? "#8884d8" : "#7c3aed";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
  const textColor = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-2">
          <CardTitle>{symbol}/USD Price</CardTitle>
          <div className="flex items-center gap-4">
            {currentPrice && (
              <div className="text-3xl font-bold">
                ${formatNumber(currentPrice)}
              </div>
            )}
            {priceChange !== 0 && (
              <div
                className={`flex items-center gap-1 text-lg ${
                  priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {priceChange >= 0 ? (
                  <ArrowUpIcon className="h-5 w-5" />
                ) : (
                  <ArrowDownIcon className="h-5 w-5" />
                )}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRange(range)}
            >
              {range.toUpperCase()}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] ">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  {error}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try selecting a different cryptocurrency
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  vertical={false}
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke={textColor}
                  tick={{ fill: textColor }}
                  tickLine={{ stroke: textColor }}
                  minTickGap={50}
                />
                <YAxis
                  dataKey="price"
                  tickFormatter={(value) => `$${formatNumber(value)}`}
                  stroke={textColor}
                  tick={{ fill: textColor }}
                  tickLine={{ stroke: textColor }}
                  domain={["auto", "auto"]}
                  width={80}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartData;
                      const date = new Date(data.timestamp);
                      const change = currentPrice
                        ? (
                            ((data.price - currentPrice) / currentPrice) *
                            100
                          ).toFixed(2)
                        : null;

                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-sm">
                          <div className="grid gap-2">
                            <div className="text-xs text-muted-foreground">
                              {date.toLocaleString()}
                            </div>
                            <div className="flex items-center justify-between gap-8">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Price
                              </span>
                              <span className="font-bold">
                                ${formatNumber(data.price)}
                              </span>
                            </div>
                            {change && (
                              <div className="flex items-center justify-between gap-8">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Change
                                </span>
                                <span
                                  className={`font-bold ${
                                    Number(change) >= 0
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {change}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="linear"
                  dataKey="price"
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                {currentPrice && (
                  <ReferenceLine
                    y={currentPrice}
                    stroke={textColor}
                    strokeDasharray="3 3"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
