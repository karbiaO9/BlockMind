"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";

export function MarketFilters() {
  return (
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
          <DropdownMenuRadioGroup value="all">
            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="large">
              Large Cap
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="mid">Mid Cap</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="small">
              Small Cap
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Price Change</DropdownMenuLabel>
          <DropdownMenuRadioGroup value="24h">
            <DropdownMenuRadioItem value="1h">1H</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="24h">24H</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="7d">7D</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="30d">30D</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
