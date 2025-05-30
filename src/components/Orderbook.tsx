import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GlitchText from './GlitchText';
import { ethers } from 'ethers';
import uniswapService from '@/services/uniswap';
import walletService from '@/services/wallet';
import { toast } from 'sonner';
import geckoTerminalService from '@/services/geckoTerminal';

interface Order {
  price: number;
  priceUsd: number;
  amount: number;
  total: number;
}

interface OrderbookProps {
  baseToken: string;
  quoteToken: string;
}

const UNISWAP_PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)"
];

const UNISWAP_FACTORY_ABI = [
  "function getPair(address tokenA, address tokenB) external view returns (address pair)"
];

const FACTORY_ADDRESS = '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB'; // BaseSwap factory

const Orderbook = ({ baseToken, quoteToken }: OrderbookProps) => {
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentPriceUsd, setCurrentPriceUsd] = useState(0);
  const [spread, setSpread] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pairAddress, setPairAddress] = useState<string | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchUsdPrice = async () => {
      try {
        const ethPrice = await geckoTerminalService.getTokenPrice('ETH');
        if (ethPrice && ethPrice.usd) {
          setUsdRate(ethPrice.usd);
        }
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      }
    };
    
    fetchUsdPrice();
    const interval = setInterval(fetchUsdPrice, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const fetchPairAndOrderbook = async () => {
      setIsLoading(true);
      
      try {
        const tokenPrice = await geckoTerminalService.getTokenPrice(baseToken);
        if (tokenPrice && tokenPrice.usd > 0) {
          console.log(`Direct token price from GeckoTerminal: $${tokenPrice.usd}`);
          setCurrentPriceUsd(tokenPrice.usd);
        }
        
        const baseTokenAddress = uniswapService.getAvailableTokens().find(t => t.symbol === baseToken)?.address;
        const quoteTokenAddress = uniswapService.getAvailableTokens().find(t => t.symbol === quoteToken)?.address;
        
        if (!baseTokenAddress || !quoteTokenAddress) {
          throw new Error("Token addresses not found");
        }
        
        let provider;
        if (walletService.wallet?.provider) {
          provider = walletService.wallet.provider;
        } else {
          provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
        }
        
        const factory = new ethers.Contract(FACTORY_ADDRESS, UNISWAP_FACTORY_ABI, provider);
        const pairAddr = await factory.getPair(baseTokenAddress, quoteTokenAddress);
        
        if (pairAddr === ethers.constants.AddressZero) {
          console.log("No pair found, using mock data");
          generateMockOrderbook();
          return;
        }
        
        setPairAddress(pairAddr);
        
        const pair = new ethers.Contract(pairAddr, UNISWAP_PAIR_ABI, provider);
        const [reserves0, reserves1] = await pair.getReserves();
        const token0 = await pair.token0();
        
        const baseIsToken0 = baseTokenAddress.toLowerCase() === token0.toLowerCase();
        const baseReserve = baseIsToken0 ? reserves0 : reserves1;
        const quoteReserve = baseIsToken0 ? reserves1 : reserves0;
        
        const price = quoteReserve.mul(ethers.utils.parseUnits("1", 18)).div(baseReserve);
        const basePrice = parseFloat(ethers.utils.formatUnits(price, 18));
        setCurrentPrice(basePrice);
        
        if (usdRate && basePrice) {
          setCurrentPriceUsd(basePrice * usdRate);
        }
        
        generateOrderbookFromPrice(basePrice);
      } catch (error) {
        console.error("Error fetching pair data:", error);
        generateMockOrderbook();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPairAndOrderbook();
    
    const interval = setInterval(() => {
      fetchPairAndOrderbook();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [baseToken, quoteToken, usdRate]);
  
  const generateMockOrderbook = async () => {
    let basePrice;
    let usdPrice = null;
    
    try {
      const tokenPrice = await geckoTerminalService.getTokenPrice(baseToken);
      if (tokenPrice && tokenPrice.eth > 0) {
        basePrice = tokenPrice.eth;
        usdPrice = tokenPrice.usd;
        console.log(`Using GeckoTerminal price for ${baseToken}: ${basePrice} ETH, $${usdPrice}`);
      } else {
        if (baseToken === 'BRETT') basePrice = 0.00001815;
        else if (baseToken === 'QR') basePrice = 0.0000025;
        else if (baseToken === 'PUBLIC') basePrice = 0.000002;
        else if (baseToken === 'VIBE') basePrice = 0.0000002;
        else basePrice = 0.000001;
      }
    } catch (error) {
      console.error("Error getting token price from GeckoTerminal:", error);
      if (baseToken === 'BRETT') basePrice = 0.00001815;
      else if (baseToken === 'QR') basePrice = 0.0000025;
      else if (baseToken === 'PUBLIC') basePrice = 0.000002;
      else if (baseToken === 'VIBE') basePrice = 0.0000002;
      else basePrice = 0.000001;
    }
    
    setCurrentPrice(basePrice);
    
    if (usdPrice !== null) {
      setCurrentPriceUsd(usdPrice);
    } else if (usdRate) {
      setCurrentPriceUsd(basePrice * usdRate);
    }
    
    generateOrderbookFromPrice(basePrice);
  };
  
  const generateOrderbookFromPrice = (basePrice: number) => {
    const newAsks: Order[] = [];
    const newBids: Order[] = [];
    
    let totalAsk = 0;
    for (let i = 0; i < 10; i++) {
      const price = basePrice * (1 + (i + 1) * 0.001);
      const amount = Math.random() * 10 + 1;
      totalAsk += amount;
      const priceUsd = usdRate ? price * usdRate : 0;
      
      newAsks.push({ 
        price: parseFloat(price.toFixed(10)), 
        priceUsd: parseFloat(priceUsd.toFixed(6)),
        amount: parseFloat(amount.toFixed(4)), 
        total: parseFloat(totalAsk.toFixed(4)) 
      });
    }
    
    let totalBid = 0;
    for (let i = 0; i < 10; i++) {
      const price = basePrice * (1 - (i + 1) * 0.001);
      const amount = Math.random() * 10 + 1;
      totalBid += amount;
      const priceUsd = usdRate ? price * usdRate : 0;
      
      newBids.push({ 
        price: parseFloat(price.toFixed(10)), 
        priceUsd: parseFloat(priceUsd.toFixed(6)),
        amount: parseFloat(amount.toFixed(4)), 
        total: parseFloat(totalBid.toFixed(4)) 
      });
    }
    
    newAsks.sort((a, b) => a.price - b.price);
    newBids.sort((a, b) => b.price - a.price);
    
    const lowestAsk = newAsks[0].price;
    const highestBid = newBids[0].price;
    const calculatedSpread = ((lowestAsk - highestBid) / lowestAsk) * 100;
    
    setAsks(newAsks);
    setBids(newBids);
    setSpread(parseFloat(calculatedSpread.toFixed(4)));
  };
  
  const handleBuy = () => {
    if (!walletService.isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.success(`Buy order for ${baseToken} at ${currentPrice.toFixed(10)} ${quoteToken} ($${currentPriceUsd.toFixed(6)})`);
  };
  
  const handleSell = () => {
    if (!walletService.isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.success(`Sell order for ${baseToken} at ${currentPrice.toFixed(10)} ${quoteToken} ($${currentPriceUsd.toFixed(6)})`);
  };
  
  const getMaxTotal = () => {
    const maxAsk = asks.length > 0 ? asks[asks.length - 1].total : 0;
    const maxBid = bids.length > 0 ? bids[bids.length - 1].total : 0;
    return Math.max(maxAsk, maxBid);
  };
  
  const maxTotal = getMaxTotal();
  
  return (
    <Card className="card-chaos overflow-hidden h-full">
      <div className="p-3 border-b border-vibe-blue/30">
        <h3 className="text-sm font-bold">
          <GlitchText text={`${baseToken}/${quoteToken} Orderbook`} intensity="low" color="blue" />
        </h3>
        {pairAddress && (
          <p className="text-xs text-gray-500 mt-1 font-code">
            Pair: {pairAddress.substring(0, 6)}...{pairAddress.substring(38)}
          </p>
        )}
      </div>
      
      <div className="bg-vibe-dark/80 text-xs">
        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-vibe-blue animate-pulse">Loading orderbook data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 px-3 py-1 font-code border-b border-vibe-blue/30 bg-black/40">
              <div>Price (ETH)</div>
              <div>Price (USD)</div>
              <div className="text-right">Amount ({baseToken})</div>
              <div className="text-right">Total</div>
            </div>
            
            <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-vibe-pink">
              {asks.map((order, index) => (
                <div
                  key={`ask-${index}`}
                  className="grid grid-cols-4 px-3 py-1 font-code border-b border-vibe-pink/5 relative"
                >
                  <div 
                    className="absolute top-0 right-0 h-full bg-vibe-pink/5"
                    style={{ width: `${(order.total / maxTotal) * 100}%` }}
                  />
                  <div className="z-10 text-vibe-pink">{order.price.toFixed(10)}</div>
                  <div className="z-10 text-vibe-pink">${order.priceUsd.toFixed(6)}</div>
                  <div className="z-10 text-right">{order.amount}</div>
                  <div className="z-10 text-right">{order.total}</div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 px-3 py-2 font-code border-b border-vibe-neon/30 bg-black/60">
              <div>
                <div className="text-vibe-neon font-bold">{currentPrice.toFixed(10)} ETH</div>
                <div className="text-vibe-neon mt-1">${currentPriceUsd.toFixed(6)} USD</div>
              </div>
              <div className="text-right text-gray-500">Spread: {spread}%</div>
            </div>
            
            <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-vibe-neon">
              {bids.map((order, index) => (
                <div
                  key={`bid-${index}`}
                  className="grid grid-cols-4 px-3 py-1 font-code border-b border-vibe-neon/5 relative"
                >
                  <div 
                    className="absolute top-0 right-0 h-full bg-vibe-neon/5"
                    style={{ width: `${(order.total / maxTotal) * 100}%` }}
                  />
                  <div className="z-10 text-vibe-neon">{order.price.toFixed(10)}</div>
                  <div className="z-10 text-vibe-neon">${order.priceUsd.toFixed(6)}</div>
                  <div className="z-10 text-right">{order.amount}</div>
                  <div className="z-10 text-right">{order.total}</div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-2 bg-black/40">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-vibe-neon border-vibe-neon hover:bg-vibe-neon/20"
                onClick={handleBuy}
              >
                Buy
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-vibe-pink border-vibe-pink hover:bg-vibe-pink/20"
                onClick={handleSell}
              >
                Sell
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default Orderbook;
