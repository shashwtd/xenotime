"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const data = [
  { day: "Mon", value: 145 },
  { day: "Tue", value: 220 },
  { day: "Wed", value: 180 },
  { day: "Thu", value: 260 },
  { day: "Fri", value: 190 },
  { day: "Sat", value: 320 },
  { day: "Sun", value: 150 },
];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-black px-3 py-2 shadow-xl">
        <p className="text-xs font-medium text-white mb-0.5">{label}</p>
        <p className="text-sm font-bold text-white">
          {payload[0].value} <span className="text-white/60 font-normal">min</span>
        </p>
      </div>
    );
  }
  return null;
};

export function ActivityGraph() {
  return (
    <div className="w-full h-full rounded-3xl border border-black/5 bg-white p-8 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium text-foreground">Weekly Activity</h3>
          <p className="text-sm text-(--accent-soft)">You focused 24% more than last week</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-(--accent-soft)">
          <span className="h-2 w-2 rounded-full bg-(--accent)"></span>
          <span>Focus Minutes</span>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--accent)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
