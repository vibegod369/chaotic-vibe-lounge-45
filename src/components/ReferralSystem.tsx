
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon, CheckIcon, LinkIcon } from 'lucide-react';
import { toast } from "sonner";
import ConnectWallet from './ConnectWallet';
import walletService, { walletEvents } from '@/services/wallet';

const ReferralSystem = () => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [referrals, setReferrals] = useState<number>(0);
  const [rewards, setRewards] = useState<string>('0.00');
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      if (walletService.wallet) {
        setIsConnected(true);
        // Generate a referral code based on wallet address
        const address = walletService.wallet.address;
        const code = `VIBE-${address.slice(2, 8)}`;
        setReferralCode(code);
        
        // Create referral link
        const baseUrl = window.location.origin;
        setReferralLink(`${baseUrl}?ref=${code}`);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setReferralCode('');
      setReferralLink('');
    };

    // Check if already connected
    if (walletService.wallet) {
      handleConnect();
    }

    // Add event listeners
    window.addEventListener(walletEvents.connected, handleConnect);
    window.addEventListener(walletEvents.disconnected, handleDisconnect);

    return () => {
      window.removeEventListener(walletEvents.connected, handleConnect);
      window.removeEventListener(walletEvents.disconnected, handleDisconnect);
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setHasCopied(true);
    toast.success("Referral link copied to clipboard!");
    
    setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-300">
        Connect your wallet to generate a unique referral code. Share it with friends and earn 5% of their contributions.
      </p>
      
      {!isConnected ? (
        <div className="flex justify-center py-4">
          <ConnectWallet />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 border border-vibe-neon/30 rounded-lg bg-vibe-dark/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Your Referral Code:</span>
              <span className="text-sm text-vibe-neon font-code">{referralCode}</span>
            </div>
            
            <div className="relative">
              <Input 
                value={referralLink}
                readOnly
                className="pr-10 font-code text-sm bg-vibe-dark/80 border-vibe-neon/30 text-vibe-neon/80"
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 text-vibe-neon hover:text-vibe-neon/80 hover:bg-transparent"
                onClick={copyToClipboard}
              >
                {hasCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 border border-vibe-blue/30 rounded-lg">
              <div className="text-vibe-blue text-2xl font-bold">{referrals}</div>
              <div className="text-xs text-gray-400">Referrals</div>
            </div>
            <div className="p-3 border border-vibe-pink/30 rounded-lg">
              <div className="text-vibe-pink text-2xl font-bold">{rewards} ETH</div>
              <div className="text-xs text-gray-400">Earned Rewards</div>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=Join%20the%20$VIBE%20presale%20using%20my%20referral%20link%20and%20let's%20embrace%20the%20chaos%20together!&url=${encodeURIComponent(referralLink)}`, '_blank');
              }}
              className="w-full bg-vibe-blue/20 text-white border border-vibe-blue/40 hover:bg-vibe-blue/30"
            >
              <LinkIcon className="mr-2 h-4 w-4" /> Share on Twitter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;
