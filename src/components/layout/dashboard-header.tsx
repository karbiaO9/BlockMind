"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Expanded search result type
type SearchResult = {
  id: string;
  title: string;
  type:
    | "transaction"
    | "wallet"
    | "contract"
    | "coin"
    | "analytics"
    | "nft"
    | "defi";
  url: string;
  subtitle?: string;
  metadata?: {
    price?: string;
    change?: string;
    trend?: "up" | "down" | "neutral";
  };
};

// Notification type
type Notification = {
  id: string;
  message: string;
  timestamp: string; // ISO date string
};

export function DashboardHeader() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Comprehensive search results
  const searchResults: SearchResult[] = [
    // Cryptocurrency section
    {
      id: "btc",
      title: "Bitcoin (BTC)",
      type: "coin",
      url: "/dashboard/markets/BTC",
      subtitle: "Leading cryptocurrency by market cap",
      metadata: {
        price: "$45,230.50",
        change: "+2.5%",
        trend: "up",
      },
    },
    {
      id: "eth",
      title: "Ethereum (ETH)",
      type: "coin",
      url: "/dashboard/markets/ETH",
      subtitle: "Smart contract platform",
      metadata: {
        price: "$2,350.75",
        change: "-0.8%",
        trend: "down",
      },
    },

    // Analytics section
    {
      id: "market-overview",
      title: "Market Overview",
      type: "analytics",
      url: "/dashboard/analytics/market",
      subtitle: "Global market statistics and trends",
    },
    {
      id: "portfolio-analysis",
      title: "Portfolio Analysis",
      type: "analytics",
      url: "/dashboard/analytics/portfolio",
      subtitle: "Your portfolio performance metrics",
    },

    // Transactions
    {
      id: "tx1",
      title: "Transaction #A7B2C3",
      type: "transaction",
      url: "/dashboard/transactions/A7B2C3",
      subtitle: "0.5 ETH - 2 hours ago",
    },
    {
      id: "tx2",
      title: "Transaction #B4D5E6",
      type: "transaction",
      url: "/dashboard/transactions/B4D5E6",
      subtitle: "1 BTC - 5 hours ago",
    },

    // Wallets
    {
      id: "wallet1",
      title: "Main Wallet",
      type: "wallet",
      url: "/dashboard/wallets/main",
      subtitle: "0x1234...5678",
    },
    {
      id: "wallet2",
      title: "Savings Wallet",
      type: "wallet",
      url: "/dashboard/wallets/savings",
      subtitle: "0x9876...5432",
    },

    // Smart Contracts
    {
      id: "contract1",
      title: "DeFi Lending Protocol",
      type: "contract",
      url: "/dashboard/contracts/lending",
      subtitle: "Deployed on Ethereum",
    },
    {
      id: "contract2",
      title: "NFT Marketplace",
      type: "contract",
      url: "/dashboard/contracts/nft-marketplace",
      subtitle: "Buy and sell NFTs",
    },

    // NFTs
    {
      id: "nft1",
      title: "Bored Ape #1234",
      type: "nft",
      url: "/dashboard/nfts/1234",
      subtitle: "BAYC Collection",
    },
    {
      id: "nft2",
      title: "CryptoPunk #5678",
      type: "nft",
      url: "/dashboard/nfts/5678",
      subtitle: "Rare CryptoPunk",
    },

    // DeFi
    {
      id: "defi1",
      title: "Uniswap V3 Pool",
      type: "defi",
      url: "/dashboard/defi/uniswap",
      subtitle: "ETH/USDC - 0.3% Fee Tier",
    },
    {
      id: "defi2",
      title: "Aave Lending",
      type: "defi",
      url: "/dashboard/defi/aave",
      subtitle: "Lend and borrow assets",
    },
  ];

  // Sample notifications
  const notifications: Notification[] = [
    {
      id: "1",
      message: "New transaction received: 0.5 ETH",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      message: "Your wallet balance has been updated.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "3",
      message: "New NFT added to your collection.",
      timestamp: new Date().toISOString(),
    },
  ];

  // Filter results based on search query
  const filteredResults = searchQuery
    ? searchResults.filter((result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchResults;

  if (!session) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Search */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-[400px]">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-start pl-9 text-muted-foreground"
                >
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  {searchQuery || "Search coins, markets, transactions..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Type to search..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {filteredResults.some((r) => r.type === "coin") && (
                      <CommandGroup heading="Cryptocurrencies">
                        {filteredResults
                          .filter((r) => r.type === "coin")
                          .map((result) => (
                            <CommandItem
                              key={result.id}
                              onSelect={() => {
                                setSearchQuery(result.title);
                                setOpen(false);
                                window.location.href = result.url;
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col">
                                  <span>{result.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {result.subtitle}
                                  </span>
                                </div>
                                {result.metadata && (
                                  <div className="flex flex-col items-end">
                                    <span>{result.metadata.price}</span>
                                    <span
                                      className={
                                        result.metadata.trend === "up"
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }
                                    >
                                      {result.metadata.change}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                    {filteredResults.some((r) => r.type === "analytics") && (
                      <CommandGroup heading="Analytics">
                        {filteredResults
                          .filter((r) => r.type === "analytics")
                          .map((result) => (
                            <CommandItem
                              key={result.id}
                              onSelect={() => {
                                setSearchQuery(result.title);
                                setOpen(false);
                                window.location.href = result.url;
                              }}
                            >
                              <div className="flex flex-col">
                                <span>{result.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {result.subtitle}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                    {filteredResults.some((r) => r.type === "transaction") && (
                      <CommandGroup heading="Transactions">
                        {filteredResults
                          .filter((r) => r.type === "transaction")
                          .map((result) => (
                            <CommandItem
                              key={result.id}
                              onSelect={() => {
                                setSearchQuery(result.title);
                                setOpen(false);
                                window.location.href = result.url;
                              }}
                            >
                              <div className="flex flex-col">
                                <span>{result.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {result.subtitle}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                    {filteredResults.some((r) => r.type === "wallet") && (
                      <CommandGroup heading="Wallets">
                        {filteredResults
                          .filter((r) => r.type === "wallet")
                          .map((result) => (
                            <CommandItem
                              key={result.id}
                              onSelect={() => {
                                setSearchQuery(result.title);
                                setOpen(false);
                                window.location.href = result.url;
                              }}
                            >
                              <div className="flex flex-col">
                                <span>{result.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {result.subtitle}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                    {filteredResults.some((r) => r.type === "contract") && (
                      <CommandGroup heading="Smart Contracts">
                        {filteredResults
                          .filter((r) => r.type === "contract")
                          .map((result) => (
                            <CommandItem
                              key={result.id}
                              onSelect={() => {
                                setSearchQuery(result.title);
                                setOpen(false);
                                window.location.href = result.url;
                              }}
                            >
                              <div className="flex flex-col">
                                <span>{result.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {result.subtitle}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                    {filteredResults.some((r) => r.type === "nft") && (
                      <CommandGroup heading="NFTs">
                        {filteredResults
                          .filter((r) => r.type === "nft")
                          .map((result) => (
                            <CommandItem
                              key={result.id}
                              onSelect={() => {
                                setSearchQuery(result.title);
                                setOpen(false);
                                window.location.href = result.url;
                              }}
                            >
                              <div className="flex flex-col">
                                <span>{result.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {result.subtitle}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                    {filteredResults.some((r) => r.type === "defi") && (
                      <CommandGroup heading="DeFi Projects">
                        {filteredResults
                          .filter((r) => r.type === "defi")
                          .map((result) => (
                            <CommandItem
                              key={result.id}
                              onSelect={() => {
                                setSearchQuery(result.title);
                                setOpen(false);
                                window.location.href = result.url;
                              }}
                            >
                              <div className="flex flex-col">
                                <span>{result.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {result.subtitle}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification Popover */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Bell className="h-5 w-5" />
                      {notifications.length > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {notifications.length}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                </PopoverTrigger>
                <TooltipContent side="bottom" align="end">
                  View notifications
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent
              className="w-[380px] p-0 rounded-md"
              side="bottom"
              align="end"
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h4 className="font-semibold">Notifications</h4>
                  <Button
                    variant="ghost"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    Mark all as read
                  </Button>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex flex-col gap-1 p-4 hover:bg-muted/50 border-b last:border-0 transition-colors"
                      >
                        <span className="text-sm">{notification.message}</span>
                        <div className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="mx-2 h-6 w-px bg-border" />

          <ThemeToggle />

          <div className="ml-1">
            <ProfileDropdown session={session} />
          </div>
        </div>
      </div>
    </header>
  );
}
