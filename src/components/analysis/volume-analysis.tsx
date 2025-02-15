"use client";

import { useEffect, useState } from "react";
import { CryptoAPI } from "@/lib/api/crypto";

interface VolumeData {
  exchange: string;
  volume: number;
  share: number;
}

export function VolumeAnalysis() {
  const [volumeData, setVolumeData] = useState<VolumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVolumeData() {
      try {
        const data = await CryptoAPI.getMarketPairs("BTC");

        if (data.status?.error_code) {
          setError(data.status.error_message || "Failed to load volume data");
        }

        setVolumeData(data.data);
      } catch (error) {
        console.error("Failed to fetch volume data:", error);
        setError("Failed to load volume data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchVolumeData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">Error: {error}</div>}
      {volumeData.map((item) => (
        <div key={item.exchange} className="flex items-center justify-between">
          <span>{item.exchange}</span>
          <div className="flex items-center gap-4">
            <span>${item.volume.toFixed(1)}B</span>
            <span className="text-muted-foreground">{item.share}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
