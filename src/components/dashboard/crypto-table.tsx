"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";
import { TopCoin } from "@/lib/api/crypto";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CryptoTableProps {
  coins: TopCoin[];
}

export function CryptoTable({ coins }: CryptoTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [marketCapFilter, setMarketCapFilter] = useState("all");
  const [priceChangeFilter, setPriceChangeFilter] = useState("24h");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCoins = coins
    .filter((coin) => {
      // Search filter
      const matchesSearch =
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());

      // Market cap filter
      const matchesMarketCap =
        marketCapFilter === "all" ||
        (marketCapFilter === "large" && coin.marketCap > 10_000_000_000) ||
        (marketCapFilter === "mid" &&
          coin.marketCap > 1_000_000_000 &&
          coin.marketCap <= 10_000_000_000) ||
        (marketCapFilter === "small" && coin.marketCap <= 1_000_000_000);

      return matchesSearch && matchesMarketCap;
    })
    .sort((a, b) => a.rank - b.rank);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCoins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCoins.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Market Cap</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={marketCapFilter}
                onValueChange={setMarketCapFilter}
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="large">
                  Large Cap
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mid">
                  Mid Cap
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="small">
                  Small Cap
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Price Change</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={priceChangeFilter}
                onValueChange={setPriceChangeFilter}
              >
                <DropdownMenuRadioItem value="1h">1H</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="24h">24H</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="7d">7D</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="30d">30D</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h %</TableHead>
              <TableHead>7d %</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>Volume(24h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell>{coin.rank}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="h-6 w-6" />
                  <Link
                    href={`/dashboard/markets/${coin.symbol}`}
                    className="font-medium hover:underline"
                  >
                    {coin.name}
                  </Link>
                  <span className="text-muted-foreground">{coin.symbol}</span>
                </TableCell>
                <TableCell>${formatNumber(coin.price)}</TableCell>
                <TableCell
                  className={
                    coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {coin.change24h.toFixed(2)}%
                </TableCell>
                <TableCell
                  className={
                    coin.change7d >= 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {coin.change7d.toFixed(2)}%
                </TableCell>
                <TableCell>${formatNumber(coin.marketCap)}</TableCell>
                <TableCell>${formatNumber(coin.volume24h)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4">
              Page {currentPage} of {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
