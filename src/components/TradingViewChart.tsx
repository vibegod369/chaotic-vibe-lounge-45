
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlitchText from './GlitchText';

interface TradingViewChartProps {
  symbol: string;
}

const TradingViewChart = ({ symbol }: TradingViewChartProps) => {
  const [chartType, setChartType] = useState<'candlestick' | 'depth'>('candlestick');
  
  // For demo purposes, we're mocking TradingView charts with CSS-only visuals
  const renderMockChart = () => {
    if (chartType === 'candlestick') {
      return (
        <div className="h-[400px] w-full relative">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-grow p-4 overflow-hidden">
              {/* Mock chart lines */}
              <div className="h-full w-full relative">
                {/* Grid lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={`h-line-${i}`}
                    className="absolute left-0 right-0 border-t border-vibe-neon/10"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={`v-line-${i}`}
                    className="absolute top-0 bottom-0 border-l border-vibe-neon/10"
                    style={{ left: `${i * 10}%` }}
                  />
                ))}
                
                {/* Mock chart pattern */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M0,50 L5,45 L10,55 L15,40 L20,60 L25,50 L30,45 L35,30 L40,35 L45,25 L50,40 L55,30 L60,40 L65,35 L70,50 L75,45 L80,55 L85,40 L90,45 L95,35 L100,40" 
                    stroke="#00ff8c" 
                    strokeWidth="0.5" 
                    fill="none" 
                    className="animate-pulse-subtle"
                  />
                  <path 
                    d="M0,60 L10,65 L20,55 L30,70 L40,60 L50,65 L60,55 L70,60 L80,50 L90,55 L100,60" 
                    stroke="#ff00dd" 
                    strokeWidth="0.5" 
                    fill="none" 
                    strokeDasharray="2,1"
                    className="animate-pulse-subtle"
                  />
                </svg>
                
                {/* Mock candlesticks */}
                <div className="absolute inset-0 flex items-end">
                  <div className="flex w-full h-full items-end justify-between px-2">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const isGreen = Math.random() > 0.5;
                      const height = 20 + Math.random() * 40;
                      const wickHeight = height + 10 + Math.random() * 15;
                      return (
                        <div key={i} className="relative flex flex-col items-center">
                          <div 
                            className={`w-0.5 ${isGreen ? 'bg-vibe-neon' : 'bg-vibe-pink'}`}
                            style={{ height: `${wickHeight}%` }}
                          />
                          <div 
                            className={`w-2 absolute bottom-0 ${isGreen ? 'bg-vibe-neon' : 'bg-vibe-pink'}`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Time labels */}
            <div className="h-6 flex justify-between px-4 text-xs text-gray-500 border-t border-vibe-blue/20 bg-black/40">
              <span>09:00</span>
              <span>12:00</span>
              <span>15:00</span>
              <span>18:00</span>
              <span>21:00</span>
            </div>
          </div>
        </div>
      );
    } else {
      // Depth chart
      return (
        <div className="h-[400px] w-full relative">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-grow p-4 overflow-hidden">
              {/* Mock depth chart */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Buy side */}
                <defs>
                  <linearGradient id="buyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00ff8c" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00ff8c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M50,100 L50,50 L40,60 L30,65 L20,70 L10,80 L0,85 L0,100 Z" 
                  fill="url(#buyGradient)" 
                  stroke="#00ff8c" 
                  strokeWidth="0.5"
                />
                
                {/* Sell side */}
                <defs>
                  <linearGradient id="sellGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff00dd" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ff00dd" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M50,100 L50,50 L60,60 L70,65 L80,75 L90,85 L100,90 L100,100 Z" 
                  fill="url(#sellGradient)" 
                  stroke="#ff00dd" 
                  strokeWidth="0.5"
                />
                
                {/* Center line */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="2,1" />
              </svg>
              
              {/* Price markers */}
              <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-between px-2 text-xs">
                <span className="text-vibe-neon">+5%</span>
                <span className="text-white">0%</span>
                <span className="text-vibe-pink">-5%</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="h-6 flex justify-between px-4 text-xs border-t border-vibe-blue/20 bg-black/40">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-vibe-neon/30 border border-vibe-neon mr-1"></div>
                <span className="text-gray-400">Buy Orders</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-vibe-pink/30 border border-vibe-pink mr-1"></div>
                <span className="text-gray-400">Sell Orders</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <Card className="card-chaos overflow-hidden">
      <div className="p-4 border-b border-vibe-blue/30">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">
            <GlitchText text={`${symbol} Advanced Chart`} intensity="low" color="blue" />
          </h3>
          
          <Tabs value={chartType} onValueChange={(v) => setChartType(v as 'candlestick' | 'depth')}>
            <TabsList className="grid grid-cols-2 w-48 bg-black/40">
              <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
              <TabsTrigger value="depth">Depth</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="bg-vibe-dark/90">
        {renderMockChart()}
      </div>
    </Card>
  );
};

export default TradingViewChart;
