
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { WalletIcon, LogOutIcon } from 'lucide-react';
import { toast } from "sonner";
import GlitchText from './GlitchText';
import walletService, { walletEvents, WalletInfo } from '@/services/wallet';

const ConnectWallet = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize wallet state
    const wallet = walletService.wallet;
    if (wallet) {
      setConnected(true);
      setAddress(shortenAddress(wallet.address));
    }

    // Set up event listeners
    const handleConnect = (e: CustomEvent<WalletInfo>) => {
      setConnected(true);
      setAddress(shortenAddress(e.detail.address));
    };

    const handleDisconnect = () => {
      setConnected(false);
      setAddress("");
    };

    window.addEventListener(walletEvents.connected, handleConnect as EventListener);
    window.addEventListener(walletEvents.disconnected, handleDisconnect);

    return () => {
      window.removeEventListener(walletEvents.connected, handleConnect as EventListener);
      window.removeEventListener(walletEvents.disconnected, handleDisconnect);
    };
  }, []);

  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await walletService.connect();
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnect();
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
      disabled={isLoading}
    >
      <WalletIcon className="mr-2 h-4 w-4 group-hover:animate-shake" />
      <GlitchText text={isLoading ? "Connecting..." : "Connect Wallet"} intensity="low" />
    </Button>
  );
};

export default ConnectWallet;
