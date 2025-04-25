
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon, CheckIcon, LinkIcon, RefreshCcwIcon, AlertCircleIcon } from 'lucide-react';
import { toast } from "sonner";
import ConnectWallet from './ConnectWallet';
import walletService, { walletEvents } from '@/services/wallet';
import referralService, { ReferralStats } from '@/services/referral';
import { useQuery } from '@tanstack/react-query';

const ReferralSystem = () => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceError, setServiceError] = useState(false);

  // Check for referral parameter in URL
  useEffect(() => {
    try {
      const referralParam = referralService.checkReferralParam();
      if (referralParam) {
        // Store the referral code in session storage to be used when the user connects their wallet
        sessionStorage.setItem('pendingReferral', referralParam);
        toast.info('Referral code detected', {
          description: `You were referred by someone with code: ${referralParam}`
        });
      }
    } catch (error) {
      console.error('Error checking referral parameter:', error);
      setServiceError(true);
    }
  }, []);

  // Fetch referral stats
  const { data: referralStats, refetch: refetchStats } = useQuery({
    queryKey: ['referralStats', walletService.wallet?.address],
    queryFn: async () => {
      if (!walletService.wallet?.address) return { total_referrals: 0, total_rewards: 0 };
      try {
        return referralService.getReferralStats(walletService.wallet.address);
      } catch (error) {
        console.error('Error fetching referral stats:', error);
        setServiceError(true);
        return { total_referrals: 0, total_rewards: 0 };
      }
    },
    enabled: !!walletService.wallet?.address,
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    const handleConnect = async () => {
      if (walletService.wallet) {
        setIsConnected(true);
        setIsLoading(true);
        
        try {
          // Get or create referral
          const code = await referralService.getOrCreateReferral(walletService.wallet.address);
          if (code) {
            setReferralCode(code);
            
            // Create referral link
            const baseUrl = window.location.origin;
            setReferralLink(`${baseUrl}?ref=${code}`);
          
            // Check if there's a pending referral
            const pendingReferral = sessionStorage.getItem('pendingReferral');
            if (pendingReferral) {
              await referralService.processReferral(pendingReferral, walletService.wallet.address);
              sessionStorage.removeItem('pendingReferral');
              toast.success('Referral processed successfully!');
            }
          
            // Refresh stats
            refetchStats();
          } else {
            setServiceError(true);
          }
        } catch (error) {
          console.error('Referral system error:', error);
          toast.error('Failed to set up referral');
          setServiceError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setReferralCode('');
      setReferralLink('');
      setServiceError(false);
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
  }, [refetchStats]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setHasCopied(true);
    toast.success("Referral link copied to clipboard!");
    
    setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  };

  // If there's a service error, show a warning
  if (serviceError && isConnected) {
    return (
      <div className="p-6 border border-orange-500/50 rounded-lg bg-orange-500/10">
        <div className="flex items-center gap-2 text-orange-400 mb-4">
          <AlertCircleIcon className="h-5 w-5" />
          <h3 className="font-medium">Referral Service Unavailable</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          The referral service is currently unavailable. This may be due to missing configuration or connection issues.
        </p>
        <p className="text-gray-400 text-sm">
          Please make sure the Supabase environment variables are correctly set up and try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-300">
        Connect your wallet to generate a unique referral code. Share it with friends and earn points and rewards.
      </p>
      
      {!isConnected ? (
        <div className="flex justify-center py-4">
          <ConnectWallet />
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCcwIcon className="animate-spin text-vibe-neon" />
            </div>
          ) : (
            <>
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
                  <div className="text-vibe-blue text-2xl font-bold">{referralStats?.total_referrals || 0}</div>
                  <div className="text-xs text-gray-400">Points</div>
                </div>
                <div className="p-3 border border-vibe-pink/30 rounded-lg">
                  <div className="text-vibe-pink text-2xl font-bold">{referralStats?.total_rewards.toFixed(2) || "0.00"} ETH</div>
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;
