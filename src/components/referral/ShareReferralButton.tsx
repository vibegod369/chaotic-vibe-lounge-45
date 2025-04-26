
import { Button } from "@/components/ui/button";
import { LinkIcon } from 'lucide-react';

interface ShareReferralButtonProps {
  referralLink: string;
}

const ShareReferralButton = ({ referralLink }: ShareReferralButtonProps) => {
  const handleShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Join%20the%20$VIBE%20presale%20using%20my%20referral%20link%20and%20let's%20embrace%20the%20chaos%20together!&url=${encodeURIComponent(referralLink)}`,
      '_blank'
    );
  };

  return (
    <Button 
      onClick={handleShare}
      className="w-full bg-vibe-blue/20 text-white border border-vibe-blue/40 hover:bg-vibe-blue/30"
    >
      <LinkIcon className="mr-2 h-4 w-4" /> Share on Twitter
    </Button>
  );
};

export default ShareReferralButton;
