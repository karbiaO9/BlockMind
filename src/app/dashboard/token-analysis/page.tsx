"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Search,
  Shield,
  TrendingUp,
  AlertOctagon,
  Activity,
  Eye,
  Coins,
  History,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types for token analysis
type RiskFactor = {
  type: string;
  severity: "high" | "medium" | "low";
  description: string;
};

type TokenAnalysis = {
  tokenAddress: string;
  name: string;
  symbol: string;
  riskScore: number;
  riskFactors: RiskFactor[];
  liquidityAnalysis: {
    poolSize: string;
    lockedLiquidity: string;
    lockDuration: string;
  };
  tradingPatterns: {
    volume24h: string;
    holders: number;
    largeTransactions: number;
  };
  securityChecks: {
    contractVerified: boolean;
    hasAudit: boolean;
    ownershipRenounced: boolean;
    honeypotTest: boolean;
  };
};

// Add example tokens
const EXAMPLE_TOKENS = [
  {
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    symbol: "ETH",
    name: "Ethereum Token",
    network: "BSC",
  },
  {
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    symbol: "BTCB",
    name: "Bitcoin BEP2",
    network: "BSC",
  },
  {
    address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
    symbol: "ADA",
    name: "Cardano Token",
    network: "BSC",
  },
];

// Add recent searches
const RECENT_SEARCHES = [
  {
    address: "0x1234...5678",
    symbol: "SHIB",
    name: "Shiba Inu",
    timestamp: "2 hours ago",
  },
  {
    address: "0x8765...4321",
    symbol: "PEPE",
    name: "Pepe Token",
    timestamp: "5 hours ago",
  },
  {
    address: "0x9876...5432",
    symbol: "DOGE",
    name: "Dogecoin",
    timestamp: "1 day ago",
  },
];

// Add market tokens with more detailed information
const MARKET_TOKENS = [
  {
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    symbol: "ETH",
    name: "Ethereum",
    network: "BSC",
    marketCap: "$234.5B",
    price: "$2,345.67",
    change24h: "+2.5%",
    trend: "up",
    volume: "$15.7B",
  },
  {
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    symbol: "BTCB",
    name: "Bitcoin BEP2",
    network: "BSC",
    marketCap: "$892.1B",
    price: "$45,678.90",
    change24h: "-1.2%",
    trend: "down",
    volume: "$28.3B",
  },
  {
    address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
    symbol: "ADA",
    name: "Cardano",
    network: "BSC",
    marketCap: "$15.8B",
    price: "$1.23",
    change24h: "+5.7%",
    trend: "up",
    volume: "$1.2B",
  },
  {
    address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    symbol: "CAKE",
    name: "PancakeSwap",
    network: "BSC",
    marketCap: "$789.5M",
    price: "$2.45",
    change24h: "+0.8%",
    trend: "up",
    volume: "$123.4M",
  },
];

// Add recent scans type
type RecentScan = {
  id: string;
  tokenAddress: string;
  tokenName: string;
  symbol: string;
  timestamp: string;
  riskScore: number;
  status: "safe" | "warning" | "danger";
  network: string;
};

// Add recent scans data
const RECENT_SCANS: RecentScan[] = [
  {
    id: "1",
    tokenAddress: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    tokenName: "Ethereum",
    symbol: "ETH",
    timestamp: "2024-02-20T14:30:00Z",
    riskScore: 15,
    status: "safe",
    network: "BSC",
  },
  {
    id: "2",
    tokenAddress: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    tokenName: "Bitcoin BEP2",
    symbol: "BTCB",
    timestamp: "2024-02-20T13:45:00Z",
    riskScore: 25,
    status: "safe",
    network: "BSC",
  },
  {
    id: "3",
    tokenAddress: "0x1234...5678",
    tokenName: "Suspicious Token",
    symbol: "SUS",
    timestamp: "2024-02-20T12:15:00Z",
    riskScore: 85,
    status: "danger",
    network: "BSC",
  },
];

export default function TokenAnalysisPage() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [analysis, setAnalysis] = useState<TokenAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Mock analysis function - replace with real API call
  const analyzeToken = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data - replace with real API response
    setAnalysis({
      tokenAddress: tokenAddress,
      name: "Sample Token",
      symbol: "SMPL",
      riskScore: 65,
      riskFactors: [
        {
          type: "Liquidity",
          severity: "medium",
          description: "Low liquidity pool size relative to market cap",
        },
        {
          type: "Ownership",
          severity: "high",
          description: "Contract ownership not renounced",
        },
        {
          type: "Trading",
          severity: "low",
          description: "Normal trading patterns detected",
        },
      ],
      liquidityAnalysis: {
        poolSize: "$500,000",
        lockedLiquidity: "80%",
        lockDuration: "6 months",
      },
      tradingPatterns: {
        volume24h: "$120,000",
        holders: 1200,
        largeTransactions: 5,
      },
      securityChecks: {
        contractVerified: true,
        hasAudit: false,
        ownershipRenounced: false,
        honeypotTest: true,
      },
    });
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Token Analysis</h1>
        <p className="text-muted-foreground">
          Analyze any token for potential risks and suspicious patterns
        </p>
      </div>

      {/* Enhanced Search Section */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-xl">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-start text-left"
              >
                <Search className="mr-2 h-4 w-4" />
                {tokenAddress || "Search token address or symbol..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Enter token address or symbol..."
                  value={tokenAddress}
                  onValueChange={setTokenAddress}
                />
                <CommandList>
                  <CommandEmpty>No tokens found.</CommandEmpty>

                  <CommandGroup heading="Market Tokens">
                    {MARKET_TOKENS.map((token) => (
                      <CommandItem
                        key={token.address}
                        onSelect={() => {
                          setTokenAddress(token.address);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between w-full py-1">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              <Coins className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {token.symbol}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {token.name}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {token.address.slice(0, 6)}...
                                {token.address.slice(-4)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{token.price}</span>
                              <span
                                className={`text-xs ${
                                  token.trend === "up"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {token.change24h}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Vol: {token.volume}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {token.network}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  <CommandGroup heading="Recent Searches">
                    {RECENT_SEARCHES.map((token) => (
                      <CommandItem
                        key={token.address}
                        onSelect={() => {
                          setTokenAddress(token.address);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {token.symbol} - {token.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {token.address}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {token.timestamp}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  <CommandGroup heading="Trending">
                    {MARKET_TOKENS.slice(0, 3).map((token) => (
                      <CommandItem
                        key={token.address}
                        onSelect={() => {
                          setTokenAddress(token.address);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {token.symbol}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                MCap: {token.marketCap}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-medium">{token.price}</span>
                              <span
                                className={`text-xs ${
                                  token.trend === "up"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {token.change24h}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={analyzeToken} disabled={loading}>
          {loading ? (
            "Analyzing..."
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="recent">Recent Scans</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          {analysis ? (
            <div className="space-y-6">
              {/* Risk Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Risk Score</span>
                        <span className="font-bold">
                          {analysis.riskScore}/100
                        </span>
                      </div>
                      <Progress value={analysis.riskScore} />
                    </div>
                    <div className="space-y-2">
                      {analysis.riskFactors.map((factor, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                        >
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              factor.severity === "high"
                                ? "text-red-500"
                                : factor.severity === "medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium">{factor.type}</div>
                            <div className="text-sm text-muted-foreground">
                              {factor.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Checks Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Checks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        {analysis.securityChecks.contractVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertOctagon className="h-5 w-5 text-red-500" />
                        )}
                        <span>Contract Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {analysis.securityChecks.hasAudit ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertOctagon className="h-5 w-5 text-red-500" />
                        )}
                        <span>Security Audit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {analysis.securityChecks.ownershipRenounced ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertOctagon className="h-5 w-5 text-red-500" />
                        )}
                        <span>Ownership Renounced</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {analysis.securityChecks.honeypotTest ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertOctagon className="h-5 w-5 text-red-500" />
                        )}
                        <span>Honeypot Test</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Patterns Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trading Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          24h Volume
                        </div>
                        <div className="font-bold">
                          {analysis.tradingPatterns.volume24h}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Holders
                        </div>
                        <div className="font-bold">
                          {analysis.tradingPatterns.holders}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Large Transactions
                        </div>
                        <div className="font-bold">
                          {analysis.tradingPatterns.largeTransactions}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liquidity Analysis Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Liquidity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Pool Size
                        </div>
                        <div className="font-bold">
                          {analysis.liquidityAnalysis.poolSize}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Locked Liquidity
                        </div>
                        <div className="font-bold">
                          {analysis.liquidityAnalysis.lockedLiquidity}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Lock Duration
                        </div>
                        <div className="font-bold">
                          {analysis.liquidityAnalysis.lockDuration}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Analysis Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analysis</CardTitle>
                  <CardDescription>
                    Comprehensive token analysis results and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Contract Analysis */}
                    <div>
                      <h3 className="font-semibold mb-2">Contract Analysis</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            Contract Age
                          </div>
                          <div>6 months</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            Total Transactions
                          </div>
                          <div>15,234</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            Unique Holders
                          </div>
                          <div>1,234</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">
                            Creator Address
                          </div>
                          <div>0x1234...5678</div>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    <div>
                      <h3 className="font-semibold mb-2">AI Recommendations</h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                              <div className="font-medium">
                                Medium Risk Level
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Consider waiting for more liquidity before
                                investing. Current liquidity levels are below
                                recommended thresholds.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-start gap-2">
                            <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <div className="font-medium">Security Status</div>
                              <p className="text-sm text-muted-foreground">
                                Contract code is verified and follows standard
                                practices. No major vulnerabilities detected.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Enter a token address to start analysis
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Token Scans</CardTitle>
              <CardDescription>
                History of recently analyzed tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scanned</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_SCANS.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {scan.symbol} - {scan.tokenName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {scan.tokenAddress}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{scan.network}</Badge>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            scan.riskScore < 30
                              ? "bg-green-500/10 text-green-500"
                              : scan.riskScore < 70
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {scan.riskScore}/100
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            scan.status === "safe"
                              ? "secondary"
                              : scan.status === "warning"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {scan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(scan.timestamp).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTokenAddress(scan.tokenAddress);
                            analyzeToken();
                          }}
                        >
                          Rescan
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
