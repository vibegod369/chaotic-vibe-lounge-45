
import { useState, useEffect } from 'react';
import TokenTicker from "@/components/TokenTicker";
import GlitchText from "@/components/GlitchText";
import SwapInterface from "@/components/SwapInterface";
import PriceChart from "@/components/PriceChart";
import TradingViewChart from "@/components/TradingViewChart";
import Orderbook from "@/components/Orderbook";
import geckoTerminalService from '@/services/geckoTerminal';

interface TokenPrice {
  symbol: string;
  usd: number;
  eth: number;
}

const VibeDex = () => {
  const [selectedPair, setSelectedPair] = useState("BRETT");
  const [baseToken, setBaseToken] = useState("ETH");
  const [tokenPrices, setTokenPrices] = useState<Record<string, TokenPrice>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch token prices on component mount
  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      const tokens = ['BRETT', 'QR', 'PUBLIC', 'VIBE'];
      const prices: Record<string, TokenPrice> = {};
      
      // Fetch prices for all tokens
      for (const symbol of tokens) {
        try {
          const price = await geckoTerminalService.getTokenPrice(symbol);
          if (price) {
            prices[symbol] = {
              symbol,
              usd: price.usd,
              eth: price.eth
            };
            console.log(`${symbol} price: $${price.usd}, ${price.eth} ETH`);
          } else {
            // Fallback prices
            prices[symbol] = {
              symbol,
              usd: symbol === 'BRETT' ? 0.03041 : symbol === 'QR' ? 0.00419 : symbol === 'PUBLIC' ? 0.00335 : 0.00073,
              eth: symbol === 'BRETT' ? 0.00001815 : symbol === 'QR' ? 0.0000025 : symbol === 'PUBLIC' ? 0.000002 : 0.0000002
            };
          }
        } catch (error) {
          console.error(`Error fetching price for ${symbol}:`, error);
          // Fallback prices
          prices[symbol] = {
            symbol,
            usd: symbol === 'BRETT' ? 0.03041 : symbol === 'QR' ? 0.00419 : symbol === 'PUBLIC' ? 0.00335 : 0.00073,
            eth: symbol === 'BRETT' ? 0.00001815 : symbol === 'QR' ? 0.0000025 : symbol === 'PUBLIC' ? 0.000002 : 0.0000002
          };
        }
      }
      
      setTokenPrices(prices);
      setIsLoading(false);
    };
    
    fetchPrices();
    
    // Refresh prices every minute
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Fallback values for percentages and addresses (to be replaced with real data later)
  const tokenChanges = {
    'BRETT': +8.4,
    'QR': -2.1,
    'PUBLIC': +12.7,
    'VIBE': +13.4
  };
  
  const tokenAddresses = {
    'BRETT': '0x532f27101965dd16442e59d40670faf5ebb142e4',
    'QR': '0x6c1822168cf3f961f58e3249ba5f9f6b14c363d7',
    'PUBLIC': '0x6966954da0b7f6be3e4c0fa64ed6f38ffde22322',
    'VIBE': '0x7048d52bab5c458e8127a0018cde59a3b3427f38'
  };
  
  return (
    <main className="flex-grow pt-24">
      <section className="py-12 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <GlitchText text="VIBE DEX" color="neon" />
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The chaotic decentralized exchange where $VIBE powers every trade. Embrace the volatility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left column - Swap interface and Token ticker */}
            <div className="lg:col-span-1 space-y-6">
              <SwapInterface />
              <TokenTicker />
            </div>
            
            {/* Middle column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              <PriceChart symbol={selectedPair} baseToken={baseToken} />
              <TradingViewChart symbol={selectedPair} />
            </div>
            
            {/* Right column - Orderbook */}
            <div className="lg:col-span-1">
              <Orderbook baseToken={selectedPair} quoteToken={baseToken} />
            </div>
          </div>
          
          {/* Trading pairs section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <GlitchText text="TRENDING PAIRS" color="pink" />
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* BRETT/ETH */}
              <div 
                className={`card-chaos p-4 cursor-pointer transition-all ${selectedPair === 'BRETT' ? 'border-vibe-neon' : ''}`}
                onClick={() => {
                  setSelectedPair('BRETT');
                  setBaseToken('ETH');
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">B</span>
                    </div>
                    <div>
                      <h3 className="font-bold">BRETT</h3>
                      <p className="text-xs text-gray-400">Brett Token</p>
                    </div>
                  </div>
                  <div className={tokenChanges.BRETT >= 0 ? "text-vibe-neon" : "text-vibe-pink"}>
                    {tokenChanges.BRETT > 0 ? '+' : ''}{tokenChanges.BRETT}%
                  </div>
                </div>
                <div className="text-xl font-bold font-code">
                  {tokenPrices.BRETT ? tokenPrices.BRETT.eth.toFixed(10) : '0.00001815'} ETH
                </div>
                <div className="text-xs text-gray-400">
                  ${tokenPrices.BRETT ? tokenPrices.BRETT.usd.toFixed(6) : '0.03041'}
                </div>
                <div className="text-xs text-gray-500 mt-2 font-code truncate">
                  {tokenAddresses.BRETT}
                </div>
              </div>
              
              {/* QR/ETH */}
              <div 
                className={`card-chaos p-4 cursor-pointer transition-all ${selectedPair === 'QR' ? 'border-vibe-neon' : ''}`}
                onClick={() => {
                  setSelectedPair('QR');
                  setBaseToken('ETH');
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">QR</span>
                    </div>
                    <div>
                      <h3 className="font-bold">QR</h3>
                      <p className="text-xs text-gray-400">QR Token</p>
                    </div>
                  </div>
                  <div className={tokenChanges.QR >= 0 ? "text-vibe-neon" : "text-vibe-pink"}>
                    {tokenChanges.QR > 0 ? '+' : ''}{tokenChanges.QR}%
                  </div>
                </div>
                <div className="text-xl font-bold font-code">
                  {tokenPrices.QR ? tokenPrices.QR.eth.toFixed(10) : '0.0000025'} ETH
                </div>
                <div className="text-xs text-gray-400">
                  ${tokenPrices.QR ? tokenPrices.QR.usd.toFixed(6) : '0.00419'}
                </div>
                <div className="text-xs text-gray-500 mt-2 font-code truncate">
                  {tokenAddresses.QR}
                </div>
              </div>
              
              {/* PUBLIC/ETH */}
              <div 
                className={`card-chaos p-4 cursor-pointer transition-all ${selectedPair === 'PUBLIC' ? 'border-vibe-neon' : ''}`}
                onClick={() => {
                  setSelectedPair('PUBLIC');
                  setBaseToken('ETH');
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">P</span>
                    </div>
                    <div>
                      <h3 className="font-bold">PUBLIC</h3>
                      <p className="text-xs text-gray-400">Public Token</p>
                    </div>
                  </div>
                  <div className={tokenChanges.PUBLIC >= 0 ? "text-vibe-neon" : "text-vibe-pink"}>
                    {tokenChanges.PUBLIC > 0 ? '+' : ''}{tokenChanges.PUBLIC}%
                  </div>
                </div>
                <div className="text-xl font-bold font-code">
                  {tokenPrices.PUBLIC ? tokenPrices.PUBLIC.eth.toFixed(10) : '0.000002'} ETH
                </div>
                <div className="text-xs text-gray-400">
                  ${tokenPrices.PUBLIC ? tokenPrices.PUBLIC.usd.toFixed(6) : '0.00335'}
                </div>
                <div className="text-xs text-gray-500 mt-2 font-code truncate">
                  {tokenAddresses.PUBLIC}
                </div>
              </div>
              
              {/* VIBE/ETH */}
              <div 
                className={`card-chaos p-4 cursor-pointer transition-all ${selectedPair === 'VIBE' ? 'border-vibe-neon' : ''}`}
                onClick={() => {
                  setSelectedPair('VIBE');
                  setBaseToken('ETH');
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vibe-neon to-vibe-blue flex items-center justify-center">
                      <span className="text-white font-bold text-xs">V</span>
                    </div>
                    <div>
                      <h3 className="font-bold">VIBE</h3>
                      <p className="text-xs text-gray-400">Vibe Token</p>
                    </div>
                  </div>
                  <div className={tokenChanges.VIBE >= 0 ? "text-vibe-neon" : "text-vibe-pink"}>
                    {tokenChanges.VIBE > 0 ? '+' : ''}{tokenChanges.VIBE}%
                  </div>
                </div>
                <div className="text-xl font-bold font-code">
                  {tokenPrices.VIBE ? tokenPrices.VIBE.eth.toFixed(10) : '0.0000002'} ETH
                </div>
                <div className="text-xs text-gray-400">
                  ${tokenPrices.VIBE ? tokenPrices.VIBE.usd.toFixed(6) : '0.00073'}
                </div>
                <div className="text-xs text-gray-500 mt-2 font-code truncate">
                  {tokenAddresses.VIBE}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-vibe-pink/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-vibe-blue/20 rounded-full blur-3xl -z-10"></div>
      </section>
    </main>
  );
};

export default VibeDex;
