
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { toast } from 'sonner';

// Solana connection URL - default to devnet for testing
// Would use mainnet for production: 'https://api.mainnet-beta.solana.com'
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
// Change to proper token address when bridged
const VIBE_SOLANA_TOKEN_ADDRESS = 'TokenAddressWillGoHere11111111111111111111111';

export interface SolanaWalletInfo {
  address: string;
  publicKey: PublicKey | null;
  balance: number;
  tokens: {
    symbol: string;
    balance: number;
    address: string;
  }[];
  network: WalletAdapterNetwork;
}

export const solanaWalletEvents = {
  connected: 'solana-wallet-connected',
  disconnected: 'solana-wallet-disconnected',
  chainChanged: 'solana-wallet-chain-changed',
  accountsChanged: 'solana-wallet-accounts-changed',
};

class SolanaWalletService {
  wallet: SolanaWalletInfo | null = null;
  connection: Connection | null = null;
  isConnected: boolean = false;
  
  constructor() {
    this.initializeConnection();
  }
  
  private initializeConnection() {
    try {
      this.connection = new Connection(SOLANA_RPC_URL);
      console.log('Solana connection initialized:', SOLANA_RPC_URL);
    } catch (error) {
      console.error('Failed to initialize Solana connection:', error);
    }
  }
  
  async getTokenBalance(publicKey: PublicKey, tokenAddress: string): Promise<number> {
    if (!this.connection) return 0;
    
    try {
      // In a real implementation, you would use the SPL token program to get token accounts
      // This is a simplified placeholder for the implementation
      console.log(`Getting token balance for ${tokenAddress}`);
      // Mocking balance for now - real implementation would use getTokenAccountsByOwner
      return 100;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  }
  
  async getSolBalance(publicKey: PublicKey): Promise<number> {
    if (!this.connection) return 0;
    
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      return 0;
    }
  }
  
  async updateWalletState(publicKey: PublicKey): Promise<SolanaWalletInfo | null> {
    if (!this.connection || !publicKey) return null;
    
    try {
      const solBalance = await this.getSolBalance(publicKey);
      const tokenBalance = await this.getTokenBalance(publicKey, VIBE_SOLANA_TOKEN_ADDRESS);
      
      this.wallet = {
        address: publicKey.toString(),
        publicKey: publicKey,
        balance: solBalance,
        tokens: [
          {
            symbol: 'VIBE',
            balance: tokenBalance,
            address: VIBE_SOLANA_TOKEN_ADDRESS
          }
        ],
        network: WalletAdapterNetwork.Devnet, // Change to Mainnet for production
      };
      
      this.isConnected = true;
      
      // Dispatch connection event
      window.dispatchEvent(
        new CustomEvent(solanaWalletEvents.connected, { detail: this.wallet })
      );
      
      return this.wallet;
    } catch (error) {
      console.error('Error updating wallet state:', error);
      return null;
    }
  }
  
  handleDisconnect() {
    this.wallet = null;
    this.isConnected = false;
    
    // Dispatch disconnection event
    window.dispatchEvent(
      new CustomEvent(solanaWalletEvents.disconnected)
    );
  }
}

const solanaWalletService = new SolanaWalletService();
export default solanaWalletService;
