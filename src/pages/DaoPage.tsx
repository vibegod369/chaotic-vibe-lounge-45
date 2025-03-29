
import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlitchText from "@/components/GlitchText";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightIcon, Vote, ChevronRight, FileText } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import walletService from '@/services/wallet';

const DaoPage = () => {
  const [activeTab, setActiveTab] = useState("active");
  
  const handleVote = () => {
    if (!walletService.isConnected) {
      toast.error("Please connect your wallet to vote", {
        description: "Connect your wallet to participate in DAO governance",
      });
      return;
    }
    
    toast.info("Voting functionality coming soon", {
      description: "This feature is under development.",
    });
  };
  
  const proposals = [
    {
      id: "CDAO-1",
      title: "Increase Staking Rewards",
      status: "active",
      description: "Increase the staking rewards for VIBE/ETH LP tokens from 5% to 8% APY to incentivize liquidity provision.",
      forVotes: 552300,
      againstVotes: 234500,
      endDate: "2023-11-30",
    },
    {
      id: "CDAO-2",
      title: "Add VIBE/USDC Pair",
      status: "active",
      description: "Add a new trading pair VIBE/USDC to the Vibe DEX to increase trading options and liquidity.",
      forVotes: 348900,
      againstVotes: 156700,
      endDate: "2023-12-05",
    },
    {
      id: "CDAO-3",
      title: "Reduce Project Launch Threshold",
      status: "ended",
      description: "Reduce the threshold required for project launches from 100,000 VIBE to 50,000 VIBE to enable more projects to launch.",
      forVotes: 451200,
      againstVotes: 789600,
      endDate: "2023-10-15",
      result: "Rejected"
    },
    {
      id: "CDAO-4",
      title: "Implement Vibe Staking",
      status: "ended",
      description: "Implement direct VIBE token staking with 3% APY rewards to provide an alternative to LP staking.",
      forVotes: 987400,
      againstVotes: 124300,
      endDate: "2023-09-20",
      result: "Approved"
    },
  ];
  
  const formatVotes = (votes: number) => {
    return new Intl.NumberFormat().format(votes);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <section className="py-12 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <GlitchText text="CHAOS DAO" color="yellow" />
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                The chaotic governance system where VIBE holders decide the future of the platform.
                Vote on proposals, suggest changes, and shape the future of Vibe Coded Caos.
              </p>
            </div>
            
            <div className="card-chaos p-6 backdrop-blur-md mb-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-vibe-neon mb-2">
                    <GlitchText text="Governance Overview" intensity="low" />
                  </h2>
                  <p className="text-gray-400">
                    Vote with your VIBE tokens on protocol changes, token economics, and community proposals.
                  </p>
                </div>
                <Button className="button-chaos group">
                  <span className="mr-2">Create Proposal</span>
                  <ArrowRightIcon className="h-4 w-4 group-hover:animate-slide-right" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/40 border border-vibe-neon/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Total VIBE in DAO</div>
                  <div className="text-2xl font-bold text-white font-code">12,456,789 VIBE</div>
                </div>
                <div className="bg-black/40 border border-vibe-neon/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Active Proposals</div>
                  <div className="text-2xl font-bold text-white font-code">2</div>
                </div>
                <div className="bg-black/40 border border-vibe-neon/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Governance Participation</div>
                  <div className="text-2xl font-bold text-white font-code">32.5%</div>
                </div>
              </div>
            </div>
            
            <div className="card-chaos p-6 backdrop-blur-md">
              <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="active" className="data-[state=active]:bg-vibe-neon/20 data-[state=active]:text-vibe-neon">
                    Active Proposals
                  </TabsTrigger>
                  <TabsTrigger value="ended" className="data-[state=active]:bg-vibe-pink/20 data-[state=active]:text-vibe-pink">
                    Past Proposals
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="space-y-6">
                  {proposals
                    .filter(p => p.status === 'active')
                    .map(proposal => (
                      <div key={proposal.id} className="bg-black/30 border border-vibe-neon/20 rounded-lg p-5 hover:border-vibe-neon/40 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-vibe-neon">
                            {proposal.title}
                          </h3>
                          <span className="text-xs font-code text-vibe-yellow px-2 py-1 bg-vibe-yellow/10 rounded">
                            {proposal.id}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{proposal.description}</p>
                        
                        <div className="flex justify-between text-sm text-gray-400 mb-3">
                          <span>Voting ends: {proposal.endDate}</span>
                          <span>
                            {formatVotes(proposal.forVotes + proposal.againstVotes)} VIBE voted
                          </span>
                        </div>
                        
                        <div className="flex justify-between mb-4">
                          <div className="w-[48%]">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-vibe-neon">For</span>
                              <span className="text-white font-code">
                                {((proposal.forVotes / (proposal.forVotes + proposal.againstVotes)) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-black/50 rounded-full h-2.5">
                              <div 
                                className="bg-vibe-neon h-2.5 rounded-full" 
                                style={{ width: `${(proposal.forVotes / (proposal.forVotes + proposal.againstVotes)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="w-[48%]">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-vibe-pink">Against</span>
                              <span className="text-white font-code">
                                {((proposal.againstVotes / (proposal.forVotes + proposal.againstVotes)) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-black/50 rounded-full h-2.5">
                              <div 
                                className="bg-vibe-pink h-2.5 rounded-full" 
                                style={{ width: `${(proposal.againstVotes / (proposal.forVotes + proposal.againstVotes)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            className="w-1/2 border-vibe-neon text-vibe-neon hover:bg-vibe-neon/20"
                            onClick={handleVote}
                          >
                            <Vote className="mr-2 h-4 w-4" /> Vote For
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-1/2 border-vibe-pink text-vibe-pink hover:bg-vibe-pink/20"
                            onClick={handleVote}
                          >
                            <Vote className="mr-2 h-4 w-4" /> Vote Against
                          </Button>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                
                <TabsContent value="ended" className="space-y-6">
                  {proposals
                    .filter(p => p.status === 'ended')
                    .map(proposal => (
                      <div key={proposal.id} className={cn(
                        "bg-black/30 border rounded-lg p-5 transition-colors",
                        proposal.result === "Approved" 
                          ? "border-vibe-neon/20 hover:border-vibe-neon/40" 
                          : "border-vibe-pink/20 hover:border-vibe-pink/40"
                      )}>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-white">
                            {proposal.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-code text-vibe-yellow px-2 py-1 bg-vibe-yellow/10 rounded">
                              {proposal.id}
                            </span>
                            <span className={cn(
                              "text-xs font-code px-2 py-1 rounded",
                              proposal.result === "Approved" 
                                ? "text-vibe-neon bg-vibe-neon/10" 
                                : "text-vibe-pink bg-vibe-pink/10"
                            )}>
                              {proposal.result}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{proposal.description}</p>
                        
                        <div className="flex justify-between text-sm text-gray-400 mb-3">
                          <span>Ended: {proposal.endDate}</span>
                          <span>
                            {formatVotes(proposal.forVotes + proposal.againstVotes)} VIBE voted
                          </span>
                        </div>
                        
                        <div className="flex justify-between mb-4">
                          <div className="w-[48%]">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-vibe-neon">For</span>
                              <span className="text-white font-code">
                                {((proposal.forVotes / (proposal.forVotes + proposal.againstVotes)) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-black/50 rounded-full h-2.5">
                              <div 
                                className="bg-vibe-neon h-2.5 rounded-full" 
                                style={{ width: `${(proposal.forVotes / (proposal.forVotes + proposal.againstVotes)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="w-[48%]">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-vibe-pink">Against</span>
                              <span className="text-white font-code">
                                {((proposal.againstVotes / (proposal.forVotes + proposal.againstVotes)) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-black/50 rounded-full h-2.5">
                              <div 
                                className="bg-vibe-pink h-2.5 rounded-full" 
                                style={{ width: `${(proposal.againstVotes / (proposal.forVotes + proposal.againstVotes)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full border-vibe-blue text-vibe-blue hover:bg-vibe-blue/20"
                        >
                          <FileText className="mr-2 h-4 w-4" /> View Details
                        </Button>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Background elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-vibe-yellow/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-vibe-blue/20 rounded-full blur-3xl -z-10"></div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DaoPage;
