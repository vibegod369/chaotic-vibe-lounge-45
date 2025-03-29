
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { WalletIcon, LogOutIcon } from 'lucide-react';
import { toast } from "sonner";
import GlitchText from './GlitchText';

const ConnectWallet = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");

  const handleConnect = () => {
    // Simulated wallet connection
    setTimeout(() => {
      const randomAddress = `0x${Math.random().toString(16).slice(2, 12)}...${Math.random().toString(16).slice(2, 6)}`;
      setAddress(randomAddress);
      setConnected(true);
      toast.success("Wallet connected successfully!", {
        description: `Connected to ${randomAddress}`
      });
    }, 1000);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setAddress("");
    toast.info("Wallet disconnected");
  };

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <span className="relative px-3 py-1 text-sm font-code bg-vibe-dark border border-vibe-neon/30 rounded-l-md">
          <span className="text-vibe-neon">{address}</span>
          <span className="absolute top-0 left-0 w-full h-full bg-vibe-neon/10 animate-pulse rounded-l-md"></span>
        </span>
        <Button 
          variant="ghost"
          size="icon"
          onClick={handleDisconnect}
          className="rounded-r-md border border-vibe-pink/50 hover:bg-vibe-pink/20 hover:text-vibe-pink"
        >
          <LogOutIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      className="button-chaos group"
    >
      <WalletIcon className="mr-2 h-4 w-4 group-hover:animate-shake" />
      <GlitchText text="Connect Wallet" intensity="low" />
    </Button>
  );
};

export default ConnectWallet;
