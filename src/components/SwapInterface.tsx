
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowDownIcon, ArrowUpIcon, RefreshCwIcon } from 'lucide-react';
import { toast } from "sonner";
import GlitchText from './GlitchText';
import uniswapService from '@/services/uniswap';
import walletService from '@/services/wallet';

const SwapInterface = () => {
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("BRETT");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5); // 0.5% default slippage
  const [isLoading, setIsLoading] = useState(false);
  const [fromBalance, setFromBalance] = useState("0");
  const [toBalance, setToBalance] = useState("0");
  const [priceImpact, setPriceImpact] = useState(0.1); // Mock price impact
  const [availableTokens, setAvailableTokens] = useState<{symbol: string, name: string, address: string}[]>([]);
  
  // Load available tokens on component mount
  useEffect(() => {
    setAvailableTokens(uniswapService.getAvailableTokens());
  }, []);
  
  // Update balances when wallet or selected tokens change
  useEffect(() => {
    async function updateBalances() {
      if (walletService.isConnected) {
        try {
          const fromAddress = availableTokens.find(t => t.symbol === fromToken)?.address || '';
          const toAddress = availableTokens.find(t => t.symbol === toToken)?.address || '';
          
          if (fromAddress && walletService.wallet?.address) {
            const balance = await uniswapService.getTokenBalance(
              fromToken === 'ETH' ? 'eth' : fromAddress,
              walletService.wallet.address
            );
            setFromBalance(balance);
          }
          
          if (toAddress && walletService.wallet?.address) {
            const balance = await uniswapService.getTokenBalance(
              toToken === 'ETH' ? 'eth' : toAddress,
              walletService.wallet.address
            );
            setToBalance(balance);
          }
        } catch (error) {
          console.error('Error updating balances:', error);
        }
      }
    }
    
    updateBalances();
  }, [fromToken, toToken, walletService.wallet?.address, availableTokens]);
  
  // Update to amount when from amount changes
  useEffect(() => {
    const getQuote = async () => {
      if (fromAmount && parseFloat(fromAmount) > 0) {
        try {
          setIsLoading(true);
          const fromAddress = availableTokens.find(t => t.symbol === fromToken)?.address || '';
          const toAddress = availableTokens.find(t => t.symbol === toToken)?.address || '';
          
          if (fromAddress && toAddress) {
            const amount = await uniswapService.getAmountOut(
              fromAmount,
              fromAddress,
              toAddress
            );
            setToAmount(parseFloat(amount).toFixed(6));
            
            // Mock price impact calculation (would be more complex in reality)
            const randomImpact = Math.random() * 0.5 + 0.1;
            setPriceImpact(parseFloat(randomImpact.toFixed(2)));
          }
        } catch (error) {
          console.error('Error getting swap quote:', error);
          toast.error('Failed to get swap quote');
        } finally {
          setIsLoading(false);
        }
      } else {
        setToAmount("");
      }
    };
    
    getQuote();
  }, [fromAmount, fromToken, toToken, availableTokens]);
  
  const handleSwap = async () => {
    if (!walletService.isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await uniswapService.executeSwap({
        fromToken,
        toToken,
        amount: fromAmount,
        slippageTolerance: slippage
      });
      
      // Reset the form
      setFromAmount("");
      setToAmount("");
      
      // Update balances
      if (walletService.wallet?.address) {
        const fromAddress = availableTokens.find(t => t.symbol === fromToken)?.address || '';
        const toAddress = availableTokens.find(t => t.symbol === toToken)?.address || '';
        
        const newFromBalance = await uniswapService.getTokenBalance(
          fromToken === 'ETH' ? 'eth' : fromAddress,
          walletService.wallet.address
        );
        setFromBalance(newFromBalance);
        
        const newToBalance = await uniswapService.getTokenBalance(
          toToken === 'ETH' ? 'eth' : toAddress,
          walletService.wallet.address
        );
        setToBalance(newToBalance);
      }
    } catch (error) {
      console.error('Swap error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMaxClick = () => {
    setFromAmount(fromBalance);
  };
  
  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
    setToAmount("");
  };

  return (
    <div className="card-chaos p-6 backdrop-blur-md space-y-6">
      <h2 className="text-xl font-bold mb-6 text-vibe-neon">
        <GlitchText text="Swap" intensity="low" />
      </h2>
      
      {/* From Token */}
      <div className="bg-black/40 border border-vibe-neon/20 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">From</span>
          <span className="text-sm text-gray-400">
            Balance: {parseFloat(fromBalance).toFixed(6)} {fromToken}
            {parseFloat(fromBalance) > 0 && (
              <button 
                onClick={handleMaxClick}
                className="ml-1 text-vibe-blue hover:text-vibe-neon"
              >
                MAX
              </button>
            )}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="bg-transparent text-xl text-white flex-grow outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Select value={fromToken} onValueChange={setFromToken}>
            <SelectTrigger className="w-[120px] border border-vibe-neon bg-black/50 text-vibe-neon hover:bg-vibe-neon/20">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="border border-vibe-neon/50 bg-vibe-dark">
              {availableTokens.map((token) => (
                <SelectItem 
                  key={token.symbol} 
                  value={token.symbol}
                  disabled={token.symbol === toToken}
                >
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Switch Button */}
      <div className="flex justify-center -my-3 relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={switchTokens}
          className="rounded-full bg-vibe-dark border border-vibe-blue/30 text-vibe-blue hover:bg-vibe-blue/20"
        >
          <ArrowDownIcon className="h-5 w-5" />
        </Button>
      </div>
      
      {/* To Token */}
      <div className="bg-black/40 border border-vibe-neon/20 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">To</span>
          <span className="text-sm text-gray-400">Balance: {parseFloat(toBalance).toFixed(6)} {toToken}</span>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            value={toAmount}
            readOnly
            placeholder="0.0"
            className="bg-transparent text-xl text-white flex-grow outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Select value={toToken} onValueChange={setToToken}>
            <SelectTrigger className="w-[120px] border border-vibe-pink bg-black/50 text-vibe-pink hover:bg-vibe-pink/20">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="border border-vibe-pink/50 bg-vibe-dark">
              {availableTokens.map((token) => (
                <SelectItem 
                  key={token.symbol} 
                  value={token.symbol}
                  disabled={token.symbol === fromToken}
                >
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Swap Details */}
      <div className="text-sm text-gray-400 bg-black/30 p-3 rounded-md space-y-2">
        <div className="flex justify-between">
          <span>Price Impact</span>
          <span className={priceImpact > 1 ? 'text-vibe-pink' : 'text-vibe-neon'}>{priceImpact}%</span>
        </div>
        <div className="flex justify-between">
          <span>Slippage Tolerance</span>
          <div className="flex items-center gap-2">
            <span>{slippage}%</span>
            <div className="w-24">
              <Slider 
                defaultValue={[0.5]} 
                max={5} 
                step={0.1} 
                value={[slippage]} 
                onValueChange={(value) => setSlippage(value[0])}
              />
            </div>
          </div>
        </div>
        {fromAmount && toAmount && (
          <div className="flex justify-between items-center pt-1">
            <span>Rate</span>
            <span className="font-code flex items-center">
              1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-1 h-5 w-5 rounded-full hover:text-vibe-neon"
              >
                <RefreshCwIcon className="h-3 w-3" />
              </Button>
            </span>
          </div>
        )}
      </div>
      
      {/* Swap Button */}
      <Button
        className="w-full button-chaos"
        onClick={handleSwap}
        disabled={isLoading || !fromAmount || parseFloat(fromAmount) <= 0}
      >
        <GlitchText text={isLoading ? "Processing..." : "Swap Now"} intensity="low" />
      </Button>
    </div>
  );
};

export default SwapInterface;
