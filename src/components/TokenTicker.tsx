
import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlitchText from './GlitchText';

interface TokenData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  supply: number;
}

const initialTokenData: TokenData = {
  name: "Vibe",
  symbol: "VIBE",
  price: 0.00042069,
  change24h: 13.37,
  volume24h: 1250000,
  marketCap: 4200000,
  supply: 1000000000,
};

const TokenTicker = () => {
  const [tokenData, setTokenData] = useState<TokenData>(initialTokenData);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      const randomChange = (Math.random() - 0.45) * 0.01;
      const newPrice = tokenData.price * (1 + randomChange);
      const newChange = tokenData.change24h + (randomChange * 100);
      
      setTokenData(prev => ({
        ...prev,
        price: newPrice,
        change24h: newChange,
        volume24h: prev.volume24h + (Math.random() * 1000 - 500),
      }));
      
      // Randomly trigger glitch effect
      if (Math.random() > 0.85) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 500);
      }
      
    }, 5000);
    
    return () => clearInterval(interval);
  }, [tokenData]);

  const formatNumber = (num: number, decimals = 2) => {
    if (num > 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num > 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(decimals);
  };

  return (
    <div className={cn(
      "w-full backdrop-blur-sm bg-black/40 border border-vibe-pink/30 p-4 rounded-md overflow-hidden",
      "transition-all duration-300",
      glitching && "animate-shake"
    )}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vibe-neon to-vibe-blue flex items-center justify-center mr-3 animate-pulse-neon">
            <span className="text-black font-bold">V</span>
          </div>
          <div>
            <h3 className="text-xl font-bold">{tokenData.name}</h3>
            <p className="text-sm text-gray-400 font-code">${tokenData.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            <GlitchText text={`$${tokenData.price.toFixed(8)}`} intensity="low" color="neon" />
          </div>
          <div className={cn(
            "flex items-center justify-end text-sm",
            tokenData.change24h >= 0 ? "text-vibe-neon" : "text-vibe-pink"
          )}>
            {tokenData.change24h >= 0 ? (
              <ArrowUpIcon className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 mr-1" />
            )}
            {Math.abs(tokenData.change24h).toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm font-code">
        <div className="bg-black/30 p-3 rounded border border-vibe-blue/20 hover:border-vibe-blue/50 transition-all">
          <p className="text-gray-400 mb-1">24h Volume</p>
          <p className="text-white font-bold">${formatNumber(tokenData.volume24h)}</p>
        </div>
        <div className="bg-black/30 p-3 rounded border border-vibe-yellow/20 hover:border-vibe-yellow/50 transition-all">
          <p className="text-gray-400 mb-1">Market Cap</p>
          <p className="text-white font-bold">${formatNumber(tokenData.marketCap)}</p>
        </div>
        <div className="bg-black/30 p-3 rounded border border-vibe-neon/20 hover:border-vibe-neon/50 transition-all">
          <p className="text-gray-400 mb-1">Total Supply</p>
          <p className="text-white font-bold">{formatNumber(tokenData.supply, 0)}</p>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400 font-code">Contract Address:</p>
        <p className="text-sm font-code text-vibe-yellow break-all">0x5Ca1Ab1E70603Be5B3c063C3AD8E5f19E2822575</p>
      </div>
    </div>
  );
};

export default TokenTicker;
