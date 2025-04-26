
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertCircleIcon, 
  ArrowRightIcon,
  CalculatorIcon,
  InfoIcon
} from 'lucide-react';
import { toast } from "sonner";
import ConnectWallet from './ConnectWallet';
import walletService, { walletEvents } from '@/services/wallet';
import { ethers } from 'ethers';

// Presale deposit address from user's specifications
const PRESALE_ADDRESS = "0x77e88D42E6019744597E34dfDe1DC31A98e0F397";

// Base network configuration
const BASE_CHAIN_ID = 8453;

interface PresaleInfo {
  minContribution: string;
  maxContribution: string;
  tokenPrice: string;
  hardCap: string;
  raised: string;
  endDate: Date;
}

const PresaleDeposit = () => {
  const [amount, setAmount] = useState('0.1');
  const [tokensToReceive, setTokensToReceive] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  
  // Sample presale info - in a real app this would come from a contract or API
  const presaleInfo: PresaleInfo = {
    minContribution: '0.05',
    maxContribution: '5',
    tokenPrice: '0.0001',
    hardCap: '500',
    raised: '142.75',
    endDate: new Date('2025-05-14')
  };
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    (parseFloat(presaleInfo.raised) / parseFloat(presaleInfo.hardCap)) * 100,
    100
  );

  useEffect(() => {
    const handleConnect = async () => {
      if (walletService.wallet) {
        setIsConnected(true);
        checkNetwork();
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsCorrectNetwork(false);
    };

    const handleChainChanged = () => {
      checkNetwork();
    };

    const checkNetwork = async () => {
      if (walletService.wallet?.provider) {
        try {
          const network = await walletService.wallet.provider.getNetwork();
          setIsCorrectNetwork(network.chainId === BASE_CHAIN_ID);
        } catch (error) {
          console.error("Error checking network:", error);
          setIsCorrectNetwork(false);
        }
      } else {
        setIsCorrectNetwork(false);
      }
    };

    // Check if already connected
    if (walletService.wallet) {
      handleConnect();
    }

    // Add event listeners
    window.addEventListener(walletEvents.connected, handleConnect);
    window.addEventListener(walletEvents.disconnected, handleDisconnect);
    window.addEventListener(walletEvents.chainChanged, handleChainChanged);

    return () => {
      window.removeEventListener(walletEvents.connected, handleConnect);
      window.removeEventListener(walletEvents.disconnected, handleDisconnect);
      window.removeEventListener(walletEvents.chainChanged, handleChainChanged);
    };
  }, []);

  // Calculate tokens to receive when amount changes
  useEffect(() => {
    try {
      const amountFloat = parseFloat(amount) || 0;
      const priceFloat = parseFloat(presaleInfo.tokenPrice);
      
      if (amountFloat > 0 && priceFloat > 0) {
        const tokens = amountFloat / priceFloat;
        setTokensToReceive(tokens.toLocaleString('en-US', { maximumFractionDigits: 0 }));
      } else {
        setTokensToReceive('0');
      }
    } catch (error) {
      setTokensToReceive('0');
    }
  }, [amount, presaleInfo.tokenPrice]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleMaxClick = () => {
    setAmount(presaleInfo.maxContribution);
  };

  const switchToBaseNetwork = async () => {
    await walletService.switchToBase();
    // Check if network was successfully switched
    if (walletService.wallet?.provider) {
      const network = await walletService.wallet.provider.getNetwork();
      setIsCorrectNetwork(network.chainId === BASE_CHAIN_ID);
    }
  };

  const handleDeposit = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isCorrectNetwork) {
      toast.error("Please switch to Base network");
      await switchToBaseNetwork();
      return;
    }

    if (!walletService.wallet?.signer) {
      toast.error("Wallet signer not available");
      return;
    }

    const amountFloat = parseFloat(amount);
    
    // Validate amount
    if (isNaN(amountFloat) || amountFloat <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (amountFloat < parseFloat(presaleInfo.minContribution)) {
      toast.error(`Minimum contribution is ${presaleInfo.minContribution} ETH`);
      return;
    }
    
    if (amountFloat > parseFloat(presaleInfo.maxContribution)) {
      toast.error(`Maximum contribution is ${presaleInfo.maxContribution} ETH`);
      return;
    }

    setIsDepositing(true);
    
    try {
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Estimate gas to know the total cost (transaction amount + gas)
      let gasEstimate;
      try {
        // Estimate gas for the transaction
        gasEstimate = await walletService.wallet.provider.estimateGas({
          to: PRESALE_ADDRESS,
          value: amountInWei,
          from: walletService.wallet.address
        });
        
        // Add 20% buffer to gas estimate to prevent failures
        gasEstimate = gasEstimate.mul(120).div(100);
      } catch (gasError) {
        console.error('Gas estimation failed:', gasError);
        // Use a reasonable default if estimation fails
        gasEstimate = ethers.BigNumber.from(21000).mul(2); 
      }
      
      // Get current gas price
      const gasPrice = await walletService.wallet.provider.getGasPrice();
      
      // Calculate total transaction cost (amount + gas fee)
      const gasCost = gasPrice.mul(gasEstimate);
      const totalCost = amountInWei.add(gasCost);
      
      // Check user balance before sending transaction
      const balance = await walletService.wallet.provider.getBalance(walletService.wallet.address);
      
      if (balance.lt(totalCost)) {
        const totalEthCost = parseFloat(ethers.utils.formatEther(totalCost));
        const balanceEth = parseFloat(ethers.utils.formatEther(balance));
        const gasCostEth = parseFloat(ethers.utils.formatEther(gasCost));
        
        toast.error("Insufficient balance for transaction", {
          description: `You need ~${totalEthCost.toFixed(4)} ETH total (${amountFloat} ETH + ~${gasCostEth.toFixed(4)} ETH for gas). Current balance: ${balanceEth.toFixed(4)} ETH`
        });
        setIsDepositing(false);
        return;
      }
      
      // Send transaction to the presale address with explicit gas settings
      const tx = await walletService.wallet.signer.sendTransaction({
        to: PRESALE_ADDRESS,
        value: amountInWei,
        gasLimit: gasEstimate
      });
      
      // Wait for transaction to be mined
      toast.info("Transaction submitted, waiting for confirmation...");
      await tx.wait(1); // Wait for 1 confirmation
      
      toast.success("Deposit successful!", {
        description: `You have successfully contributed ${amount} ETH to the presale. Transaction hash: ${tx.hash}`
      });
    } catch (error: any) {
      console.error('Deposit error:', error);
      
      // Extract error message with more detailed RPC error handling
      let errorMessage = 'Failed to execute deposit';
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        // Clean up common JSON-RPC error messages to be more user-friendly
        errorMessage = error.message.split('(')[0].trim();
        if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds to complete this transaction including gas fees';
        } else if (errorMessage.includes('user rejected')) {
          errorMessage = 'Transaction was rejected in your wallet';
        }
      }
      
      toast.error("Deposit failed", {
        description: errorMessage
      });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-300">
        Contribute ETH to participate in our presale. Tokens will be claimable after the presale ends.
      </p>
      
      {!isConnected ? (
        <div className="flex justify-center py-4">
          <ConnectWallet />
        </div>
      ) : (
        <div className="space-y-4">
          {!isCorrectNetwork && (
            <div className="p-3 border border-orange-500/50 rounded-lg bg-orange-500/10 mb-4">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <AlertCircleIcon className="h-4 w-4" />
                <h3 className="text-sm font-medium">Wrong Network</h3>
              </div>
              <p className="text-gray-400 text-xs mb-2">
                Please switch to Base network to participate in the presale.
              </p>
              <Button 
                size="sm"
                onClick={switchToBaseNetwork} 
                className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-200"
              >
                Switch to Base Network
              </Button>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-vibe-pink">{presaleInfo.raised} / {presaleInfo.hardCap} ETH</span>
            </div>
            <div className="w-full h-3 bg-vibe-dark rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-vibe-neon to-vibe-pink rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Amount to Contribute</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-vibe-neon hover:text-vibe-neon/90 hover:bg-transparent"
                onClick={handleMaxClick}
              >
                MAX
              </Button>
            </div>
            
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min={presaleInfo.minContribution}
                max={presaleInfo.maxContribution}
                step="0.01"
                className="bg-vibe-dark/80 border-vibe-pink/30 pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ETH
              </div>
            </div>
            
            <div className="bg-vibe-dark/50 border border-vibe-neon/20 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center">
                  <CalculatorIcon className="h-3 w-3 mr-1" /> You will receive:
                </span>
                <span className="text-vibe-neon font-code">{tokensToReceive} $VIBE</span>
              </div>
            </div>
          </div>
          
          <div className="flex text-xs justify-between text-gray-400 px-1">
            <div>Min: {presaleInfo.minContribution} ETH</div>
            <div>Max: {presaleInfo.maxContribution} ETH</div>
          </div>
          
          <Button
            onClick={handleDeposit}
            disabled={!isConnected || isDepositing || !isCorrectNetwork}
            className="w-full button-chaos group"
          >
            {isDepositing ? (
              <div className="flex items-center">
                <span className="animate-pulse">Processing...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">Deposit</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:animate-slide-right" />
              </div>
            )}
          </Button>
          
          <div className="text-xs text-gray-400 flex items-start">
            <InfoIcon className="h-3 w-3 mr-1 mt-0.5 text-vibe-yellow" />
            <span>
              Tokens will be claimable after the presale ends. By participating, you agree to our terms and conditions.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresaleDeposit;
