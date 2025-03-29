
import { ethers } from 'ethers';
import { toast } from 'sonner';

export type WalletInfo = {
  address: string;
  chainId: number;
  provider?: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
};

// Create a custom event for wallet changes
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
    // Restore wallet connection from localStorage on init
    this.checkExistingConnection();
    
    // Listen for wallet events
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
  
  private handleChainChanged = (chainId: string) => {
    // Reload the page when chain changes
    window.location.reload();
  };
  
  private handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      this.disconnect();
    } else {
      // Account changed, update the current wallet
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
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent(walletEvents.connected, { 
        detail: this._wallet 
      }));
      
      return this._wallet;
    } catch (error) {
      console.error('Failed to update wallet info:', error);
      return null;
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
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent(walletEvents.disconnected));
    
    toast.info('Wallet disconnected');
  };
}

// Create a singleton instance
const walletService = new WalletService();

export default walletService;
