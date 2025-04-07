
import { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import SwapInterface from '@/components/SwapInterface';
import PriceChart from '@/components/PriceChart';
import TokenTicker from '@/components/TokenTicker';
import Orderbook from '@/components/Orderbook';
import TradingViewChart from '@/components/TradingViewChart';
import VibeContributor from '@/components/VibeContributor';
import BridgedTokenInfo from '@/components/BridgedTokenInfo';

const VibeDex = () => {
  const [activeToken, setActiveToken] = useState('VIBE');
  
  const handleTokenChange = (token: string) => {
    setActiveToken(token);
  };

  return (
    <div className="container mx-auto px-4 pb-12 pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          <SwapInterface />
          <BridgedTokenInfo />
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-6 space-y-6">
          <TokenTicker />
          <Tabs defaultValue="chart">
            <TabsList className="w-full grid grid-cols-2 h-11 bg-black/60">
              <TabsTrigger value="chart">Price Chart</TabsTrigger>
              <TabsTrigger value="tradingview">Advanced Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-4">
              <PriceChart symbol={activeToken} baseToken="ETH" />
            </TabsContent>
            <TabsContent value="tradingview" className="mt-4">
              <TradingViewChart symbol={activeToken} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-3 space-y-6">
          <Orderbook baseToken={activeToken} quoteToken="ETH" />
          <VibeContributor />
        </div>
      </div>
    </div>
  );
};

export default VibeDex;
