"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ActivityPoint } from "@/types/dashboard";

interface ActivityAreaChartInnerProps {
  data: ActivityPoint[];
}

export default function ActivityAreaChartInner({
  data,
}: ActivityAreaChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trips" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1D5FD0" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#1D5FD0" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="alerts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F4B400" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#F4B400" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        />
        <Area
          type="monotone"
          dataKey="trips"
          stroke="#1D5FD0"
          fillOpacity={1}
          fill="url(#trips)"
        />
        <Area
          type="monotone"
          dataKey="alerts"
          stroke="#F4B400"
          fillOpacity={1}
          fill="url(#alerts)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
