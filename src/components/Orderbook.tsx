
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GlitchText from './GlitchText';

interface Order {
  price: number;
  amount: number;
  total: number;
}

interface OrderbookProps {
  baseToken: string;
  quoteToken: string;
}

const Orderbook = ({ baseToken, quoteToken }: OrderbookProps) => {
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [spread, setSpread] = useState(0);
  
  // Generate mock orderbook data
  useEffect(() => {
    const generateOrders = () => {
      // Generate a random base price
      let basePrice;
      if (baseToken === 'BRETT') basePrice = 0.32;
      else if (baseToken === 'QR') basePrice = 0.0045;
      else if (baseToken === 'PUBLIC') basePrice = 0.003;
      else basePrice = 1800; // ETH default
      
      setCurrentPrice(basePrice);
      
      const newAsks: Order[] = [];
      const newBids: Order[] = [];
      
      // Generate 10 ask orders (selling)
      let totalAsk = 0;
      for (let i = 0; i < 10; i++) {
        const price = basePrice * (1 + (i + 1) * 0.001);
        const amount = Math.random() * 10 + 1;
        totalAsk += amount;
        newAsks.push({ 
          price: parseFloat(price.toFixed(6)), 
          amount: parseFloat(amount.toFixed(4)), 
          total: parseFloat(totalAsk.toFixed(4)) 
        });
      }
      
      // Generate 10 bid orders (buying)
      let totalBid = 0;
      for (let i = 0; i < 10; i++) {
        const price = basePrice * (1 - (i + 1) * 0.001);
        const amount = Math.random() * 10 + 1;
        totalBid += amount;
        newBids.push({ 
          price: parseFloat(price.toFixed(6)), 
          amount: parseFloat(amount.toFixed(4)), 
          total: parseFloat(totalBid.toFixed(4)) 
        });
      }
      
      // Sort orders properly
      newAsks.sort((a, b) => a.price - b.price);
      newBids.sort((a, b) => b.price - a.price);
      
      // Calculate spread
      const lowestAsk = newAsks[0].price;
      const highestBid = newBids[0].price;
      const calculatedSpread = ((lowestAsk - highestBid) / lowestAsk) * 100;
      
      setAsks(newAsks);
      setBids(newBids);
      setSpread(parseFloat(calculatedSpread.toFixed(4)));
    };
    
    generateOrders();
    
    // Update orders periodically
    const interval = setInterval(() => {
      generateOrders();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [baseToken, quoteToken]);
  
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
      </div>
      
      <div className="bg-vibe-dark/80 text-xs">
        {/* Header */}
        <div className="grid grid-cols-3 px-3 py-1 font-code border-b border-vibe-blue/30 bg-black/40">
          <div>Price ({quoteToken})</div>
          <div className="text-right">Amount ({baseToken})</div>
          <div className="text-right">Total</div>
        </div>
        
        {/* Asks/Sell Orders */}
        <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-vibe-pink">
          {asks.map((order, index) => (
            <div
              key={`ask-${index}`}
              className="grid grid-cols-3 px-3 py-1 font-code border-b border-vibe-pink/5 relative"
            >
              {/* Background bar */}
              <div 
                className="absolute top-0 right-0 h-full bg-vibe-pink/5"
                style={{ width: `${(order.total / maxTotal) * 100}%` }}
              />
              <div className="z-10 text-vibe-pink">{order.price}</div>
              <div className="z-10 text-right">{order.amount}</div>
              <div className="z-10 text-right">{order.total}</div>
            </div>
          ))}
        </div>
        
        {/* Current price */}
        <div className="grid grid-cols-2 px-3 py-2 font-code border-b border-vibe-neon/30 bg-black/60">
          <div className="text-vibe-neon font-bold">{currentPrice}</div>
          <div className="text-right text-gray-500">Spread: {spread}%</div>
        </div>
        
        {/* Bids/Buy Orders */}
        <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-vibe-neon">
          {bids.map((order, index) => (
            <div
              key={`bid-${index}`}
              className="grid grid-cols-3 px-3 py-1 font-code border-b border-vibe-neon/5 relative"
            >
              {/* Background bar */}
              <div 
                className="absolute top-0 right-0 h-full bg-vibe-neon/5"
                style={{ width: `${(order.total / maxTotal) * 100}%` }}
              />
              <div className="z-10 text-vibe-neon">{order.price}</div>
              <div className="z-10 text-right">{order.amount}</div>
              <div className="z-10 text-right">{order.total}</div>
            </div>
          ))}
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-black/40">
          <Button size="sm" variant="outline" className="text-vibe-neon border-vibe-neon hover:bg-vibe-neon/20">
            Buy
          </Button>
          <Button size="sm" variant="outline" className="text-vibe-pink border-vibe-pink hover:bg-vibe-pink/20">
            Sell
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Orderbook;
