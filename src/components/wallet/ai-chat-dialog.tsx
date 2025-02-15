"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Wallet, ArrowUpDown, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
  walletStats: {
    balance: string;
    totalTx: number;
    totalReceived: string;
    totalSent: string;
  };
}

export function AIChatDialog({
  open,
  onOpenChange,
  address,
  walletStats,
}: AIChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `I'm analyzing wallet ${address.slice(0, 6)}...${address.slice(
        -4
      )}. What would you like to know about this wallet?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Is this wallet active?",
    "Analyze transaction patterns",
    "What's the trading behavior?",
    "Risk assessment",
    "Show me large transactions",
    "When was this wallet created?",
    "Identify potential scam interactions",
    "Calculate profit/loss",
    "What tokens does this wallet hold?",
    "Show transaction frequency over time",
  ];

  async function handleSubmit(content: string) {
    if (!content.trim()) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // TODO: Implement AI response logic
    // For now, we'll simulate a response
    setTimeout(() => {
      const response: Message = {
        role: "assistant",
        content: `Analysis for "${content}": This wallet has ${walletStats.totalTx} transactions with a balance of ${walletStats.balance} ETH. Total received: ${walletStats.totalReceived} ETH, Total sent: ${walletStats.totalSent} ETH.`,
      };
      setMessages((prev) => [...prev, response]);
      setLoading(false);
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Wallet Analysis AI
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mr-10">
              <Wallet className="h-4 w-4" />
              <span className="font-mono">{address}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      message.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "assistant"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      } shadow-sm`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-lg px-4 py-2 bg-muted">
                      <div className="animate-pulse">●</div>
                      <div className="animate-pulse animation-delay-200">●</div>
                      <div className="animate-pulse animation-delay-400">●</div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about this wallet..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(input);
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={() => handleSubmit(input)} disabled={loading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Wallet Stats Sidebar */}
          <div className="w-72 border-l hidden lg:flex flex-col">
            <div className="p-4 border-b bg-background/95 backdrop-blur sticky top-0 z-10">
              <h3 className="text-sm font-medium">Wallet Overview</h3>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <Card className="p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-medium">{walletStats.balance} ETH</span>
                </div>
              </Card>

              <Card className="p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <ArrowUpDown className="h-4 w-4 inline mr-1" />
                    Transactions
                  </span>
                  <span className="font-medium">{walletStats.totalTx}</span>
                </div>
              </Card>

              <Card className="p-3 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Received
                    </span>
                    <span className="font-medium text-green-500 dark:text-green-400">
                      {walletStats.totalReceived} ETH
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Sent</span>
                    <span className="font-medium text-red-500 dark:text-red-400">
                      {walletStats.totalSent} ETH
                    </span>
                  </div>
                </div>
              </Card>
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">
                  Suggested Questions
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubmit(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
