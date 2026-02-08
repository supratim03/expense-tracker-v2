"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Expense } from "@/types";

const COLORS = [
  "#8b5cf6", // purple
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
];

interface ExpenseChartProps {
  expenses: Expense[];
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No expenses to display. Add some expenses to see the breakdown!
      </div>
    );
  }

  // Calculate category totals
  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
      </PieChart>
    </ResponsiveContainer>
  );
}
