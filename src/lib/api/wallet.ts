export interface WalletTransaction {
  hash: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  nonce: string;
  blockNumber: string;
  confirmations: string;
  isError: string;
  txreceipt_status: string;
  methodId: string;
  functionName: string;
}

export interface WalletInfo {
  address: string;
  balance: string;
  transactions: WalletTransaction[];
  totalTx: number;
  stats: {
    totalReceived: string;
    totalSent: string;
    lastTxTime: string;
    firstTxTime: string;
  };
}

export class WalletAPI {
  private static ETHERSCAN_API_URL = "https://api.etherscan.io/api";
  private static API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  static async getWalletInfo(
    address: string,
    page = 1,
    limit = 25,
    filter: 'all' | 'in' | 'out' | 'value' = 'all',
    searchTerm = ''
  ): Promise<WalletInfo | null> {
    try {
      const [balance, transactions, totalTx, stats] = await Promise.all([
        this.getBalance(address),
        this.getTransactions(address, page, limit, filter, searchTerm),
        this.getTotalTransactions(address, filter, searchTerm),
        this.getWalletStats(address),
      ]);

      return {
        address,
        balance,
        transactions,
        totalTx,
        stats,
      };
    } catch (error) {
      console.error("Error fetching wallet info:", error);
      return null;
    }
  }

  private static async getWalletStats(address: string) {
    try {
      // Get all transactions for better accuracy
      const response = await fetch(
        `${this.ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${this.API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === "1") {
        const txs = data.result;
        let totalReceived = 0;
        let totalSent = 0;
        
        txs.forEach((tx: any) => {
          const value = Number(tx.value) / 1e18; // Convert from Wei to ETH
          if (tx.to.toLowerCase() === address.toLowerCase() && tx.isError === "0") {
            totalReceived += value;
          }
          if (tx.from.toLowerCase() === address.toLowerCase() && tx.isError === "0") {
            totalSent += value;
          }
        });

        // Sort for first/last tx times
        const sortedTxs = [...txs].sort((a, b) => Number(a.timeStamp) - Number(b.timeStamp));
        
        return {
          totalReceived: totalReceived.toFixed(4),
          totalSent: totalSent.toFixed(4),
          firstTxTime: new Date(Number(sortedTxs[0]?.timeStamp) * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) || "Never",
          lastTxTime: new Date(Number(sortedTxs[sortedTxs.length - 1]?.timeStamp) * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) || "Never",
        };
      }
      return {
        totalReceived: "0",
        totalSent: "0",
        firstTxTime: "Never",
        lastTxTime: "Never",
      };
    } catch (error) {
      console.error("Error calculating wallet stats:", error);
      return {
        totalReceived: "0",
        totalSent: "0",
        firstTxTime: "Never",
        lastTxTime: "Never",
      };
    }
  }

  private static async getBalance(address: string): Promise<string> {
    const response = await fetch(
      `${this.ETHERSCAN_API_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.API_KEY}`
    );
    const data = await response.json();
    if (data.status === "1") {
      // Convert from Wei to ETH
      const balanceInEth = Number(data.result) / 1e18;
      return balanceInEth.toFixed(4);
    }
    return "0";
  }

  private static async getTotalTransactions(
    address: string,
    filter: 'all' | 'in' | 'out' | 'value' = 'all',
    searchTerm = ''
  ): Promise<number> {
    try {
      const response = await fetch(
        `${this.ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&page=1&offset=10000&sort=desc&apikey=${this.API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === "1") {
        let totalTx = data.result.length;
        
        if (filter !== 'all' || searchTerm) {
          totalTx = data.result.filter((tx: any) => {
            let matchesFilter = true;
            let matchesSearch = true;

            switch (filter) {
              case 'in':
                matchesFilter = tx.to.toLowerCase() === address.toLowerCase();
                break;
              case 'out':
                matchesFilter = tx.from.toLowerCase() === address.toLowerCase();
                break;
              case 'value':
                matchesFilter = Number(tx.value) > 0;
                break;
            }

            if (searchTerm) {
              matchesSearch = 
                tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.to.toLowerCase().includes(searchTerm.toLowerCase());
            }

            return matchesFilter && matchesSearch;
          }).length;
        }

        return totalTx;
      }
      return 0;
    } catch (error) {
      console.error("Error getting total transactions:", error);
      return 0;
    }
  }

  private static async getTransactions(
    address: string,
    page: number,
    limit: number,
    filter: 'all' | 'in' | 'out' | 'value' = 'all',
    searchTerm = ''
  ): Promise<WalletTransaction[]> {
    // Fetch more transactions to account for filtering
    const offset = limit * 2;
    const response = await fetch(
      `${this.ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=desc&apikey=${this.API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === "1") {
      let transactions = data.result.map((tx: any) => ({
        hash: tx.hash,
        timeStamp: new Date(Number(tx.timeStamp) * 1000).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        from: tx.from,
        to: tx.to,
        value: (Number(tx.value) / 1e18).toFixed(4),
        gasPrice: tx.gasPrice,
        gasUsed: tx.gasUsed,
        nonce: tx.nonce,
        blockNumber: tx.blockNumber,
        confirmations: tx.confirmations,
        isError: tx.isError,
        txreceipt_status: tx.txreceipt_status,
        methodId: tx.methodId,
        functionName: tx.functionName || 'Transfer',
      }));

      // Apply filters
      if (filter !== 'all' || searchTerm) {
        transactions = transactions.filter((tx: WalletTransaction) => {
          let matchesFilter = true;
          let matchesSearch = true;

          // Apply transaction filter
          switch (filter) {
            case 'in':
              matchesFilter = tx.to.toLowerCase() === address.toLowerCase();
              break;
            case 'out':
              matchesFilter = tx.from.toLowerCase() === address.toLowerCase();
              break;
            case 'value':
              matchesFilter = parseFloat(tx.value) > 0;
              break;
          }

          // Apply search filter if there's a search term
          if (searchTerm) {
            matchesSearch = 
              tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
              tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
              tx.to.toLowerCase().includes(searchTerm.toLowerCase());
          }

          return matchesFilter && matchesSearch;
        });
      }

      // Return only the requested number of transactions
      return transactions.slice(0, limit);
    }
    return [];
  }

  static isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  static async getTransactionHistory(address: string): Promise<WalletTransaction[]> {
    const response = await fetch(
      `${this.ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${this.API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === "1") {
      return data.result.map((tx: any) => ({
        hash: tx.hash,
        timeStamp: new Date(Number(tx.timeStamp) * 1000).toLocaleString(),
        from: tx.from,
        to: tx.to,
        value: (Number(tx.value) / 1e18).toFixed(4),
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice,
      }));
    }
    return [];
  }

  static async getTokenTransfers(address: string): Promise<any[]> {
    const response = await fetch(
      `${this.ETHERSCAN_API_URL}?module=account&action=tokentx&address=${address}&page=1&offset=50&sort=desc&apikey=${this.API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === "1") {
      return data.result;
    }
    return [];
  }

  static async getWalletsInfo(addresses: string[]): Promise<{
    [address: string]: {
      balance: string;
      lastTransaction?: {
        timestamp: string;
        hash: string;
      };
    };
  }> {
    try {
      const results = await Promise.all(
        addresses.map(async (address) => {
          const [balance, transactions] = await Promise.all([
            this.getBalance(address),
            fetch(
              `${this.ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&page=1&offset=1&sort=desc&apikey=${this.API_KEY}`
            ).then((res) => res.json()),
          ]);

          let lastTransaction;
          if (transactions.status === "1" && transactions.result.length > 0) {
            const tx = transactions.result[0];
            lastTransaction = {
              timestamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
              hash: tx.hash,
            };
          }

          return {
            address,
            data: {
              balance,
              lastTransaction,
            },
          };
        })
      );

      return results.reduce<{ [key: string]: { balance: string; lastTransaction?: { timestamp: string; hash: string } } }>(
        (acc, { address, data }) => {
          acc[address] = data;
          return acc;
        }, 
        {}
      );
    } catch (error) {
      console.error("Error fetching wallets info:", error);
      return {};
    }
  }
}
