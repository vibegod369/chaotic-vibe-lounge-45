
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon, ExternalLinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import GlitchText from './GlitchText';
import { useWallet } from '@solana/wallet-adapter-react';

interface TokenNetworkInfo {
  name: string;
  supply: string;
  price: number;
  chainId: string;
  explorer: string;
  contractAddress: string;
}

const BridgedTokenInfo = () => {
  const { connected } = useWallet();
  const [selectedTab, setSelectedTab] = useState<'ethereum' | 'solana'>('ethereum');
  
  const tokenInfo: Record<'ethereum' | 'solana', TokenNetworkInfo> = {
    ethereum: {
      name: 'Ethereum (Base)',
      supply: '1,000,000,000',
      price: 0.00042069,
      chainId: '8453',
      explorer: 'https://basescan.org/token/0x5Ca1Ab1E70603Be5B3c063C3AD8E5f19E2822575',
      contractAddress: '0x5Ca1Ab1E70603Be5B3c063C3AD8E5f19E2822575'
    },
    solana: {
      name: 'Solana',
      supply: '50,000,000',
      price: 0.00042069,
      chainId: 'mainnet-beta',
      explorer: 'https://explorer.solana.com/address/TokenAddressWillGoHere11111111111111111111111',
      contractAddress: 'TokenAddressWillGoHere11111111111111111111111'
    }
  };
  
  const handleBridgeClick = () => {
    if (!connected && selectedTab === 'solana') {
      toast.error('Please connect your Solana wallet first', {
        description: 'You need to connect a Solana wallet to bridge tokens to Solana'
      });
      return;
    }
    
    toast.info('Bridging coming soon!', {
      description: 'The bridging functionality will be available soon.'
    });
  };
  
  return (
    <Card className="card-chaos overflow-hidden">
      <div className="border-b border-vibe-yellow/30">
        <div className="flex">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              selectedTab === 'ethereum' 
                ? 'bg-vibe-neon/20 text-vibe-neon border-b-2 border-vibe-neon' 
                : 'text-gray-400 hover:text-vibe-neon/70 hover:bg-black/20'
            }`}
            onClick={() => setSelectedTab('ethereum')}
          >
            Ethereum (Base)
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              selectedTab === 'solana' 
                ? 'bg-vibe-yellow/20 text-vibe-yellow border-b-2 border-vibe-yellow' 
                : 'text-gray-400 hover:text-vibe-yellow/70 hover:bg-black/20'
            }`}
            onClick={() => setSelectedTab('solana')}
          >
            Solana
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <h3 className="font-bold text-xl mb-2">
            <GlitchText 
              text={`VIBE on ${tokenInfo[selectedTab].name}`} 
              color={selectedTab === 'ethereum' ? 'neon' : 'yellow'} 
            />
          </h3>
          <p className="text-sm text-gray-400">
            VIBE token is now available on {tokenInfo[selectedTab].name}. {
              selectedTab === 'solana' 
                ? 'Bridge your VIBE tokens from Base to Solana.' 
                : 'Bridge your VIBE tokens to Solana for lower fees and faster transactions.'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="bg-black/30 p-3 rounded border border-vibe-blue/20">
            <p className="text-gray-400 mb-1">Total Supply</p>
            <p className="text-white font-bold">{tokenInfo[selectedTab].supply}</p>
          </div>
          <div className="bg-black/30 p-3 rounded border border-vibe-blue/20">
            <p className="text-gray-400 mb-1">Price</p>
            <p className="text-white font-bold">${tokenInfo[selectedTab].price.toFixed(8)}</p>
          </div>
        </div>
        
        <div className="bg-black/40 p-3 rounded-md mb-4">
          <p className="text-xs text-gray-500 mb-1">Token Contract</p>
          <div className="flex items-center">
            <p className="text-sm font-code text-white truncate flex-grow">
              {tokenInfo[selectedTab].contractAddress}
            </p>
            <a 
              href={tokenInfo[selectedTab].explorer} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-vibe-blue hover:text-vibe-neon transition-colors"
            >
              <ExternalLinkIcon size={16} />
            </a>
          </div>
        </div>
        
        <div className="flex gap-2">
          {selectedTab === 'ethereum' ? (
            <Button 
              className="flex-1 bg-vibe-yellow hover:bg-vibe-yellow/80 text-black"
              onClick={handleBridgeClick}
            >
              <ArrowUpIcon className="mr-2 h-4 w-4" /> Bridge to Solana
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-vibe-neon hover:bg-vibe-neon/80 text-black"
              onClick={handleBridgeClick}
            >
              <ArrowDownIcon className="mr-2 h-4 w-4" /> Bridge to Ethereum
            </Button>
          )}
          <Button 
            variant="outline"
            className={`border-${selectedTab === 'ethereum' ? 'vibe-neon' : 'vibe-yellow'} text-${selectedTab === 'ethereum' ? 'vibe-neon' : 'vibe-yellow'}`}
            onClick={() => window.open(tokenInfo[selectedTab].explorer, '_blank')}
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4" /> 
            Explore
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BridgedTokenInfo;
