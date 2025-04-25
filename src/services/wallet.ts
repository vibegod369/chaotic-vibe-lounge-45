
import { ethers } from 'ethers';
import { toast } from 'sonner';

export type WalletInfo = {
  address: string;
  chainId: number;
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
};

// Base network configuration
const BASE_CHAIN_ID = 8453;
const BASE_NETWORK_CONFIG = {
  chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
  chainName: 'Base',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org']
};

// Create custom events for wallet changes
export const walletEvents = {
  connected: 'wallet-connected',
  disconnected: 'wallet-disconnected',
  chainChanged: 'wallet-chain-changed',
  accountsChanged: 'wallet-accounts-changed'
};

class WalletService {
  private _wallet: WalletInfo | null = null;
  
  get wallet() {
    return this._wallet;
  }
  
  get isConnected() {
    return !!this._wallet;
  }
  
  constructor() {
    this.checkExistingConnection();
    
    window.addEventListener('load', () => {
      if (window.ethereum) {
        window.ethereum.on('chainChanged', this.handleChainChanged);
        window.ethereum.on('accountsChanged', this.handleAccountsChanged);
      }
    });
  }
  
  private checkExistingConnection = async () => {
    const connectedAddress = localStorage.getItem('walletAddress');
    if (connectedAddress && window.ethereum) {
      try {
        await this.connect();
      } catch (error) {
        console.error('Failed to restore connection:', error);
        localStorage.removeItem('walletAddress');
      }
    }
  };
  
  private handleChainChanged = async (chainId: string) => {
    const newChainId = parseInt(chainId);
    if (newChainId !== BASE_CHAIN_ID) {
      toast.error('Please switch to Base network');
      await this.switchToBase();
    }
  };
  
  private handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      this.disconnect();
    } else {
      this.updateWalletInfo(accounts[0]);
    }
  };
  
  private updateWalletInfo = async (address: string) => {
    if (!window.ethereum) return null;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      
      this._wallet = {
        address,
        chainId: network.chainId,
        provider,
        signer
      };
      
      localStorage.setItem('walletAddress', address);
      
      window.dispatchEvent(new CustomEvent(walletEvents.connected, { 
        detail: this._wallet 
      }));
      
      return this._wallet;
    } catch (error) {
      console.error('Failed to update wallet info:', error);
      return null;
    }
  };

  private switchToBase = async () => {
    if (!window.ethereum) return;

    try {
      // Try switching to Base network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_NETWORK_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // If Base network is not added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_NETWORK_CONFIG],
          });
        } catch (addError) {
          console.error('Failed to add Base network:', addError);
          toast.error('Failed to add Base network to wallet');
        }
      } else {
        console.error('Failed to switch to Base network:', switchError);
        toast.error('Failed to switch to Base network');
      }
    }
  };
  
  connect = async (): Promise<WalletInfo | null> => {
    if (!window.ethereum) {
      toast.error('No Ethereum wallet found', {
        description: 'Please install MetaMask or another wallet to connect'
      });
      return null;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        toast.error('No accounts found', {
          description: 'Please create an account in your wallet'
        });
        return null;
      }

      // Ensure user is on Base network
      const network = await provider.getNetwork();
      if (network.chainId !== BASE_CHAIN_ID) {
        await this.switchToBase();
      }
      
      toast.success('Wallet connected successfully!', {
        description: `Connected to ${accounts[0]}`
      });
      
      return this.updateWalletInfo(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet', {
        description: 'Please try again or use a different wallet'
      });
      return null;
    }
  };
  
  disconnect = (): void => {
    this._wallet = null;
    localStorage.removeItem('walletAddress');
    
    window.dispatchEvent(new CustomEvent(walletEvents.disconnected));
    
    toast.info('Wallet disconnected');
  };
}

const walletService = new WalletService();
export default walletService;
