
import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlitchText from "@/components/GlitchText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, MessageCircle, Users, ThumbsUp, PenTool, Reply, ChevronRight } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ForumsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const handlePostReply = () => {
    toast.info("Forum functionality coming soon", {
      description: "This feature is under development.",
    });
  };
  
  const categories = [
    { id: "all", name: "All Topics", count: 254, icon: MessageSquare },
    { id: "vibe-coding", name: "Vibe Coding", count: 87, icon: PenTool },
    { id: "projects", name: "Projects", count: 56, icon: Users },
    { id: "governance", name: "Governance", count: 34, icon: MessageCircle },
  ];
  
  const topics = [
    {
      id: 1,
      title: "How to optimize gas fees when deploying vibe-coded contracts?",
      category: "vibe-coding",
      author: "0x67ab...f412",
      date: "2 hours ago",
      replies: 12,
      views: 89,
      likes: 23,
      isPinned: true,
    },
    {
      id: 2,
      title: "Share your craziest vibe-coded projects that actually worked",
      category: "projects",
      author: "0x45de...a823",
      date: "1 day ago",
      replies: 34,
      views: 205,
      likes: 45,
      isHot: true,
    },
    {
      id: 3,
      title: "CDAO-5: Proposal to add multi-chain support for VIBE",
      category: "governance",
      author: "0x91fc...b734",
      date: "3 days ago",
      replies: 18,
      views: 127,
      likes: 31,
    },
    {
      id: 4,
      title: "Embracing glitches: How to debug vibe-coded smart contracts",
      category: "vibe-coding",
      author: "0x23ab...e567",
      date: "4 days ago",
      replies: 7,
      views: 64,
      likes: 15,
    },
    {
      id: 5,
      title: "Show off your chaos-inspired UI designs",
      category: "projects",
      author: "0x78cd...a123",
      date: "5 days ago",
      replies: 23,
      views: 189,
      likes: 37,
    },
  ];
  
  const filteredTopics = topics.filter(topic => 
    (activeCategory === "all" || topic.category === activeCategory) &&
    (searchQuery === "" || topic.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <section className="py-12 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <GlitchText text="CHAOS FORUMS" color="blue" />
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                The chaotic breeding ground for ideas, discussions, and community support.
                Share your vibe-coding insights and learn from others in the chaos.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <div className="w-full lg:w-1/4">
                <div className="card-chaos p-5 backdrop-blur-md mb-6">
                  <h2 className="text-xl font-bold mb-4 text-vibe-yellow">
                    <GlitchText text="Categories" intensity="low" />
                  </h2>
                  
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-md transition-colors",
                          activeCategory === category.id
                            ? "bg-vibe-neon/20 text-vibe-neon border border-vibe-neon/30"
                            : "hover:bg-vibe-neon/10 text-gray-300 border border-transparent"
                        )}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <div className="flex items-center">
                          <category.icon className="mr-2 h-4 w-4" />
                          <span>{category.name}</span>
                        </div>
                        <span className="text-xs py-1 px-2 bg-black/30 rounded-full">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="card-chaos p-5 backdrop-blur-md">
                  <h2 className="text-xl font-bold mb-4 text-vibe-pink">
                    <GlitchText text="Community Stats" intensity="low" />
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Topics</span>
                      <span className="text-white font-code">254</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Posts</span>
                      <span className="text-white font-code">1,892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Members</span>
                      <span className="text-white font-code">783</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Online Now</span>
                      <span className="text-vibe-neon font-code">42</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Forum Content */}
              <div className="w-full lg:w-3/4">
                <div className="card-chaos p-5 backdrop-blur-md mb-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                    <Input
                      placeholder="Search topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-black/30 border-vibe-neon/30 focus:border-vibe-neon"
                    />
                    <Button className="button-chaos group whitespace-nowrap">
                      <PenTool className="mr-2 h-4 w-4" />
                      <span>New Topic</span>
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-vibe-pink/30">
                          <th className="text-left py-3 px-2 text-gray-400">Topic</th>
                          <th className="text-center py-3 px-2 text-gray-400 hidden md:table-cell">Replies</th>
                          <th className="text-center py-3 px-2 text-gray-400 hidden md:table-cell">Views</th>
                          <th className="text-center py-3 px-2 text-gray-400 hidden md:table-cell">Likes</th>
                          <th className="text-right py-3 px-2 text-gray-400">Activity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTopics.map(topic => (
                          <tr key={topic.id} className="border-b border-vibe-neon/10 hover:bg-vibe-neon/5 transition-colors">
                            <td className="py-4 px-2">
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  {topic.isPinned && (
                                    <span className="inline-block bg-vibe-yellow/20 text-vibe-yellow text-xs px-2 py-0.5 rounded mr-2">
                                      Pinned
                                    </span>
                                  )}
                                  {topic.isHot && (
                                    <span className="inline-block bg-vibe-pink/20 text-vibe-pink text-xs px-2 py-0.5 rounded mr-2">
                                      Hot
                                    </span>
                                  )}
                                  <a href="#" className="text-white hover:text-vibe-neon transition-colors">
                                    {topic.title}
                                  </a>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  By {topic.author} • {topic.date}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-2 text-center text-gray-300 hidden md:table-cell">
                              {topic.replies}
                            </td>
                            <td className="py-4 px-2 text-center text-gray-300 hidden md:table-cell">
                              {topic.views}
                            </td>
                            <td className="py-4 px-2 text-center text-gray-300 hidden md:table-cell">
                              {topic.likes}
                            </td>
                            <td className="py-4 px-2 text-right">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-vibe-blue hover:text-vibe-neon hover:bg-transparent"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Featured Topic Preview */}
                <div className="card-chaos p-5 backdrop-blur-md">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-vibe-neon">
                      <GlitchText text="How to optimize gas fees when deploying vibe-coded contracts?" intensity="low" />
                    </h2>
                    <span className="text-xs font-code bg-vibe-yellow/10 text-vibe-yellow px-2 py-1 rounded">
                      Pinned
                    </span>
                  </div>
                  
                  <div className="bg-black/30 border border-vibe-neon/20 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-vibe-neon/20 border border-vibe-neon/40 flex items-center justify-center mr-2">
                          <span className="text-vibe-neon font-bold text-sm">V</span>
                        </div>
                        <div>
                          <div className="text-vibe-neon">0x67ab...f412</div>
                          <div className="text-xs text-gray-400">Posted 2 hours ago</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-vibe-neon">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-vibe-blue">
                          <Reply className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-gray-300">
                      <p>I've been experimenting with deploying contracts using vibe coding principles, but the gas fees are killing me. Has anyone found some good tricks to optimize?</p>
                      <p className="mt-2">I've tried a few things like:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Reducing storage variables where possible</li>
                        <li>Using bytes32 instead of strings</li>
                        <li>Avoiding loops in core functions</li>
                      </ul>
                      <p className="mt-2">But I'm still seeing really high deployment costs. Any chaotic wisdom to share?</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 border border-vibe-blue/20 rounded-lg p-4 mb-4 ml-8">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-vibe-blue/20 border border-vibe-blue/40 flex items-center justify-center mr-2">
                          <span className="text-vibe-blue font-bold text-sm">C</span>
                        </div>
                        <div>
                          <div className="text-vibe-blue">0x45de...a823</div>
                          <div className="text-xs text-gray-400">Posted 1 hour ago</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-vibe-neon">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-vibe-blue">
                          <Reply className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-gray-300">
                      <p>Have you tried using assembly blocks for the gas-intensive operations? It's messy and chaotic, but it works!</p>
                      <p className="mt-2">Also, consider breaking your contract into multiple smaller ones if you can. Deploy the core functionality first, then add features later.</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 border border-vibe-neon/20 rounded-lg p-4">
                    <Input 
                      placeholder="Write your reply..." 
                      className="bg-black/50 border-vibe-neon/30 focus:border-vibe-neon mb-3"
                    />
                    <div className="flex justify-end">
                      <Button 
                        className="border border-vibe-blue text-vibe-blue hover:bg-vibe-blue/20"
                        onClick={handlePostReply}
                      >
                        <Reply className="mr-2 h-4 w-4" /> Post Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-vibe-blue/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-vibe-pink/20 rounded-full blur-3xl -z-10"></div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForumsPage;
