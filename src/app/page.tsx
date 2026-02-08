"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Plus, 
  Trash2,
  Calendar,
  DollarSign,
  ShoppingBag,
  Car,
  Film,
  Lightbulb,
  Heart,
  BookOpen,
  ShoppingCart,
  MoreHorizontal,
  MessageSquare,
  Download,
} from "lucide-react";
import type { Expense } from "@/types";
import ExpenseChart from "@/components/ExpenseChart";
import TrendChart from "@/components/TrendChart";
import InsightsPanel from "@/components/InsightsPanel";
import SMSImportDialog from "@/components/SMSImportDialog";

const CATEGORIES = [
  { value: "Food & Dining", label: "Food & Dining", icon: "🍔" },
  { value: "Transportation", label: "Transportation", icon: "🚗" },
  { value: "Shopping", label: "Shopping", icon: "🛍️" },
  { value: "Entertainment", label: "Entertainment", icon: "🎬" },
  { value: "Bills & Utilities", label: "Bills & Utilities", icon: "💡" },
  { value: "Healthcare", label: "Healthcare", icon: "🏥" },
  { value: "Education", label: "Education", icon: "📚" },
  { value: "Groceries", label: "Groceries", icon: "🛒" },
  { value: "Other", label: "Other", icon: "📌" },
];

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Load expenses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    if (stored) {
      setExpenses(JSON.parse(stored));
    }
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    setExpenses([...expenses, newExpense]);
    setFormData({
      amount: "",
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const handleSMSImport = (importedExpenses: Expense[]) => {
    // Filter out duplicates based on amount, date, and description
    const existingIds = new Set(expenses.map(e => `${e.amount}-${e.date}-${e.description}`));
    const newExpenses = importedExpenses.filter(
      e => !existingIds.has(`${e.amount}-${e.date}-${e.description}`)
    );
    
    if (newExpenses.length > 0) {
      setExpenses([...expenses, ...newExpenses]);
      alert(`Successfully imported ${newExpenses.length} new transaction(s)!`);
    } else {
      alert('No new transactions found. All detected transactions already exist.');
    }
  };

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalTransactions = monthlyExpenses.length;

  // Get top category
  const categoryTotals: { [key: string]: number } = {};
  monthlyExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const topCategory = Object.keys(categoryTotals).length > 0
    ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
    : "None";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Wallet className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
          </div>
          <p className="text-muted-foreground mb-4">Take control of your finances with smart insights</p>
          
          <Button 
            onClick={() => setSmsDialogOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Import from SMS
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">₹{totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <PieChart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{topCategory}</div>
              <p className="text-xs text-muted-foreground mt-1">Most spent</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="add">Add Expense</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Breakdown</CardTitle>
                  <CardDescription>Your expenses by category this month</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ExpenseChart expenses={monthlyExpenses} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Spending Trend</CardTitle>
                  <CardDescription>Track your daily expenses</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <TrendChart expenses={monthlyExpenses} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Add Expense Tab */}
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
                <CardDescription>Record your latest transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="What did you spend on?"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional details..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Expense History</CardTitle>
                <CardDescription>All your recorded transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Wallet className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No expenses yet. Start by adding your first expense!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {[...expenses]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => {
                        const category = CATEGORIES.find((c) => c.value === expense.category);
                        return (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-2xl">{category?.icon}</div>
                              <div className="flex-1">
                                <div className="font-semibold">{expense.description}</div>
                                <div className="text-sm text-muted-foreground">
                                  {expense.category} •{" "}
                                  {new Date(expense.date).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                  {expense.notes && ` • ${expense.notes}`}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-xl font-bold text-purple-600">
                                ₹{expense.amount.toFixed(2)}
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => deleteExpense(expense.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <InsightsPanel expenses={monthlyExpenses} />
          </TabsContent>
        </Tabs>

        {/* SMS Import Dialog */}
        <SMSImportDialog 
          open={smsDialogOpen}
          onOpenChange={setSmsDialogOpen}
          onImport={handleSMSImport}
        />
      </div>
    </div>
  );
}
