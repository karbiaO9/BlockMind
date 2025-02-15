export interface CryptoPrice {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

export interface MarketData {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
  marketSentiment: number;
  btcPrice?: number;
  ethPrice?: number;
  dionePrice?: number;
  dioneChange24h?: number;
  dioneVolume24h?: number;
  ethVolume24h?: number;
  btcVolume24h?: number;
  ethChange24h?: number;
  btcChange24h?: number;
}

export interface TrendingCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  sparkline: number[];
}

export interface TopCoin {
  id: string;
  rank: number;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  
}

interface TopMover {
  id: string;
  symbol: string;
  name: string;
  change: number;
  price: number;
  image: string;
}

export interface ChartData {
  timestamp: string;
  price: number;
  volume: number;
  marketCap: number;
}

export interface DefiToken {
  id: string;
  symbol: string;
  name: string;
  color: string;  // For chart styling
  marketCap: number;
  category: string;
}

export interface VolumeData {
  day: string;
  volume: number;
}

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY;
const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1";

const headers = {
  "X-CMC_PRO_API_KEY": CMC_API_KEY!,
  "Content-Type": "application/json",
};

export class CryptoAPI {
  private static async fetchWithAuth(endpoint: string) {
    try {
      const response = await fetch(`${CMC_API_URL}${endpoint}`, {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY || '',
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        // Return fallback data instead of throwing
        return {
          data: [],
          status: {
            error_code: response.status,
            error_message: response.statusText
          }
        };
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Return fallback data
      return {
        data: [],
        status: {
          error_code: 500,
          error_message: 'Internal Server Error'
        }
      };
    }
  }

  static async getGlobalStats() {
    const data = await this.fetchWithAuth("/global-metrics/quotes/latest");
    return {
      totalMarketCap: data.data.quote.USD.total_market_cap,
      totalVolume: data.data.quote.USD.total_volume_24h,
      btcDominance: data.data.btc_dominance,
      marketCapChange: data.data.quote.USD.total_market_cap_yesterday_percentage_change,
    };
  }

  static async getTrendingCoins(): Promise<TrendingCoin[]> {
    try {
      const data = await this.fetchWithAuth("/cryptocurrency/listings/latest?limit=10&sort=percent_change_24h");
      
      if (!data.data || !Array.isArray(data.data)) {
        return [];
      }

      return data.data.map((coin: any) => ({
        id: coin.id.toString(),
        symbol: coin.symbol,
        name: coin.name,
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
        price: coin.quote.USD.price,
        change24h: coin.quote.USD.percent_change_24h,
        volume24h: coin.quote.USD.volume_24h,
        sparkline: Array(24).fill(0).map(() => Math.random() * coin.quote.USD.price), // Placeholder sparkline data
      }));
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      return [];
    }
  }

  static async getMarketPairs(symbol: string) {
    const data = await this.fetchWithAuth(`/cryptocurrency/market-pairs/latest?symbol=${symbol}`);
    return data;
  }

  static async getPrice(symbol: string): Promise<CryptoPrice> {
    const data = await this.fetchWithAuth(`/cryptocurrency/quotes/latest?symbol=${symbol}`);
    const quote = data.data[symbol].quote.USD;
    return {
      price: quote.price,
      change24h: quote.percent_change_24h,
      volume24h: quote.volume_24h,
      marketCap: quote.market_cap,
      lastUpdated: quote.last_updated,
    };
  }

  static async getMarketOverview(): Promise<MarketData> {
    try {
      const [globalData, btcData, ethData, dioneData] = await Promise.all([
        this.fetchWithAuth("/global-metrics/quotes/latest"),
        this.fetchWithAuth("/cryptocurrency/quotes/latest?symbol=BTC"),
        this.fetchWithAuth("/cryptocurrency/quotes/latest?symbol=ETH"),
        this.fetchWithAuth("/cryptocurrency/quotes/latest?id=21473") // Dione Protocol ID
      ]);

      if (!globalData.data) {
        return {
          totalMarketCap: 0,
          totalVolume24h: 0,
          btcDominance: 0,
          ethDominance: 0,
          marketCapChange24h: 0,
          marketSentiment: 0,
          btcPrice: 0,
          ethPrice: 0,
          dionePrice: 0,
          dioneChange24h: 0,
          dioneVolume24h: 0,
          btcVolume24h: 0,
          ethVolume24h: 0,
        };
      }

      const quote = globalData.data.quote.USD;
      const btcPrice = btcData.data?.BTC?.quote?.USD ;
      const ethPrice = ethData.data?.ETH?.quote?.USD ;
      const dioneQuote = dioneData.data?.['21473']?.quote?.USD;

      return {
        totalMarketCap: quote.total_market_cap,
        totalVolume24h: quote.total_volume_24h,
        btcDominance: globalData.data.btc_dominance,
        ethDominance: globalData.data.eth_dominance,
        marketCapChange24h: quote.total_market_cap_yesterday_percentage_change,
        marketSentiment: globalData.data.market_sentiment,
        btcPrice,
        ethPrice,
        dionePrice: dioneQuote?.price || 0,
        dioneChange24h: dioneQuote?.percent_change_24h || 0,
        ethChange24h: ethPrice?.percent_change_24h || 0,
        btcChange24h: btcPrice?.percent_change_24h || 0,
        dioneVolume24h: dioneQuote?.volume_24h || 0,
        btcVolume24h: btcPrice?.volume_24h || 0,
        ethVolume24h: ethPrice?.volume_24h || 0,
      };
    } catch {
      return {
        totalMarketCap: 0,
        totalVolume24h: 0,
        btcDominance: 0,
        ethDominance: 0,
        marketCapChange24h: 0,
        marketSentiment: 0,
        btcPrice: 0,
        ethPrice: 0,
        dionePrice: 0,
        dioneChange24h: 0,
        dioneVolume24h: 0,
      };
    }
  }

  static async getTopCoins(): Promise<TopCoin[]> {
    const data = await this.fetchWithAuth("/cryptocurrency/listings/latest?limit=5000");
    return data.data.map((coin: any) => ({
      id: coin.id,
      rank: coin.cmc_rank,
      symbol: coin.symbol,
      name: coin.name,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      price: coin.quote.USD.price,
      change24h: coin.quote.USD.percent_change_24h,
      change7d: coin.quote.USD.percent_change_7d,
      marketCap: coin.quote.USD.market_cap,
      volume24h: coin.quote.USD.volume_24h,
    }));
  }

  static async getHistoricalData(symbol: string, interval: string): Promise<any[]> {
    const data = await this.fetchWithAuth(
      `/cryptocurrency/quotes/historical?symbol=${symbol}&interval=${interval}`
    );
    return data.data.map((point: any) => ({
      timestamp: point.timestamp,
      price: point.quote.USD.price,
      volume: point.quote.USD.volume_24h,
    }));
  }

  static async getTopMovers(): Promise<TopMover[]> {
    try {
      const gainers = await this.fetchWithAuth("/cryptocurrency/listings/latest?limit=5&sort=percent_change_24h");
      const losers = await this.fetchWithAuth("/cryptocurrency/listings/latest?limit=5&sort=percent_change_24h&sort_dir=asc");
      
      if (!gainers.data || !losers.data) {
        return [];
      }

      const mapCoins = (coin: any): TopMover => ({
        id: coin.id.toString(),
        symbol: coin.symbol,
        name: coin.name,
        change: coin.quote.USD.percent_change_24h,
        price: coin.quote.USD.price,
        image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      });

      return [...gainers.data.map(mapCoins), ...losers.data.map(mapCoins)];
    } catch (error) {
      console.error('Error fetching top movers:', error);
      return [];
    }
  }

  static async getDefiTokens(): Promise<DefiToken[]> {
    try {
      const data = await this.fetchWithAuth(
        "/cryptocurrency/listings/latest?limit=50&cryptocurrency_type=tokens&tag=defi"
      );

      if (!data.data || !Array.isArray(data.data)) {
        return [];
      }

      return data.data.map((token: any) => ({
        id: token.id.toString(),
        symbol: token.symbol,
        name: token.name,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Generate random color
        marketCap: token.quote.USD.market_cap,
        category: token.tags?.[0] || 'DeFi',
      }));
    } catch (error) {
      console.error('Error fetching DeFi tokens:', error);
      return [];
    }
  }

  static async getVolumeHistory(symbol: string): Promise<VolumeData[]> {
    try {
      // Using global metrics endpoint for total volume
      const data = await this.fetchWithAuth('/global-metrics/quotes/latest');

      if (!data.data || !data.data.quote || !data.data.quote.USD) {
        return this.getFallbackData();
      }

      const baseVolume = data.data.quote.USD.total_volume_24h;
      
      // Get the last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();

      // Create simulated historical data based on current total volume
      return dates.map((date) => ({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        // Add some variation to make it look realistic
        volume: baseVolume * (0.85 + (Math.random() * 0.3)) * 
          // If BTC, use full volume, otherwise use a fraction
          (symbol === 'BTC' ? 1 : 0.2),
      }));

    } catch (error) {
      console.error('Error fetching volume history:', error);
      return this.getFallbackData();
    }
  }

  private static getFallbackData(): VolumeData[] {
    return [
      { day: "Mon", volume: 28.5 * 1e9 },
      { day: "Tue", volume: 32.1 * 1e9 },
      { day: "Wed", volume: 25.8 * 1e9 },
      { day: "Thu", volume: 35.2 * 1e9 },
      { day: "Fri", volume: 30.9 * 1e9 },
      { day: "Sat", volume: 22.4 * 1e9 },
      { day: "Sun", volume: 20.7 * 1e9 },
    ];
  }
} 