export interface ChartData {
    timestamp: string;
    price: number;
  }
  
  export interface PriceResponse {
    historicalData: ChartData[];
    latestPrice: number;
  }
  
  export interface VolumeChartData {
    time_period_start: string;
    time_period_end: string;
    price_close: number;
    volume_traded: number;
  }
  
  export interface CryptoInfo {
    symbol: string;
    name: string;
    price_usd?: number;
    market_cap?: number;
    volume_1day_usd?: number;
  }
  
  export class DeFiAPI {
    private static COIN_API_URL = "https://rest.coinapi.io/v1";
    private static COIN_API_KEY = process.env.NEXT_PUBLIC_COIN_API_KEY || '';
  
    private static getTimeInterval(timeRange: '24h' | '7d' | '30d' | '90d'): string {
      switch (timeRange) {
        case '24h':
          return '15MIN';  // 15-minute intervals for 24h (96 points)
        case '7d':
          return '2HRS';   // 2-hour intervals for 7d (84 points)
        case '30d':
          return '8HRS';   // 8-hour intervals for 30d (90 points)
        case '90d':
          return '1DAY';   // Daily intervals for 90d (90 points)
        default:
          return '1HRS';
      }
    }
  
    static async getCurrentPrice(symbol: string ): Promise<number> {
      try {
        const formattedSymbol = symbol.toUpperCase();
        const response = await fetch(
          `${this.COIN_API_URL}/exchangerate/${formattedSymbol}/USD`,
          {
            headers: {
              'X-CoinAPI-Key': this.COIN_API_KEY,
              'Accept': 'application/json',
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
  
        const data = await response.json();
        return data.rate;
      } catch (error) {
        console.error('Error fetching current price:', error);
        return 0;
      }
    }
  
    static async getDeFiChartData(
      timeRange: '24h' | '7d' | '30d' | '90d',
      symbol: string 
    ): Promise<PriceResponse> {
      try {
        const endDate = new Date();
        const startDate = new Date();
        const formattedSymbol = symbol.toUpperCase();
  
        // Calculate start date and adjust for timezone
        switch (timeRange) {
          case '24h':
            startDate.setHours(endDate.getHours() - 24);
            break;
          case '7d':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case '30d':
            startDate.setMonth(endDate.getMonth() - 1);
            break;
          case '90d':
            startDate.setMonth(endDate.getMonth() - 3);
            break;
        }
  
        // Get historical data
        const period = this.getTimeInterval(timeRange);
        const historicalResponsePromise = fetch(
          `${this.COIN_API_URL}/ohlcv/BITSTAMP_SPOT_${formattedSymbol}_USD/history?` +
          `period_id=${period}&` +
          `time_start=${startDate.toISOString()}&` +
          `time_end=${endDate.toISOString()}`,
          {
            headers: {
              'X-CoinAPI-Key': this.COIN_API_KEY,
              'Accept': 'application/json',
            },
          }
        );
        
        // Use historicalResponsePromise when needed
        const historicalResponse = await historicalResponsePromise;
  
        if (!historicalResponse.ok) {
          throw new Error(`API Error: ${historicalResponse.status}`);
        }
  
        const historicalData = await historicalResponse.json();
  
        if (!historicalData || !Array.isArray(historicalData)) {
          return { historicalData: [], latestPrice: 0 };
        }
  
        // Get current price
        const latestPrice = await this.getCurrentPrice(symbol);
  
        // Process historical data
        const processedData = historicalData.map((point: any) => ({
          timestamp: point.time_period_start,
          price: point.price_close,
        })).sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
  
        // Add current price point if we're looking at recent data
        if (timeRange === '24h' && latestPrice) {
          processedData.push({
            timestamp: new Date().toISOString(),
            price: latestPrice
          });
        }
  
        return {
          historicalData: processedData,
          latestPrice
        };
      } catch (error) {
        console.error('Error fetching chart data:', error);
        return { historicalData: [], latestPrice: 0 };
      }
    }
    
    static async getWeeklyVolumeData(symbol: string): Promise<VolumeChartData[]> {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const formattedSymbol = symbol.toUpperCase();

        // Add retry logic
        let retries = 3;
        let response;
        
        while (retries > 0) {
          response = await fetch(
            `${this.COIN_API_URL}/ohlcv/BITSTAMP_SPOT_${formattedSymbol}_USD/history?` +
            `period_id=1DAY&` +
            `time_start=${startDate.toISOString()}&` +
            `time_end=${endDate.toISOString()}&` +
            `limit=7`,
            {
              headers: {
                'X-CoinAPI-Key': this.COIN_API_KEY,
                'Accept': 'application/json',
              },
              next: { revalidate: 300 },
            }
          );

          if (response.status !== 429) break;
          
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }

        if (!response?.ok) {
          throw new Error(`API Error: ${response?.status}`);
        }

        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('No volume data available');
        }

        return data;

      } catch (error) {
        console.error('Error fetching weekly volume data:', error);
        throw error;
      }
    }

    static async getAllCryptos(): Promise<CryptoInfo[]> {
      try {
        const response = await fetch(
          `${this.COIN_API_URL}/assets`,
          {
            headers: {
              'X-CoinAPI-Key': this.COIN_API_KEY,
              'Accept': 'application/json',
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Filter and format all crypto assets
        return data
          .filter((asset: any) => 
            asset.type_is_crypto === 1 && 
            asset.price_usd !== null && 
            asset.volume_1day_usd > 0
          )
          .map((asset: any) => ({
            symbol: asset.asset_id,
            name: asset.name || asset.asset_id,
            price_usd: asset.price_usd,
            volume_1day_usd: asset.volume_1day_usd,
            market_cap: (asset.price_usd || 0) * (asset.volume_1day_usd || 0)
          }))
          .sort((a: CryptoInfo, b: CryptoInfo) => (b.market_cap || 0) - (a.market_cap || 0));
      } catch (error) {
        console.error('Error fetching cryptos:', error);
        // Return default list if API fails
        return [
          { symbol: "BTC", name: "Bitcoin" },
          { symbol: "ETH", name: "Ethereum" },
          { symbol: "BNB", name: "Binance Coin" },
          { symbol: "XRP", name: "Ripple" },
          { symbol: "SOL", name: "Solana" },
          { symbol: "ADA", name: "Cardano" },
          { symbol: "DOGE", name: "Dogecoin" },
          { symbol: "DOT", name: "Polkadot" },
        ];
      }
    }
  }