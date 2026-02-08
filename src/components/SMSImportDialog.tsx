"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSMSReader } from "@/hooks/useSMSReader";
import type { Expense } from "@/types";
import { MessageSquare, Shield, Check, AlertCircle, Smartphone, Download } from "lucide-react";

interface SMSImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (expenses: Expense[]) => void;
}

export default function SMSImportDialog({ open, onOpenChange, onImport }: SMSImportDialogProps) {
  const { isSupported, hasPermission, requestPermission, readSMSMessages } = useSMSReader();
  const [loading, setLoading] = useState(false);
  const [previewExpenses, setPreviewExpenses] = useState<Expense[]>([]);
  const [step, setStep] = useState<'intro' | 'permission' | 'preview'>('intro');

  const handleRequestPermission = async () => {
    setLoading(true);
    const granted = await requestPermission();
    setLoading(false);
    
    if (granted) {
      handleReadMessages();
    }
  };

  const handleReadMessages = async () => {
    setLoading(true);
    try {
      const expenses = await readSMSMessages();
      setPreviewExpenses(expenses);
      setStep('preview');
    } catch (error) {
      console.error('Error reading messages:', error);
    }
    setLoading(false);
  };

  const handleImport = () => {
    onImport(previewExpenses);
    onOpenChange(false);
    setStep('intro');
    setPreviewExpenses([]);
  };

  const handleInstallPWA = () => {
    // This will be handled by the browser's install prompt
    alert('To install this app:\n\n1. Tap the browser menu (⋮)\n2. Select "Install app" or "Add to Home Screen"\n3. Follow the prompts');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        {step === 'intro' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Import from SMS Messages
              </DialogTitle>
              <DialogDescription>
                Automatically track your expenses by reading bank transaction SMS messages
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1 text-blue-900">Privacy First</h4>
                      <p className="text-sm text-blue-700">
                        Your messages are processed locally on your device. Nothing is sent to any server.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1 text-green-900">Smart Detection</h4>
                      <p className="text-sm text-green-700">
                        Automatically detects bank transactions, categorizes expenses, and extracts merchant names.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!isSupported && (
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Smartphone className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1 text-amber-900">Install as App</h4>
                        <p className="text-sm text-amber-700 mb-3">
                          SMS reading works best when installed as a mobile app. Install this PWA to enable full functionality.
                        </p>
                        <Button 
                          onClick={handleInstallPWA}
                          variant="outline" 
                          size="sm"
                          className="border-amber-300 hover:bg-amber-100"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Install App
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-purple-200 bg-purple-50/50">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1 text-purple-900">Demo Mode Active</h4>
                      <p className="text-sm text-purple-700">
                        For demonstration, we'll show sample transactions. Real SMS reading requires the app to be installed with proper permissions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleReadMessages} disabled={loading}>
                {loading ? 'Reading...' : 'Continue with Demo'}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'preview' && (
          <>
            <DialogHeader>
              <DialogTitle>Review Detected Transactions</DialogTitle>
              <DialogDescription>
                Found {previewExpenses.length} transactions from your messages
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {previewExpenses.map((expense) => (
                <Card key={expense.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </div>
                        {expense.notes && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {expense.notes}
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-purple-600">
                        ₹{expense.amount.toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button onClick={() => setStep('intro')} variant="outline">
                Back
              </Button>
              <Button onClick={handleImport}>
                Import {previewExpenses.length} Transaction{previewExpenses.length !== 1 ? 's' : ''}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
