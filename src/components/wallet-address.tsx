"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WalletAddressProps {
  address: string;
  className?: string;
  asChild?: boolean;
}

export function WalletAddress({ address, className, asChild }: WalletAddressProps) {
  const [copied, setCopied] = useState(false);

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <>
      <span>{shortAddress}</span>
      {!asChild && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={copyToClipboard}
        >
          <Copy className="h-3 w-3" />
        </Button>
      )}
    </>
  );

  if (asChild) {
    return <div className={cn("flex items-center gap-2", className)}>{content}</div>;
  }

  return (
    <div className={cn("flex items-center gap-2 rounded-lg px-3 py-1", className)}>
      {content}
    </div>
  );
} 