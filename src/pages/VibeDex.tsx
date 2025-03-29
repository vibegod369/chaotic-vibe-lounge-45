
import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TokenTicker from "@/components/TokenTicker";
import GlitchText from "@/components/GlitchText";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { toast } from "sonner";

const VibeDex = () => {
  const [amount, setAmount] = useState("");
  const [selectedPair, setSelectedPair] = useState("ETH");
  
  const handleSwap = () => {
    toast.info("Swap functionality coming soon", {
      description: "This feature is under development.",
      position: "bottom-right",
    });
  };
  
  const tradingPairs = [
    { symbol: "ETH", price: "$1,830.42", change: "+2.5%" },
    { symbol: "CHAOS", price: "$0.0021", change: "-1.2%" },
    { symbol: "GLITCH", price: "$0.0152", change: "+5.7%" },
    { symbol: "JPEGS", price: "$0.0003", change: "+12.4%" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
            
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Swap Interface */}
              <div className="w-full lg:w-1/2 card-chaos p-6 backdrop-blur-md">
                <h2 className="text-xl font-bold mb-6 text-vibe-pink">
                  <GlitchText text="Swap" intensity="low" />
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-black/40 border border-vibe-neon/20 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">From</span>
                      <span className="text-sm text-gray-400">Balance: 0.0 ETH</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.0"
                        className="bg-transparent text-xl text-white flex-grow outline-none"
                      />
                      <Button className="border border-vibe-pink bg-black/50 text-vibe-pink hover:bg-vibe-pink/20">
                        ETH
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-vibe-dark border border-vibe-blue/30 text-vibe-blue hover:bg-vibe-blue/20"
                    >
                      <ArrowDownIcon className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="bg-black/40 border border-vibe-neon/20 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">To</span>
                      <span className="text-sm text-gray-400">Balance: 0.0 VIBE</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        placeholder="0.0"
                        disabled
                        className="bg-transparent text-xl text-white flex-grow outline-none"
                      />
                      <Button className="border border-vibe-neon bg-black/50 text-vibe-neon hover:bg-vibe-neon/20">
                        VIBE
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400 bg-black/30 p-3 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span>Price Impact</span>
                      <span className="text-vibe-yellow">~0.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum Received</span>
                      <span>0 VIBE</span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full button-chaos"
                    onClick={handleSwap}
                  >
                    <GlitchText text="Swap Now" intensity="low" />
                  </Button>
                </div>
              </div>
              
              {/* Trading Pairs */}
              <div className="w-full lg:w-1/2 card-chaos p-6 backdrop-blur-md">
                <h2 className="text-xl font-bold mb-6 text-vibe-blue">
                  <GlitchText text="Trading Pairs" intensity="low" />
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-vibe-pink/30">
                        <th className="text-left py-3 px-2 text-gray-400">Pair</th>
                        <th className="text-right py-3 px-2 text-gray-400">Price</th>
                        <th className="text-right py-3 px-2 text-gray-400">24h Change</th>
                        <th className="text-right py-3 px-2 text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradingPairs.map((pair) => (
                        <tr key={pair.symbol} className="border-b border-vibe-neon/10 hover:bg-vibe-neon/5 transition-colors">
                          <td className="py-4 px-2 font-code">VIBE/{pair.symbol}</td>
                          <td className="py-4 px-2 text-right font-code">{pair.price}</td>
                          <td className={`py-4 px-2 text-right font-code ${pair.change.startsWith('+') ? 'text-vibe-neon' : 'text-vibe-pink'}`}>
                            <span className="flex items-center justify-end">
                              {pair.change.startsWith('+') ? 
                                <TrendingUpIcon className="h-4 w-4 mr-1" /> : 
                                <TrendingDownIcon className="h-4 w-4 mr-1" />
                              }
                              {pair.change}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-vibe-neon text-vibe-neon hover:bg-vibe-neon/20"
                              onClick={() => setSelectedPair(pair.symbol)}
                            >
                              Trade
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <TokenTicker />
                </div>
              </div>
            </div>
          </div>
          
          {/* Background elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-vibe-pink/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-vibe-blue/20 rounded-full blur-3xl -z-10"></div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VibeDex;
