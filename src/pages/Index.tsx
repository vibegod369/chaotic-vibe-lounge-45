
import { useEffect, useState, useRef } from 'react';
import { ArrowDownIcon, AlertCircleIcon, GitMergeIcon, RocketIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GlitchText from "@/components/GlitchText";
import ConnectWallet from "@/components/ConnectWallet";
import CountdownTimer from "@/components/CountdownTimer";
import ReferralSystem from "@/components/ReferralSystem";
import PresaleDeposit from "@/components/PresaleDeposit";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const referralCodeRef = useRef<HTMLInputElement>(null);

  // Launch date (one month from now)
  const launchDate = new Date();
  launchDate.setMonth(launchDate.getMonth() + 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen pt-20 flex items-center relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">
                <GlitchText text="Coming Soon" color="neon" />
              </span>
              <span className="block mt-2">
                <GlitchText text="Launch with" color="pink" intensity="low" />
                <span className="text-gradient ml-2">$VIBE</span>
              </span>
            </h1>

            <p className="text-gray-300 mb-8">
              Vibe Coded Chaos DAO is designed to harness the rough, spontaneous, and unrefined nature of vibe coding. 
              Join our mission to embrace the chaotic and resilient ethos of decentralized technology. No barriers, no boundaries.
            </p>

            <div className="my-12">
              <CountdownTimer targetDate={launchDate} />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button 
                variant="outline" 
                className="border-vibe-pink text-vibe-pink hover:bg-vibe-pink/20"
                onClick={() => {
                  const section = document.getElementById('presale');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Join Presale
              </Button>
              <Button 
                variant="outline" 
                className="border-vibe-neon text-vibe-neon hover:bg-vibe-neon/20"
                onClick={() => window.open("https://chatgpt.com/canvas/shared/67ee88be82248191be43be691f900a7b", "_blank")}
              >
                Read Whitepaper
              </Button>
            </div>
          </div>
        </div>
  
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-vibe-pink/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-vibe-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-vibe-dark via-vibe-dark/90 to-vibe-dark opacity-80 pointer-events-none"></div>
      </section>

      {/* Presale Section */}
      <section id="presale" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">
                <GlitchText text="Join the Presale" color="yellow" />
              </h2>
              <p className="text-gray-300 mb-6">
                Be an early adopter and secure your $VIBE tokens before the public launch.
                Connect your wallet to participate in our presale and referral program.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left: Referral System */}
              <div className="card-chaos p-6 h-full">
                <h3 className="text-xl font-bold text-vibe-neon mb-4 flex items-center">
                  <GitMergeIcon className="mr-2 h-5 w-5" /> Referral Program
                </h3>
                <ReferralSystem />
              </div>
              
              {/* Right: ETH Deposit */}
              <div className="card-chaos p-6 h-full">
                <h3 className="text-xl font-bold text-vibe-pink mb-4 flex items-center">
                  <RocketIcon className="mr-2 h-5 w-5" /> Presale Deposit
                </h3>
                <PresaleDeposit />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-vibe-dark to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-vibe-dark to-transparent pointer-events-none"></div>
      </section>

      {/* About Section */}
      <section className="py-20 relative bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              <GlitchText text="What is Vibe Coded Chaos?" color="yellow" />
            </h2>
            <p className="text-gray-300 mb-8">
              Vibe Coded Chaos DAO is a Web3 project designed to embrace the rough, spontaneous, and unrefined nature of vibe coding. 
              It leverages the chaotic and resilient ethos of decentralized development to showcase the robustness of blockchain technology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 border border-vibe-neon/30 rounded-lg hover:bg-vibe-neon/5 transition-colors">
                <h3 className="text-vibe-neon font-bold mb-2">Fair Token Launch</h3>
                <p className="text-sm text-gray-400">Transparent distribution prioritizing community participation with no private sales.</p>
              </div>
              <div className="p-6 border border-vibe-blue/30 rounded-lg hover:bg-vibe-blue/5 transition-colors">
                <h3 className="text-vibe-blue font-bold mb-2">Project Launchpad</h3>
                <p className="text-sm text-gray-400">Launch vibe-coded projects using our contract factory with VIBE as liquidity.</p>
              </div>
              <div className="p-6 border border-vibe-pink/30 rounded-lg hover:bg-vibe-pink/5 transition-colors">
                <h3 className="text-vibe-pink font-bold mb-2">Vibe Contributor</h3>
                <p className="text-sm text-gray-400">Stake LP tokens to support projects and earn VIBE rewards regardless of voting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
