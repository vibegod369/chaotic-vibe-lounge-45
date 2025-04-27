
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { RefreshCcwIcon, AlertCircleIcon } from 'lucide-react';
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
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total_points: number; total_rewards: number }>({ 
    total_points: 0, 
    total_rewards: 0 
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
            const link = `${baseUrl}?ref=${code}`;
            setReferralLink(link);
            
            // Fetch and log referral stats for debugging
            const fetchedStats = await referralService.getReferralStats(walletService.wallet.address);
            setStats(fetchedStats);
            
            setDebugInfo(JSON.stringify({
              referralCode: code,
              referralLink: link,
              stats: fetchedStats
            }, null, 2));

            if (fetchedStats.total_points === 0) {
              toast.info('No referral points yet', {
                description: 'Share your link to start earning points!'
              });
            }
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
  }, []);

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
              {stats && <ReferralStats stats={stats} />}
              <div className="pt-2">
                <ShareReferralButton referralLink={referralLink} />
              </div>
            </>
          )}
        </div>
      )}
      
      {debugInfo && (
        <div className="bg-gray-800 p-4 rounded-lg text-sm font-mono text-gray-300 overflow-x-auto">
          <h4 className="font-bold mb-2 flex items-center">
            <AlertCircleIcon className="mr-2 h-4 w-4 text-orange-500" /> 
            Referral Debug Information
          </h4>
          <pre>{debugInfo}</pre>
        </div>
      )}
    </div>
  );
};

export default ReferralSystem;
