"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Search,
  Clock,
  ArrowUpDown,
  Bot,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { WalletAPI, WalletTransaction } from "@/lib/api/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { DeFiAPI } from "@/lib/api/defi";
import { AIChatDialog } from "@/components/wallet/ai-chat-dialog";
import { TransactionDialog } from "@/components/wallet/transaction-dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

function formatEthValue(value: string): string {
  const numValue = parseFloat(value);
  return `${parseFloat(numValue.toFixed(10))} ETH`;
}

function WalletSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function WalletDetailsPage() {
  const params = useParams();
  if (!params) throw new Error("No params found");
  const address = params.address as string;
  const { data: session } = useSession();

  const [isTracked, setIsTracked] = useState(false);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ethPrice, setEthPrice] = useState(0);
  const [walletInfo, setWalletInfo] = useState<{
    address: string;
    balance: string;
    transactions: any[];
    totalTx: number;
    stats: {
      totalReceived: string;
      totalSent: string;
      lastTxTime: string;
      firstTxTime: string;
    };
  } | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
  const [transactionFilter, setTransactionFilter] = useState<
    "all" | "in" | "out" | "value"
  >("all");

  const ITEMS_PER_PAGE = 25;

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [transactionFilter, searchTerm]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [info, price] = await Promise.all([
          WalletAPI.getWalletInfo(
            address,
            currentPage,
            ITEMS_PER_PAGE,
            transactionFilter, // Pass filter to API
            searchTerm // Pass search term to API
          ),
          DeFiAPI.getCurrentPrice("ETH"),
        ]);
        setWalletInfo(info);
        setEthPrice(price);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [address, currentPage, transactionFilter, searchTerm]);

  useEffect(() => {
    async function checkTracking() {
      if (!session?.user) return;

      try {
        const response = await fetch(
          `/api/tracking/address?address=${address}`
        );
        const data = await response.json();

        if (data.length > 0) {
          setIsTracked(true);
          setTrackingId(data[0].id);
        }
      } catch (error) {
        console.error("Error checking tracking status:", error);
      }
    }

    checkTracking();
  }, [address, session]);

  const handleTrackAddress = async () => {
    if (!session?.user) {
      toast.error("Please sign in to track addresses");
      return;
    }

    setIsTrackingLoading(true);
    try {
      const response = await fetch("/api/tracking/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
          tags: ["tracked"],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setIsTracked(true);
      setTrackingId(data.id);
      toast.success("Address added to tracking");
    } catch (error) {
      console.error("Error tracking address:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to track address"
      );
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleUntrackAddress = async () => {
    if (!trackingId) return;

    setIsTrackingLoading(true);
    try {
      const response = await fetch(`/api/tracking/address?id=${trackingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setIsTracked(false);
      setTrackingId(null);
      toast.success("Address removed from tracking");
    } catch (error) {
      console.error("Error untracking address:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to untrack address"
      );
    } finally {
      setIsTrackingLoading(false);
    }
  };

  if (loading) return <WalletSkeleton />;
  if (!walletInfo) return <div>Error loading wallet information</div>;

  const balanceUsd = (Number(walletInfo.balance) * ethPrice).toFixed(2);
  const filteredTransactions = walletInfo.transactions.filter((tx) => {
    // First apply search filter
    const matchesSearch =
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Then apply transaction type filter
    switch (transactionFilter) {
      case "in":
        return tx.to.toLowerCase() === address.toLowerCase();
      case "out":
        return tx.from.toLowerCase() === address.toLowerCase();
      case "value":
        return parseFloat(tx.value) > 0;
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/dashboard/wallets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </a>
          <h1 className="text-3xl font-bold">Address Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isTracked ? "secondary" : "default"}
            onClick={isTracked ? handleUntrackAddress : handleTrackAddress}
            disabled={isTrackingLoading}
            className="relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary/50 to-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-20" />
            <span className="relative flex items-center gap-2">
              {isTrackingLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isTracked ? "Removing..." : "Adding..."}
                </>
              ) : (
                <>
                  {isTracked ? (
                    <>
                      <Star className="h-4 w-4 fill-yellow-400" />
                      Tracked
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      Track Address
                    </>
                  )}
                </>
              )}
            </span>
          </Button>
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Etherscan
            </Button>
          </a>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Overview</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setAiChatOpen(true)}
            >
              <Bot className="h-4 w-4" />
              AI Analysis
            </Button>
          </div>
          <CardDescription className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Balance Card */}
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ETH Balance
                </h3>
                <span className="rounded-full bg-primary/10 p-1">
                  <ExternalLink className="h-4 w-4 text-primary" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold">{walletInfo.balance} ETH</p>
                <p className="text-sm text-muted-foreground">
                  ${balanceUsd} USD
                </p>
              </div>
            </div>

            {/* Transaction Stats Card */}
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Transaction Stats
                </h3>
                <span className="rounded-full bg-primary/10 p-1">
                  <ArrowUpDown className="h-4 w-4 text-primary" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold">{walletInfo.totalTx}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  First: {walletInfo.stats.firstTxTime}
                </div>
              </div>
            </div>

            {/* Last Activity Card */}
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Last Activity
                </h3>
                <span className="rounded-full bg-primary/10 p-1">
                  <Clock className="h-4 w-4 text-primary" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Date(walletInfo.stats.lastTxTime).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(walletInfo.stats.lastTxTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">First Tx</span>
              <span className="font-medium">
                {walletInfo.stats.firstTxTime}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Last Tx</span>
              <span className="font-medium">{walletInfo.stats.lastTxTime}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Total Received
              </span>
              <span className="font-medium text-green-500 dark:text-green-400">
                {walletInfo.stats.totalReceived} ETH
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Sent</span>
              <span className="font-medium text-red-500 dark:text-red-400">
                {walletInfo.stats.totalSent} ETH
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                {walletInfo.totalTx === 0
                  ? "No transactions found"
                  : `Latest ${Math.min(
                      ITEMS_PER_PAGE,
                      walletInfo.transactions.length
                    )} from a total of ${walletInfo.totalTx} transaction${
                      walletInfo.totalTx === 1 ? "" : "s"
                    }`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant={transactionFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTransactionFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={transactionFilter === "in" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTransactionFilter("in")}
                  className="text-green-500 dark:text-green-400"
                >
                  Incoming
                </Button>
                <Button
                  variant={transactionFilter === "out" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTransactionFilter("out")}
                  className="text-red-500 dark:text-red-400"
                >
                  Outgoing
                </Button>
                <Button
                  variant={
                    transactionFilter === "value" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setTransactionFilter("value")}
                >
                  Value {">"} 0
                </Button>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search txn hash / address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Txn Hash</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>
                  <ArrowUpDown className="h-4 w-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <TableRow
                    key={tx.hash}
                    className={
                      tx.isError === "1"
                        ? "bg-red-100 dark:bg-red-900/20"
                        : "hover:bg-muted/50 cursor-pointer"
                    }
                  >
                    <TableCell className="font-mono">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1 text-primary"
                        onClick={() => setSelectedTx(tx)}
                      >
                        {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs rounded-full border bg-background">
                        {tx.functionName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`https://etherscan.io/block/${tx.blockNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-muted-foreground"
                      >
                        {tx.blockNumber}
                      </a>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tx.timeStamp}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {tx.from.toLowerCase() === address.toLowerCase() && (
                          <span className="w-16 text-xs font-medium text-red-500 dark:text-red-400">
                            OUT
                          </span>
                        )}
                        <a
                          href={`/dashboard/wallets/${tx.from}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono hover:underline text-primary"
                        >
                          {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {tx.to.toLowerCase() === address.toLowerCase() && (
                          <span className="w-16 text-xs font-medium text-green-500 dark:text-green-400">
                            IN
                          </span>
                        )}
                        <a
                          href={`/dashboard/wallets/${tx.to}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono hover:underline text-primary"
                        >
                          {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          tx.to.toLowerCase() === address.toLowerCase()
                            ? "text-green-500 dark:text-green-400"
                            : "text-red-500 dark:text-red-400"
                        }
                        title={`${tx.value} ETH`}
                      >
                        {tx.to.toLowerCase() === address.toLowerCase()
                          ? "+"
                          : "-"}
                        {formatEthValue(tx.value)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-primary"
                        asChild
                      >
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                          onClick={() => setSelectedTx(tx)}
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="h-10 w-10 mb-2 opacity-50" />
                      <p>No transactions found</p>
                      {searchTerm && (
                        <p className="text-sm">
                          Try adjusting your search terms
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {walletInfo.totalTx > ITEMS_PER_PAGE && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, walletInfo.totalTx)} of{" "}
                {walletInfo.totalTx} transactions
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage * ITEMS_PER_PAGE >= walletInfo.totalTx}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AIChatDialog
        open={aiChatOpen}
        onOpenChange={setAiChatOpen}
        address={address}
        walletStats={{
          balance: walletInfo.balance,
          totalTx: walletInfo.totalTx,
          totalReceived: walletInfo.stats.totalReceived,
          totalSent: walletInfo.stats.totalSent,
        }}
      />

      {selectedTx && (
        <TransactionDialog
          open={!!selectedTx}
          onOpenChange={(open) => !open && setSelectedTx(null)}
          transaction={selectedTx}
          walletAddress={address}
        />
      )}
    </div>
  );
}
