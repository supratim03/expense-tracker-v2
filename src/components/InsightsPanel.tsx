"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expense } from "@/types";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Wallet,
  Calendar,
  Target,
} from "lucide-react";

interface InsightsPanelProps {
  expenses: Expense[];
}

interface Insight {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "info" | "warning" | "success";
}

export default function InsightsPanel({ expenses }: InsightsPanelProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>💡 Smart Insights & Recommendations</CardTitle>
          <CardDescription>Get personalized advice based on your spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Add some expenses to get personalized insights!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgDaily = totalSpent / new Date().getDate();

  // Category breakdown
  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const topCategoryPercentage = (topCategory[1] / totalSpent) * 100;

  // High expenses
  const highExpenses = expenses.filter((exp) => exp.amount > avgDaily * 3);

  // Spending frequency
  const daysWithExpenses = new Set(expenses.map((exp) => exp.date)).size;

  // Savings potential
  const savingsPotential = totalSpent * 0.15;

  const insights: Insight[] = [];

  // Monthly overview
  insights.push({
    title: "Monthly Overview",
    description: `You've spent ₹${totalSpent.toFixed(2)} so far this month, averaging ₹${avgDaily.toFixed(2)} per day. ${
      avgDaily > 500
        ? "Consider setting daily spending limits to control expenses."
        : "Great job keeping daily spending in check!"
    }`,
    icon: <TrendingUp className="w-5 h-5" />,
    type: avgDaily > 500 ? "warning" : "success",
  });

  // Top category
  insights.push({
    title: "Top Spending Category",
    description: `${topCategory[0]} accounts for ${topCategoryPercentage.toFixed(1)}% of your spending (₹${topCategory[1].toFixed(2)}). ${
      topCategoryPercentage > 40
        ? "This seems high. Look for ways to reduce costs in this category."
        : "Your spending is well-distributed across categories."
    }`,
    icon: <Target className="w-5 h-5" />,
    type: topCategoryPercentage > 40 ? "warning" : "info",
  });

  // Large transactions
  if (highExpenses.length > 0) {
    insights.push({
      title: "Large Transactions",
      description: `You have ${highExpenses.length} transaction(s) above ₹${(avgDaily * 3).toFixed(2)}. Review these to ensure they align with your budget priorities.`,
      icon: <AlertTriangle className="w-5 h-5" />,
      type: "warning",
    });
  }

  // Savings opportunity
  insights.push({
    title: "Savings Opportunity",
    description: `By reducing expenses by just 15%, you could save ₹${savingsPotential.toFixed(2)} this month! Focus on your top spending categories first.`,
    icon: <Wallet className="w-5 h-5" />,
    type: "success",
  });

  // Spending frequency
  insights.push({
    title: "Spending Frequency",
    description: `You've made expenses on ${daysWithExpenses} different days this month. ${
      daysWithExpenses > 20
        ? "Daily expenses add up! Try planning weekly expenses to reduce impulsive spending."
        : "Good control over spending frequency!"
    }`,
    icon: <Calendar className="w-5 h-5" />,
    type: daysWithExpenses > 20 ? "warning" : "success",
  });

  const getCardStyle = (type: string) => {
    switch (type) {
      case "warning":
        return "border-amber-200 bg-amber-50/50";
      case "success":
        return "border-green-200 bg-green-50/50";
      default:
        return "border-blue-200 bg-blue-50/50";
    }
  };

  const getIconStyle = (type: string) => {
    switch (type) {
      case "warning":
        return "text-amber-600";
      case "success":
        return "text-green-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>💡 Smart Insights & Recommendations</CardTitle>
        <CardDescription>Personalized advice to improve your spending habits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className={getCardStyle(insight.type)}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className={`mt-1 ${getIconStyle(insight.type)}`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
