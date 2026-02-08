"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Expense } from "@/types";
import { format } from "date-fns";

interface TrendChartProps {
  expenses: Expense[];
}

export default function TrendChart({ expenses }: TrendChartProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No expenses to display. Start tracking to see trends!
      </div>
    );
  }

  // Group by date
  const dailyTotals: { [key: string]: number } = {};
  expenses.forEach((exp) => {
    dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + exp.amount;
  });

  const data = Object.entries(dailyTotals)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, total]) => ({
      date: format(new Date(date), "MMM dd"),
      amount: total,
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`₹${value.toFixed(2)}`, "Amount"]}
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: "#8b5cf6", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
