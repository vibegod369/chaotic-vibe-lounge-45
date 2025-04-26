
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { RefreshCcwIcon } from 'lucide-react';
import ConnectWallet from './ConnectWallet';
import walletService, { walletEvents } from '@/services/wallet';
import referralService from '@/services/referral';
import ReferralServiceError from './referral/ReferralServiceError';
import ReferralStats from './referral/ReferralStats';
import ReferralCodeDisplay from './referral/ReferralCodeDisplay';
import ShareReferralButton from './referral/ShareReferralButton';

const ReferralSystem = () => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceError, setServiceError] = useState(false);

  useEffect(() => {
    try {
      const referralParam = referralService.checkReferralParam();
      if (referralParam) {
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

  const { data: referralStats, refetch: refetchStats } = useQuery({
    queryKey: ['referralStats', walletService.wallet?.address],
    queryFn: async () => {
      if (!walletService.wallet?.address) return { total_points: 0, total_rewards: 0 };
      try {
        return referralService.getReferralStats(walletService.wallet.address);
      } catch (error) {
        console.error('Error fetching referral stats:', error);
        setServiceError(true);
        return { total_points: 0, total_rewards: 0 };
      }
    },
    enabled: !!walletService.wallet?.address,
    staleTime: 60000,
  });

  useEffect(() => {
    const handleConnect = async () => {
      if (walletService.wallet) {
        setIsConnected(true);
        setIsLoading(true);
        
        try {
          const code = await referralService.getOrCreateReferral(walletService.wallet.address);
          if (code) {
            setReferralCode(code);
            const baseUrl = window.location.origin;
            setReferralLink(`${baseUrl}?ref=${code}`);
          
            const pendingReferral = sessionStorage.getItem('pendingReferral');
            if (pendingReferral) {
              await referralService.processReferral(pendingReferral, walletService.wallet.address);
              sessionStorage.removeItem('pendingReferral');
              toast.success('Referral processed successfully!');
            }
          
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

    if (walletService.wallet) {
      handleConnect();
    }

    window.addEventListener(walletEvents.connected, handleConnect);
    window.addEventListener(walletEvents.disconnected, handleDisconnect);

    return () => {
      window.removeEventListener(walletEvents.connected, handleConnect);
      window.removeEventListener(walletEvents.disconnected, handleDisconnect);
    };
  }, [refetchStats]);

  if (serviceError && isConnected) {
    return <ReferralServiceError />;
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
              <ReferralCodeDisplay 
                referralCode={referralCode} 
                referralLink={referralLink} 
              />
              {referralStats && <ReferralStats stats={referralStats} />}
              <div className="pt-2">
                <ShareReferralButton referralLink={referralLink} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;
