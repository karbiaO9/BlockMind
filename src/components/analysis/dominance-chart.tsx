"use client";

import { useEffect, useState } from "react";
import { CryptoAPI } from "@/lib/api/crypto";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface DominanceData {
  name: string;
  value: number;
  color: string;
}

export function DominanceChart() {
  const [data, setData] = useState<DominanceData[]>([
    { name: "BTC", value: 45, color: "#F7931A" },
    { name: "ETH", value: 18, color: "#627EEA" },
    { name: "Others", value: 37, color: "#64748B" },
  ]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
} 