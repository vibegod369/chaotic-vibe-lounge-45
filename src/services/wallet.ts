
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { EthereumProvider } from '@walletconnect/ethereum-provider';

export type WalletInfo = {
  address: string;
  chainId: number;
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
};

// Base network configuration
export const BASE_CHAIN_ID = 8453;
export const BASE_NETWORK_CONFIG = {
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
  private wcProvider: typeof EthereumProvider | null = null;
  
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
    if (this._wallet) {
      this._wallet.chainId = newChainId;
      
      window.dispatchEvent(new CustomEvent(walletEvents.chainChanged, { 
        detail: { chainId: newChainId } 
      }));
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

  switchToBase = async () => {
    if (!window.ethereum) {
      toast.error('No Ethereum wallet found');
      return false;
    }

    try {
      // Try switching to Base network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_NETWORK_CONFIG.chainId }],
      });
      return true;
    } catch (switchError: any) {
      // If Base network is not added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_NETWORK_CONFIG],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Base network:', addError);
          toast.error('Failed to add Base network to wallet');
          return false;
        }
      } else {
        console.error('Failed to switch to Base network:', switchError);
        toast.error('Failed to switch to Base network');
        return false;
      }
    }
  };
  
  private async initializeWalletConnect() {
    try {
      this.wcProvider = await EthereumProvider.init({
        projectId: "9f6ad252278de473475ba9ba51906dcf", // Updated with your project ID
        chains: [BASE_CHAIN_ID],
        showQrModal: true,
        // Metadata is required for WalletConnect v2
        metadata: {
          name: 'Vibe DAO',
          description: 'Vibe Coded Chaos DAO',
          url: window.location.origin,
          icons: ['https://vibecodedchaos.com/icon.png'] // You can update this with your actual icon URL
        }
      });

      // Subscribe to WalletConnect events
      this.wcProvider.on('connect', () => {
        this.handleWalletConnectConnection();
      });

      this.wcProvider.on('disconnect', () => {
        this.disconnect();
      });

      return this.wcProvider;
    } catch (error) {
      console.error('Failed to initialize WalletConnect:', error);
      throw error;
    }
  }

  private async handleWalletConnectConnection() {
    if (!this.wcProvider) return;
    
    const accounts = await this.wcProvider.enable();
    if (accounts[0]) {
      const provider = new ethers.providers.Web3Provider(this.wcProvider as any);
      const signer = provider.getSigner();
      const address = accounts[0];
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
    }
  }

  connect = async (): Promise<WalletInfo | null> => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    try {
      if (isMobile && !window.ethereum) {
        // On mobile without MetaMask, use WalletConnect
        const wcProvider = await this.initializeWalletConnect();
        if (wcProvider) {
          await wcProvider.enable();
          return this._wallet;
        }
      } else if (window.ethereum) {
        // Use MetaMask or injected provider if available
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        
        if (accounts.length === 0) {
          toast.error('No accounts found', {
            description: 'Please create an account in your wallet'
          });
          return null;
        }

        toast.success('Wallet connected successfully!', {
          description: `Connected to ${accounts[0]}`
        });
        
        return this.updateWalletInfo(accounts[0]);
      } else {
        // Fallback to WalletConnect even on desktop if no injected provider
        const wcProvider = await this.initializeWalletConnect();
        if (wcProvider) {
          await wcProvider.enable();
          return this._wallet;
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet', {
        description: 'Please try again or use a different wallet'
      });
      return null;
    }
    return null;
  };
  
  disconnect = (): void => {
    if (this.wcProvider) {
      this.wcProvider.disconnect();
    }
    this._wallet = null;
    localStorage.removeItem('walletAddress');
    
    window.dispatchEvent(new CustomEvent(walletEvents.disconnected));
    toast.info('Wallet disconnected');
  };
}

const walletService = new WalletService();
export default walletService;
