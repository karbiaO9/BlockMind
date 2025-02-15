"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export default function AIExpertPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI trading assistant. How can I help you analyze the market today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callCryptoBot = async (message: string): Promise<string> => {
    try {
      // First request to initiate the call
      const initResponse = await fetch(
        "https://azizsa1155-cryptobot.hf.space/gradio_api/call/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: [message],
            event_data: null,
            fn_index: 0,
          }),
        }
      );

      if (!initResponse.ok) {
        throw new Error("Failed to initiate API call");
      }

      const initData = await initResponse.json();
      const eventId = initData.hash; // Use the hash property from the JSON response

      if (!eventId) {
        throw new Error("No event ID received");
      }

      // Second request with direct streaming
      const resultResponse = await fetch(
        `https://azizsa1155-cryptobot.hf.space/gradio_api/call/predict/${eventId}`,
        {
          method: "GET",
          headers: {
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }
      );

      if (!resultResponse.ok) {
        throw new Error("Failed to get response");
      }

      const result = await resultResponse.text();

      // Parse the event stream response
      const lines = result.split("\n");
      const dataLines = lines.filter(
        (line) =>
          line.startsWith("data:") &&
          !line.includes("heartbeat") &&
          line.trim() !== "data: null"
      );

      if (dataLines.length === 0) {
        throw new Error("No valid response data received");
      }

      // Get the last data line (final response)
      const lastDataLine = dataLines[dataLines.length - 1];
      const jsonStr = lastDataLine.replace("data: ", "").trim();

      try {
        const parsedData = JSON.parse(jsonStr);
        return Array.isArray(parsedData) && parsedData.length > 0
          ? parsedData[0]
          : "No response data";
      } catch (e) {
        return jsonStr;
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "Processing your request... This might take up to 5 minutes.",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await callCryptoBot(input);

      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            id: loadingMessage.id,
            role: "assistant",
            content: response,
            timestamp: new Date(),
          },
        ];
      });
    } catch (error) {
      console.error("Failed to get AI response:", error);

      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            id: loadingMessage.id,
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again later.",
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Trading Expert</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Trading Assistant</CardTitle>
              <CardDescription>
                Ask questions about market analysis, trading strategies, and
                more
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-y-auto max-h-[600px]">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "assistant"
                          ? "flex-row"
                          : "flex-row-reverse"
                      }`}
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {message.role === "assistant" ? (
                          message.isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "assistant"
                            ? "bg-secondary"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.isLoading ? (
                          <div className="flex items-center gap-2">
                            <span>Analyzing your request</span>
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Ask about market analysis, trading strategies..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Market Sentiment
                  </p>
                  <p className="text-2xl font-bold text-green-500">Bullish</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <p className="text-2xl font-bold text-yellow-500">Moderate</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Trading Volume
                  </p>
                  <p className="text-2xl font-bold">$24.5B</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>BTC/USD</span>
                  <span className="text-green-500">Buy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>ETH/USD</span>
                  <span className="text-yellow-500">Hold</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>XRP/USD</span>
                  <span className="text-red-500">Sell</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
