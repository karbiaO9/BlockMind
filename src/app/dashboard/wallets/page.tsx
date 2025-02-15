"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scan, AlertCircle, Loader2, Star, Wallet, Trash2 } from "lucide-react";
import { WalletAPI } from "@/lib/api/wallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackedWallet {
  id: string;
  address: string;
  name: string;
  lastBalance: string;
  lastSynced: string;
  status: "ACTIVE" | "PAUSED" | "DELETED";
  tags: string[];
}

interface WalletInfo {
  balance: string;
  lastTransaction?: {
    timestamp: string;
    hash: string;
  };
}

const WalletCardSkeleton = () => (
  <Card className="relative">
    <CardContent className="p-6 flex flex-col min-h-[320px]">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-primary/5">
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 space-y-4">
        <div className="p-3 rounded-lg bg-background">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="p-3 rounded-lg bg-background">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="p-3 rounded-lg bg-background">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="mt-6">
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  </Card>
);

export default function WalletsPage() {
  const { data: session } = useSession();
  const [trackedWallets, setTrackedWallets] = useState<TrackedWallet[]>([]);
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletsInfo, setWalletsInfo] = useState<{
    [address: string]: WalletInfo;
  }>({});

  // Fetch tracked wallets
  useEffect(() => {
    async function fetchTrackedWallets() {
      if (!session?.user) return;

      try {
        const response = await fetch("/api/tracking/address");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setTrackedWallets(data);
      } catch (error) {
        console.error("Error fetching tracked wallets:", error);
        toast.error("Failed to load tracked wallets");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrackedWallets();
  }, [session]);

  // Add this effect to fetch wallet info
  useEffect(() => {
    async function updateWalletsInfo() {
      if (trackedWallets.length === 0) return;

      const addresses = trackedWallets.map((w) => w.address);
      const info = await WalletAPI.getWalletsInfo(addresses);
      setWalletsInfo(info);
    }

    updateWalletsInfo();
    // Set up polling every 30 seconds
    const interval = setInterval(updateWalletsInfo, 30000);
    return () => clearInterval(interval);
  }, [trackedWallets]);

  const handleScan = async () => {
    setError("");

    if (!WalletAPI.isValidEthereumAddress(newAddress)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setLoading(true);
    try {
      window.location.href = `/dashboard/wallets/${newAddress}`;
    } catch (err) {
      setError("Error scanning wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWallet = async (id: string) => {
    try {
      const response = await fetch(`/api/tracking/address?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setTrackedWallets((wallets) =>
        wallets.filter((wallet) => wallet.id !== id)
      );
      toast.success("Wallet removed from tracking");
    } catch (error) {
      console.error("Error removing wallet:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove wallet"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wallet Movements and History</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Wallet</CardTitle>
          <CardDescription>
            Track an Ethereum wallet address to monitor its movements
            <span className="mt-2 flex items-center text-xs text-yellow-500">
              <AlertCircle className="mr-1 h-3 w-3" />
              Note: Currently supports Ethereum (ETH) wallets only
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex space-x-4">
              <Input
                placeholder="Ethereum Address (0x...)"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="flex-1 font-mono"
              />
              <Button onClick={handleScan} disabled={loading}>
                <Scan className="mr-2 h-4 w-4" />
                {loading ? "Scanning..." : "Scan Wallet"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracked Wallets</CardTitle>
          <CardDescription>
            Monitor your tracked wallet addresses and their activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <WalletCardSkeleton key={i} />
              ))}
            </div>
          ) : trackedWallets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trackedWallets.map((wallet) => (
                <Card
                  key={wallet.id}
                  className="group relative hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <CardContent className="p-6 flex flex-col min-h-[320px]">
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveWallet(wallet.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-red-950/50 hover:bg-red-100 dark:text-red-400 text-red-600 hover:text-red-600 dark:hover:text-red-300"
                      >
                        <span className="flex items-center gap-1">
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </span>
                      </Button>
                    </div>

                    {/* Wallet Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Wallet className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-lg">
                          {wallet.name || "Unnamed Wallet"}
                        </h3>
                        <p className="text-sm font-mono text-muted-foreground">
                          {wallet.address.slice(0, 6)}...
                          {wallet.address.slice(-4)}
                        </p>
                      </div>
                    </div>

                    {/* Wallet Info */}
                    <div className="flex-1 space-y-4">
                      {/* Balance */}
                      <div className="p-3 rounded-lg bg-background">
                        <p className="text-sm text-muted-foreground mb-1">
                          Balance
                        </p>
                        <p className="font-medium text-lg">
                          {walletsInfo[wallet.address]?.balance ??
                            wallet.lastBalance ?? (
                              <span className="text-muted-foreground">
                                Loading...
                              </span>
                            )}{" "}
                          ETH
                        </p>
                      </div>

                      {/* Last Updated */}
                      <div className="p-3 rounded-lg bg-background">
                        <p className="text-sm text-muted-foreground mb-1">
                          Last Updated
                        </p>
                        <p className="text-sm">
                          {walletsInfo[wallet.address]?.lastTransaction ? (
                            <time
                              dateTime={
                                walletsInfo[wallet.address].lastTransaction!
                                  .timestamp
                              }
                            >
                              {new Date(
                                walletsInfo[
                                  wallet.address
                                ].lastTransaction!.timestamp
                              ).toLocaleString()}
                            </time>
                          ) : wallet.lastSynced ? (
                            <time dateTime={wallet.lastSynced}>
                              {new Date(wallet.lastSynced).toLocaleString()}
                            </time>
                          ) : (
                            "Never"
                          )}
                        </p>
                      </div>

                      {/* Latest Transaction */}
                      {walletsInfo[wallet.address]?.lastTransaction && (
                        <div className="p-3 rounded-lg bg-background">
                          <p className="text-sm text-muted-foreground mb-1">
                            Latest Transaction
                          </p>
                          <a
                            href={`https://etherscan.io/tx/${
                              walletsInfo[wallet.address].lastTransaction!.hash
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-primary hover:underline truncate block"
                          >
                            {walletsInfo[
                              wallet.address
                            ].lastTransaction!.hash.slice(0, 16)}
                            ...
                          </a>
                        </div>
                      )}

                      {/* Tags */}
                      {wallet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {wallet.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs rounded-full bg-secondary/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="mt-6">
                      <a
                        href={`/dashboard/wallets/${wallet.address}`}
                        className="block"
                      >
                        <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary">
                          View Details
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 border-2 border-dashed rounded-lg">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Star className="h-8 w-8 text-primary opacity-70" />
                </div>
                <h3 className="font-medium text-lg">No wallets tracked yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Add a wallet address to start monitoring its activities and
                  transactions
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
