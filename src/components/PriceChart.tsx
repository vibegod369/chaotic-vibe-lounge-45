import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUpIcon, TrendingDownIcon, CircleDollarSignIcon } from 'lucide-react';
import GlitchText from './GlitchText';
import { ethers } from 'ethers';
import uniswapService from '@/services/uniswap';

interface PriceDataPoint {
  name: string;
  price: number;
  volume: number;
}

interface PriceChartProps {
  symbol: string;
  baseToken: string;
}

const fetchHistoricalPrices = async (tokenAddress: string, timeframe: string) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
    
    const mockData: PriceDataPoint[] = [];
    const points = timeframe === '24h' ? 24 : timeframe === '7d' ? 28 : 30;
    
    let basePrice;
    if (tokenAddress === uniswapService.getAvailableTokens().find(t => t.symbol === 'BRETT')?.address) {
      basePrice = 0.32;
    } else if (tokenAddress === uniswapService.getAvailableTokens().find(t => t.symbol === 'QR')?.address) {
      basePrice = 0.0045;
    } else if (tokenAddress === uniswapService.getAvailableTokens().find(t => t.symbol === 'PUBLIC')?.address) {
      basePrice = 0.003;
    } else {
      basePrice = 1800;
    }
    
    let lastPrice = basePrice;
    const volatility = 0.05;
    const trend = Math.random() > 0.5 ? 1 : -1;
    
    for (let i = 0; i < points; i++) {
      const randomFactor = Math.random() * volatility;
      const trendFactor = trend * (i / points) * 0.1;
      const change = randomFactor - (volatility / 2) + trendFactor;
      
      lastPrice = lastPrice * (1 + change);
      lastPrice = Math.max(lastPrice, basePrice * 0.7);
      
      mockData.push({
        name: timeframe === '24h' 
          ? `${i}:00` 
          : timeframe === '7d' 
            ? `Day ${Math.floor(i/4) + 1}` 
            : `Day ${i+1}`,
        price: parseFloat(lastPrice.toFixed(6)),
        volume: Math.floor(Math.random() * 100000) + 10000,
      });
    }
    
    return mockData;
  } catch (error) {
    console.error("Error fetching historical prices:", error);
    return [];
  }
};

const PriceChart = ({ symbol, baseToken }: PriceChartProps) => {
  const [data, setData] = useState<PriceDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });

  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true);
      
      try {
        const tokenAddress = uniswapService.getAvailableTokens().find(t => t.symbol === symbol)?.address;
        
        if (!tokenAddress) {
          throw new Error("Token address not found");
        }
        
        const historicalData = await fetchHistoricalPrices(tokenAddress, timeframe);
        
        if (historicalData.length > 0) {
          const startPrice = historicalData[0].price;
          const endPrice = historicalData[historicalData.length - 1].price;
          const change = endPrice - startPrice;
          const changePercent = (change / startPrice) * 100;
          
          setPriceChange({
            value: change,
            percent: changePercent
          });
          
          setData(historicalData);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        generateChartData();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPriceData();
  }, [symbol, timeframe]);

  const generateChartData = async () => {
    try {
      const mockData: PriceDataPoint[] = [];
      const points = timeframe === '24h' ? 24 : timeframe === '7d' ? 28 : 30;
      const volatility = symbol === 'BRETT' ? 0.15 : symbol === 'QR' ? 0.25 : 0.08;
      const basePrice = symbol === 'BRETT' ? 0.32 : symbol === 'QR' ? 0.0045 : symbol === 'PUBLIC' ? 0.003 : 1800;
      
      let lastPrice = basePrice;
      
      for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.45) * volatility;
        lastPrice = lastPrice * (1 + change);
        lastPrice = Math.max(lastPrice, basePrice * 0.5);
        
        mockData.push({
          name: timeframe === '24h' 
            ? `${i}:00` 
            : timeframe === '7d' 
              ? `Day ${Math.floor(i/4) + 1}` 
              : `Day ${i+1}`,
          price: parseFloat(lastPrice.toFixed(6)),
          volume: Math.floor(Math.random() * 100000) + 10000,
        });
      }
      
      const startPrice = mockData[0].price;
      const endPrice = mockData[mockData.length - 1].price;
      const change = endPrice - startPrice;
      const changePercent = (change / startPrice) * 100;
      
      setPriceChange({
        value: change,
        percent: changePercent
      });
      
      setData(mockData);
    } catch (error) {
      console.error("Error generating chart data:", error);
    }
  };

  const chartConfig = {
    price: { label: "Price", color: priceChange.percent >= 0 ? "#00ff8c" : "#ff00dd" },
    volume: { label: "Volume", theme: { light: "#3b82f6", dark: "#60a5fa" } }
  };

  return (
    <div className="card-chaos p-4 backdrop-blur-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <CircleDollarSignIcon className="h-5 w-5 text-vibe-neon" />
            <h2 className="text-lg font-bold">
              <GlitchText text={`${symbol}/${baseToken} Chart`} intensity="low" />
            </h2>
          </div>
          
          <div className="flex gap-2 items-center">
            <Select defaultValue={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[90px] bg-black/50 border-vibe-blue/30">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24H</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-md border border-vibe-neon/20">
          <div className="text-xl font-bold font-code">
            ${data.length > 0 ? data[data.length - 1].price.toFixed(6) : '0.00'}
          </div>
          <div className={`flex items-center ${priceChange.percent >= 0 ? 'text-vibe-neon' : 'text-vibe-pink'}`}>
            {priceChange.percent >= 0 ? (
              <TrendingUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDownIcon className="h-4 w-4 mr-1" />
            )}
            <span className="font-code">
              {priceChange.percent.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full w-full">
              <div className="animate-pulse text-vibe-blue">Loading chart data...</div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <Tabs defaultValue="line" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/50">
                  <TabsTrigger value="line">Line</TabsTrigger>
                  <TabsTrigger value="area">Area</TabsTrigger>
                </TabsList>
                
                <TabsContent value="line" className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#888" 
                        tick={{fill: '#888'}}  
                        tickLine={{stroke: '#555'}}
                      />
                      <YAxis 
                        stroke="#888" 
                        tick={{fill: '#888'}} 
                        tickLine={{stroke: '#555'}}
                        domain={['auto', 'auto']} 
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        strokeWidth={2}
                        stroke={priceChange.percent >= 0 ? "#00ff8c" : "#ff00dd"} 
                        dot={false} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="area" className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop 
                            offset="5%" 
                            stopColor={priceChange.percent >= 0 ? "#00ff8c" : "#ff00dd"} 
                            stopOpacity={0.8}
                          />
                          <stop 
                            offset="95%" 
                            stopColor={priceChange.percent >= 0 ? "#00ff8c" : "#ff00dd"} 
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#888" 
                        tick={{fill: '#888'}} 
                        tickLine={{stroke: '#555'}}
                      />
                      <YAxis 
                        stroke="#888" 
                        tick={{fill: '#888'}} 
                        tickLine={{stroke: '#555'}}
                        domain={['auto', 'auto']} 
                      />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke={priceChange.percent >= 0 ? "#00ff8c" : "#ff00dd"} 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </ChartContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
