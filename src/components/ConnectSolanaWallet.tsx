
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LogOutIcon } from 'lucide-react';
import { toast } from "sonner";
import GlitchText from './GlitchText';
import solanaWalletService, { solanaWalletEvents, SolanaWalletInfo } from '@/services/solanaWallet';
import { cn } from '@/lib/utils';

const ConnectSolanaWallet = () => {
  const { publicKey, disconnect, connected } = useWallet();
  const [walletInfo, setWalletInfo] = useState<SolanaWalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateWallet = async () => {
      if (publicKey) {
        setIsLoading(true);
        const info = await solanaWalletService.updateWalletState(publicKey);
        if (info) {
          setWalletInfo(info);
        }
        setIsLoading(false);
      } else {
        solanaWalletService.handleDisconnect();
        setWalletInfo(null);
      }
    };

    updateWallet();
  }, [publicKey, connected]);

  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = () => {
    disconnect();
    solanaWalletService.handleDisconnect();
    toast.success("Solana wallet disconnected");
  };

  if (connected && walletInfo) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <span className="relative px-3 py-1 text-sm font-code bg-vibe-dark border border-vibe-yellow/30 rounded-l-md">
            <span className="text-vibe-yellow">{shortenAddress(walletInfo.address)}</span>
            <span className="absolute top-0 left-0 w-full h-full bg-vibe-yellow/10 animate-pulse rounded-l-md"></span>
          </span>
          <span className="text-xs text-vibe-yellow/70">
            {walletInfo.balance.toFixed(3)} SOL | {walletInfo.tokens[0].balance} VIBE
          </span>
        </div>
        <Button 
          variant="ghost"
          size="icon"
          onClick={handleDisconnect}
          className="rounded-r-md border border-vibe-yellow/50 hover:bg-vibe-yellow/20 hover:text-vibe-yellow"
        >
          <LogOutIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("solana-wallet-button-container", isLoading && "opacity-70 pointer-events-none")}>
      <WalletMultiButton className="button-chaos group !bg-transparent !h-auto">
        <GlitchText text={isLoading ? "Connecting..." : "Connect Solana Wallet"} intensity="low" color="yellow" />
      </WalletMultiButton>
    </div>
  );
};

export default ConnectSolanaWallet;
