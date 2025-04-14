
import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GlitchText from './GlitchText';

const BridgedTokenInfo = () => {
  return (
    <Card className="bg-black/60 border-vibe-neon/30 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-vibe-neon flex items-center gap-2">
          <Info size={16} />
          <GlitchText text="Bridged Tokens" intensity="low" />
        </CardTitle>
        <CardDescription>
          Cross-chain token information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm border-b border-vibe-neon/20 pb-2">
            <span className="font-code">VIBE on Ethereum</span>
            <span className="font-bold text-vibe-neon">1,000,000</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-vibe-neon/20 pb-2">
            <span className="font-code">VIBE on BSC</span>
            <span className="font-bold text-vibe-pink">500,000</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-vibe-neon/20 pb-2">
            <span className="font-code">VIBE on Solana</span>
            <span className="font-bold text-vibe-blue">750,000</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 border-vibe-neon/50 text-vibe-neon hover:bg-vibe-neon/10"
          >
            Bridge Tokens
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BridgedTokenInfo;
