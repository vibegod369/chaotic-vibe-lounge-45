
import { ethers } from 'ethers';
import { toast } from 'sonner';
import walletService from './wallet';

// Simplified Uniswap Router ABI (just the functions we need)
const UNISWAP_ROUTER_ABI = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
];

// Simplified ERC20 ABI
const ERC20_ABI = [
  "function approve(address spender, uint amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)"
];

// Base Network Addresses
const ROUTER_ADDRESS = '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24'; // UniswapV2 Router on Base
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006';  // Wrapped ETH on Base

// Token Addresses on Base
const TOKEN_ADDRESSES: { [key: string]: string } = {
  'ETH': WETH_ADDRESS,
  'BRETT': '0x7048d52bab5c458e8127a0018cde59a3b3427f38', // $BRETT
  'QR': '0x6c1822168cf3f961f58e3249ba5f9f6b14c363d7',    // $QR
  'PUBLIC': '0x6966954da0b7f6be3e4c0fa64ed6f38ffde22322', // $PUBLIC
  'VIBE': '0x7048d52bab5c458e8127a0018cde59a3b3427f38'   // Using BRETT as a placeholder for VIBE for now
};

interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  slippageTolerance: number; // In percentage (e.g., 0.5 for 0.5%)
}

class UniswapService {
  async getTokenDecimals(tokenAddress: string): Promise<number> {
    if (!walletService.wallet?.provider) {
      throw new Error('No wallet provider available');
    }
    
    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, walletService.wallet.provider);
      const decimals = await tokenContract.decimals();
      return decimals;
    } catch (error) {
      console.error('Error getting token decimals:', error);
      return 18; // Default to 18 if there's an error
    }
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    if (!walletService.wallet?.provider) {
      throw new Error('No wallet provider available');
    }
    
    try {
      // For ETH
      if (tokenAddress.toLowerCase() === 'eth') {
        const balance = await walletService.wallet.provider.getBalance(walletAddress);
        return ethers.utils.formatEther(balance);
      }
      
      // For ERC20 tokens
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, walletService.wallet.provider);
      const decimals = await this.getTokenDecimals(tokenAddress);
      const balance = await tokenContract.balanceOf(walletAddress);
      return ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }

  async getAmountOut(amountIn: string, fromToken: string, toToken: string): Promise<string> {
    if (!walletService.wallet?.provider || !amountIn || parseFloat(amountIn) <= 0) {
      return '0';
    }
    
    try {
      const fromTokenAddress = TOKEN_ADDRESSES[fromToken] || fromToken;
      const toTokenAddress = TOKEN_ADDRESSES[toToken] || toToken;
      
      const router = new ethers.Contract(ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, walletService.wallet.provider);
      const fromTokenDecimals = await this.getTokenDecimals(fromTokenAddress);
      
      const path = [fromTokenAddress, toTokenAddress];
      const amountInWei = ethers.utils.parseUnits(amountIn, fromTokenDecimals);
      
      const amounts = await router.getAmountsOut(amountInWei, path);
      const toTokenDecimals = await this.getTokenDecimals(toTokenAddress);
      const amountOut = ethers.utils.formatUnits(amounts[1], toTokenDecimals);
      
      return amountOut;
    } catch (error) {
      console.error('Error getting amount out:', error);
      return '0';
    }
  }

  async executeSwap({ fromToken, toToken, amount, slippageTolerance }: SwapParams): Promise<{ success: boolean, txHash?: string, error?: string }> {
    if (!walletService.wallet?.signer) {
      toast.error('Please connect your wallet first');
      return { success: false, error: 'Wallet not connected' };
    }
    
    try {
      const fromTokenAddress = TOKEN_ADDRESSES[fromToken] || fromToken;
      const toTokenAddress = TOKEN_ADDRESSES[toToken] || toToken;
      
      const router = new ethers.Contract(ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, walletService.wallet.signer);
      const fromTokenDecimals = await this.getTokenDecimals(fromTokenAddress);
      
      const amountIn = ethers.utils.parseUnits(amount, fromTokenDecimals);
      const path = [fromTokenAddress, toTokenAddress];
      
      // Get estimated amount out
      const amountsOut = await router.getAmountsOut(amountIn, path);
      const amountOutMin = amountsOut[1].mul(ethers.BigNumber.from(1000 - slippageTolerance * 10)).div(ethers.BigNumber.from(1000));
      
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
      
      // Check if this is an ETH to token swap
      let tx;
      if (fromToken.toUpperCase() === 'ETH') {
        // ETH to Token
        tx = await router.swapExactETHForTokens(
          amountOutMin,
          path,
          walletService.wallet.address,
          deadline,
          { value: amountIn }
        );
      } else if (toToken.toUpperCase() === 'ETH') {
        // Token to ETH
        // First approve the router to spend tokens
        const tokenContract = new ethers.Contract(fromTokenAddress, ERC20_ABI, walletService.wallet.signer);
        const approveTx = await tokenContract.approve(ROUTER_ADDRESS, amountIn);
        await approveTx.wait();
        
        tx = await router.swapExactTokensForETH(
          amountIn,
          amountOutMin,
          path,
          walletService.wallet.address,
          deadline
        );
      } else {
        // Token to Token
        // First approve the router to spend tokens
        const tokenContract = new ethers.Contract(fromTokenAddress, ERC20_ABI, walletService.wallet.signer);
        const approveTx = await tokenContract.approve(ROUTER_ADDRESS, amountIn);
        await approveTx.wait();
        
        tx = await router.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          path,
          walletService.wallet.address,
          deadline
        );
      }
      
      const receipt = await tx.wait();
      
      toast.success('Swap completed successfully!', {
        description: `Swapped ${amount} ${fromToken} to ${toToken}`
      });
      
      return { success: true, txHash: receipt.transactionHash };
    } catch (error: any) {
      console.error('Swap error:', error);
      
      // Extract error message
      let errorMessage = 'Failed to execute swap';
      if (error.reason) errorMessage = error.reason;
      else if (error.message) errorMessage = error.message.split('(')[0].trim();
      
      toast.error('Swap failed', {
        description: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  }
  
  // Get token list 
  getAvailableTokens() {
    return [
      { symbol: 'ETH', name: 'Ethereum', address: WETH_ADDRESS },
      { symbol: 'BRETT', name: 'Brett', address: TOKEN_ADDRESSES['BRETT'] },
      { symbol: 'QR', name: 'QR', address: TOKEN_ADDRESSES['QR'] },
      { symbol: 'PUBLIC', name: 'Public', address: TOKEN_ADDRESSES['PUBLIC'] },
      { symbol: 'VIBE', name: 'Vibe', address: TOKEN_ADDRESSES['VIBE'] }
    ];
  }
}

const uniswapService = new UniswapService();
export default uniswapService;
