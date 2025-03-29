
import { toast } from 'sonner';

interface TokenPrice {
  symbol: string;
  usd: number;
  eth: number;
  timestamp: number;
}

interface PriceHistory {
  timestamp: number;
  price: number;
  volume?: number;
}

interface GeckoTerminalToken {
  id: string;
  name: string;
  symbol: string;
  address: string;
  priceUsd: number;
  priceNative: number;
}

class GeckoTerminalService {
  private baseUrl = 'https://api.geckoterminal.com/api/v2';
  private priceCache: Map<string, TokenPrice> = new Map();
  private priceCacheExpiry: Map<string, number> = new Map();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  // Mapping of token symbols to GeckoTerminal token IDs
  private tokenIds: Record<string, string> = {
    'BRETT': 'based-brett',
    'QR': '0x6c1822168cf3f961f58e3249ba5f9f6b14c363d7',
    'PUBLIC': '0x6966954da0b7f6be3e4c0fa64ed6f38ffde22322',
    'VIBE': '0x7048d52bab5c458e8127a0018cde59a3b3427f38'
  };
  
  /**
   * Get current price for a token
   */
  async getTokenPrice(symbol: string): Promise<TokenPrice | null> {
    try {
      // Check cache first
      const cacheKey = symbol.toUpperCase();
      const now = Date.now();
      
      if (this.priceCache.has(cacheKey) && this.priceCacheExpiry.get(cacheKey)! > now) {
        return this.priceCache.get(cacheKey)!;
      }
      
      const tokenId = this.tokenIds[cacheKey];
      
      if (!tokenId) {
        console.warn(`No GeckoTerminal ID found for token: ${symbol}`);
        return null;
      }
      
      let endpoint;
      
      // Use different endpoints depending on whether we have a token ID or address
      if (tokenId.startsWith('0x')) {
        endpoint = `/networks/base/tokens/${tokenId}`;
      } else {
        endpoint = `/simple/tokens/${tokenId}`;
      }
      
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`GeckoTerminal API error: ${response.status}`);
      }
      
      const data = await response.json();
      const tokenData = data.data.attributes;
      
      const price: TokenPrice = {
        symbol: cacheKey,
        usd: parseFloat(tokenData.price_usd || '0'),
        eth: parseFloat(tokenData.price_eth || tokenData.price_native || '0'),
        timestamp: now
      };
      
      // Cache the price
      this.priceCache.set(cacheKey, price);
      this.priceCacheExpiry.set(cacheKey, now + this.cacheDuration);
      
      return price;
    } catch (error) {
      console.error('Error fetching token price from GeckoTerminal:', error);
      return null;
    }
  }
  
  /**
   * Get historical price data for a token
   */
  async getTokenPriceHistory(symbol: string, timeframe: '24h' | '7d' | '30d'): Promise<PriceHistory[]> {
    try {
      const cacheKey = `${symbol.toUpperCase()}_${timeframe}`;
      const tokenId = this.tokenIds[symbol.toUpperCase()];
      
      if (!tokenId) {
        console.warn(`No GeckoTerminal ID found for token: ${symbol}`);
        return [];
      }
      
      // Map timeframes to GeckoTerminal timeframes
      let geckoTimeframe;
      switch (timeframe) {
        case '24h':
          geckoTimeframe = '1H';
          break;
        case '7d':
          geckoTimeframe = '4H';
          break;
        case '30d':
          geckoTimeframe = '1D';
          break;
      }
      
      let endpoint;
      
      // Use different endpoints depending on whether we have a token ID or address
      if (tokenId.startsWith('0x')) {
        endpoint = `/networks/base/tokens/${tokenId}/ohlcv/${geckoTimeframe}`;
      } else {
        endpoint = `/tokens/${tokenId}/ohlcv/${geckoTimeframe}`;
      }
      
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`GeckoTerminal API error: ${response.status}`);
      }
      
      const data = await response.json();
      const ohlcvData = data.data || [];
      
      // Transform the data
      return ohlcvData.map((item: any) => {
        const timestamp = new Date(item.attributes.timestamp).getTime();
        const closePrice = parseFloat(item.attributes.c);
        const volume = parseFloat(item.attributes.v);
        
        return {
          timestamp,
          price: closePrice,
          volume
        };
      });
    } catch (error) {
      console.error('Error fetching price history from GeckoTerminal:', error);
      return [];
    }
  }
  
  /**
   * Get available tokens from GeckoTerminal
   */
  async getBaseNetworkTokens(): Promise<GeckoTerminalToken[]> {
    try {
      const response = await fetch(`${this.baseUrl}/networks/base/tokens`);
      
      if (!response.ok) {
        throw new Error(`GeckoTerminal API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data.map((token: any) => {
        const attributes = token.attributes;
        return {
          id: token.id,
          name: attributes.name,
          symbol: attributes.symbol,
          address: attributes.address,
          priceUsd: parseFloat(attributes.price_usd || '0'),
          priceNative: parseFloat(attributes.price_native || '0'),
        };
      });
    } catch (error) {
      console.error('Error fetching Base network tokens:', error);
      return [];
    }
  }
}

const geckoTerminalService = new GeckoTerminalService();
export default geckoTerminalService;
