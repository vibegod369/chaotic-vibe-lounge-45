
import { useEffect, useState } from 'react';
import { ArrowDownIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TokenTicker from "@/components/TokenTicker";
import DealRoom from "@/components/DealRoom";
import VibeContributor from "@/components/VibeContributor";
import GlitchText from "@/components/GlitchText";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen pt-20 flex items-center relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">
                <GlitchText text="Embrace the chaos." color="neon" />
              </span>
              <span className="block mt-2">
                <GlitchText text="Launch with" color="pink" intensity="low" />
                <span className="text-gradient ml-2">$VIBE</span>
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 font-hand">
              A celebration of the raw, unfiltered spirit of blockchain innovation.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button className="button-chaos group">
                <span className="mr-2">Launch App</span>
                <ArrowDownIcon className="h-4 w-4 group-hover:animate-bounce" />
              </Button>
              <Button variant="outline" className="border-vibe-pink text-vibe-pink hover:bg-vibe-pink/20">
                Read Whitepaper
              </Button>
            </div>

            <div className="mb-8 animate-float">
              <TokenTicker />
            </div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-vibe-pink/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-vibe-blue/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-vibe-dark via-vibe-dark/90 to-vibe-dark opacity-80 pointer-events-none"></div>
      </section>

      {/* Main Content */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column - Deal Room */}
            <div className="w-full lg:w-2/3">
              <DealRoom />
            </div>

            {/* Right Column - VC Dashboard */}
            <div className="w-full lg:w-1/3">
              <VibeContributor />
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
              <GlitchText text="What is Vibe Coded Caos?" color="yellow" />
            </h2>
            <p className="text-gray-300 mb-8">
              Vibe Coded Caos DAO is a Web3 project designed to embrace the rough, spontaneous, and unrefined nature of vibe coding. 
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
      
      <Footer />
    </div>
  );
};

export default Index;
