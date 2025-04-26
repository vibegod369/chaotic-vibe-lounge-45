
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon, CheckIcon } from 'lucide-react';
import { toast } from "sonner";

interface ReferralCodeDisplayProps {
  referralCode: string;
  referralLink: string;
}

const ReferralCodeDisplay = ({ referralCode, referralLink }: ReferralCodeDisplayProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setHasCopied(true);
    toast.success("Referral link copied to clipboard!");
    
    setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  };

  return (
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
  );
};

export default ReferralCodeDisplay;
