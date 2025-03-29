
import { useState } from 'react';
import { BarChart3Icon, ArrowUpIcon, GemIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from '@/components/ui/sonner';
import GlitchText from './GlitchText';

const VibeContributor = () => {
  const [stakeAmount, setStakeAmount] = useState("");
  const [staked, setStaked] = useState(0);
  const [rewards, setRewards] = useState(0);
  
  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount", {
        description: "Amount must be greater than 0"
      });
      return;
    }
    
    setStaked(prev => prev + amount);
    setStakeAmount("");
    
    toast.success("Tokens staked successfully!", {
      description: `You've staked ${amount} VIBE/ETH LP tokens`
    });
  };
  
  const handleUnstake = () => {
    if (staked <= 0) {
      toast.error("No tokens to unstake", {
        description: "You don't have any staked tokens"
      });
      return;
    }
    
    toast.success("Tokens unstaked successfully!", {
      description: `You've unstaked ${staked} VIBE/ETH LP tokens`
    });
    
    setStaked(0);
  };
  
  const handleClaim = () => {
    if (rewards <= 0) {
      toast.error("No rewards to claim", {
        description: "You don't have any rewards yet"
      });
      return;
    }
    
    toast.success("Rewards claimed successfully!", {
      description: `You've claimed ${rewards.toFixed(2)} VIBE tokens`
    });
    
    setRewards(0);
  };
  
  // Simulate rewards accumulation
  useState(() => {
    const interval = setInterval(() => {
      if (staked > 0) {
        setRewards(prev => prev + (staked * 0.001));
      }
    }, 5000);
    
    return () => clearInterval(interval);
  });

  return (
    <div className="backdrop-blur-md bg-black/50 border border-vibe-blue/30 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <GemIcon className="mr-2 text-vibe-yellow" />
          <GlitchText text="Vibe Contributor" color="yellow" />
        </h2>
        <p className="text-gray-400">Stake your VIBE/ETH Uniswap V2 LP tokens and earn rewards</p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">APR</span>
          <span className="text-vibe-neon font-bold flex items-center">
            42.69% <ArrowUpIcon className="ml-1 h-3 w-3" />
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Total Value Locked</span>
          <span className="text-white font-bold">$1,337,420</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Your Stake</span>
          <span className="text-white font-bold">{staked.toFixed(2)} LP</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-vibe-neon">Your Rewards</span>
          <span className="text-vibe-neon font-bold animate-pulse">{rewards.toFixed(4)} VIBE</span>
        </div>
        <Progress value={Math.min((rewards / 10) * 100, 100)} className="h-2 bg-gray-800">
          <div className="h-full bg-gradient-to-r from-vibe-blue to-vibe-neon" style={{ width: `${Math.min((rewards / 10) * 100, 100)}%` }} />
        </Progress>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          <Input
            type="number"
            placeholder="Amount to stake"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="bg-black/30 border-vibe-blue/30 text-white"
          />
          <Button 
            onClick={handleStake}
            className="bg-vibe-neon text-black hover:bg-vibe-neon/80 transition-all"
          >
            Stake
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleUnstake}
            className="flex-1 border border-vibe-yellow bg-transparent text-vibe-yellow hover:bg-vibe-yellow/20"
            disabled={staked <= 0}
          >
            Unstake All
          </Button>
          <Button 
            onClick={handleClaim}
            className="flex-1 border border-vibe-pink bg-transparent text-vibe-pink hover:bg-vibe-pink/20"
            disabled={rewards <= 0}
          >
            Claim Rewards
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden border border-vibe-blue/20">
        <div className="bg-black/50 px-4 py-2 border-b border-vibe-blue/20 flex items-center">
          <BarChart3Icon className="mr-2 text-vibe-blue" size={16} />
          <span className="text-sm font-medium">Staking Stats</span>
        </div>
        <div className="p-4 bg-black/30">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400">Your Share</p>
              <p className="text-sm font-bold">{staked > 0 ? "0.13%" : "0%"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Daily Rewards</p>
              <p className="text-sm font-bold">{staked > 0 ? (staked * 0.0283).toFixed(4) : "0"} VIBE</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Projects Voted</p>
              <p className="text-sm font-bold">0</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Next Reward</p>
              <p className="text-sm font-bold">~2 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeContributor;
