"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { WalletTransaction } from "@/lib/api/wallet";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: WalletTransaction;
  walletAddress: string;
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  walletAddress,
}: TransactionDialogProps) {
  const isReceived =
    transaction.to.toLowerCase() === walletAddress.toLowerCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {transaction.isError === "0" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Transaction Details
            </div>
            <Button variant="outline" size="sm" className="gap-2 m-5" asChild>
              <a
                href={`https://etherscan.io/tx/${transaction.hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Etherscan
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Transaction Hash</span>
                <span className="font-mono">{transaction.hash}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={
                    transaction.isError === "0"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {transaction.isError === "0" ? "Success" : "Failed"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Block</span>
                <a
                  href={`https://etherscan.io/block/${transaction.blockNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-primary"
                >
                  {transaction.blockNumber}
                </a>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Timestamp</span>
                <span>{transaction.timeStamp}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">From</span>
                <a
                  href={`https://etherscan.io/address/${transaction.from}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:underline text-primary"
                >
                  {transaction.from}
                </a>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">To</span>
                <a
                  href={`https://etherscan.io/address/${transaction.to}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono hover:underline text-primary"
                >
                  {transaction.to}
                </a>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Value</span>
                <span
                  className={`font-medium ${
                    isReceived ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isReceived ? "+" : "-"}
                  {transaction.value} ETH
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Gas Price</span>
                <span>{transaction.gasPrice} Gwei</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Gas Used</span>
                <span>{transaction.gasUsed}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Nonce</span>
                <span>{transaction.nonce}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Function</span>
                <span className="px-2 py-1 text-xs rounded-full border bg-background">
                  {transaction.functionName}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
