
import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlitchText from "@/components/GlitchText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { MessageSquare, MessageCircle, Users, ThumbsUp, PenTool, Reply, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ForumService } from '@/services/forum';
import walletService from '@/services/wallet';
import uniswapService from '@/services/uniswap';

const ForumsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState("vibe-coding");
  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  // Token approval states
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isApproving, setIsApproving] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  // Constants for token requirements
  const TOKEN_REQUIRED_TO_POST = '0.01';
  const TOKEN_REQUIRED_TO_REPLY = '0.005';
  const TOKEN_SYMBOL = 'BRETT'; // Will be VIBE later
  
  useEffect(() => {
    loadTopics();
    checkTokenBalance();
  }, []);
  
  useEffect(() => {
    // Listen for wallet connection changes to update token balance
    window.addEventListener('wallet-connected', checkTokenBalance);
    window.addEventListener('wallet-disconnected', () => setTokenBalance('0'));
    
    return () => {
      window.removeEventListener('wallet-connected', checkTokenBalance);
      window.removeEventListener('wallet-disconnected', () => setTokenBalance('0'));
    };
  }, []);
  
  const checkTokenBalance = async () => {
    if (!walletService.wallet?.address) return;
    
    try {
      const balance = await uniswapService.getTokenBalance(
        uniswapService.TOKEN_ADDRESSES[TOKEN_SYMBOL], 
        walletService.wallet.address
      );
      setTokenBalance(balance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setTokenBalance('0');
    }
  };
  
  const loadTopics = async () => {
    setLoading(true);
    try {
      const fetchedTopics = await ForumService.getTopics();
      setTopics(fetchedTopics);
    } catch (error) {
      console.error("Error loading topics:", error);
      toast.error("Failed to load forum topics", {
        description: "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewTopic = async (topicId) => {
    try {
      const topic = await ForumService.getTopicById(topicId);
      setActiveTopic(topic);
    } catch (error) {
      console.error("Error loading topic:", error);
      toast.error("Failed to load topic details", {
        description: "Please try again later"
      });
    }
  };
  
  const handlePostReply = async () => {
    if (!walletService.wallet) {
      setShowAuthDialog(true);
      return;
    }
    
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    // Check token balance
    if (parseFloat(tokenBalance) < parseFloat(TOKEN_REQUIRED_TO_REPLY)) {
      toast.error(`Insufficient ${TOKEN_SYMBOL} balance`, {
        description: `You need at least ${TOKEN_REQUIRED_TO_REPLY} ${TOKEN_SYMBOL} to reply`
      });
      return;
    }
    
    setIsPosting(true);
    try {
      await ForumService.postReply(activeTopic.id, replyContent, walletService.wallet.address);
      
      // Refresh topic data
      const updatedTopic = await ForumService.getTopicById(activeTopic.id);
      setActiveTopic(updatedTopic);
      
      setReplyContent("");
      toast.success("Reply posted successfully!");
      
      // Refresh topics list to update counts
      loadTopics();
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply", {
        description: error.message || "Please try again later"
      });
    } finally {
      setIsPosting(false);
    }
  };
  
  const handleCreateTopic = async () => {
    if (!walletService.wallet) {
      setShowAuthDialog(true);
      return;
    }
    
    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }
    
    // Check token balance
    if (parseFloat(tokenBalance) < parseFloat(TOKEN_REQUIRED_TO_POST)) {
      toast.error(`Insufficient ${TOKEN_SYMBOL} balance`, {
        description: `You need at least ${TOKEN_REQUIRED_TO_POST} ${TOKEN_SYMBOL} to create a topic`
      });
      return;
    }
    
    setIsPosting(true);
    try {
      const newTopic = await ForumService.createTopic({
        title: newTopicTitle,
        content: newTopicContent,
        category: newTopicCategory,
        author: walletService.wallet.address
      });
      
      setNewTopicTitle("");
      setNewTopicContent("");
      setShowNewTopicDialog(false);
      
      toast.success("Topic created successfully!");
      
      // Refresh topics list
      await loadTopics();
      
      // Navigate to the new topic
      handleViewTopic(newTopic.id);
    } catch (error) {
      console.error("Error creating topic:", error);
      toast.error("Failed to create topic", {
        description: error.message || "Please try again later"
      });
    } finally {
      setIsPosting(false);
    }
  };
  
  const handleLike = async (itemId, type) => {
    if (!walletService.wallet) {
      setShowAuthDialog(true);
      return;
    }
    
    try {
      if (type === 'topic') {
        await ForumService.likeTopic(itemId);
      } else {
        await ForumService.likeReply(itemId);
      }
      
      // Refresh topic if we're viewing it
      if (activeTopic && (type === 'topic' && activeTopic.id === itemId)) {
        const updatedTopic = await ForumService.getTopicById(activeTopic.id);
        setActiveTopic(updatedTopic);
      }
      
      // Refresh topics list
      loadTopics();
      
      toast.success("Like added!");
    } catch (error) {
      console.error("Error liking item:", error);
      toast.error("Failed to like", {
        description: error.message || "Please try again later"
      });
    }
  };
  
  const categories = [
    { id: "all", name: "All Topics", count: topics.length, icon: MessageSquare },
    { id: "vibe-coding", name: "Vibe Coding", count: topics.filter(t => t.category === "vibe-coding").length, icon: PenTool },
    { id: "projects", name: "Projects", count: topics.filter(t => t.category === "projects").length, icon: Users },
    { id: "governance", name: "Governance", count: topics.filter(t => t.category === "governance").length, icon: MessageCircle },
  ];
  
  const filteredTopics = topics.filter(topic => 
    (activeCategory === "all" || topic.category === activeCategory) &&
    (searchQuery === "" || topic.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Return to topics list
  const handleBackToTopics = () => {
    setActiveTopic(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
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
              
              {walletService.wallet && (
                <div className="mt-4 text-vibe-neon">
                  <p>Your {TOKEN_SYMBOL} Balance: <span className="font-bold">{parseFloat(tokenBalance).toFixed(4)}</span></p>
                  <p className="text-sm text-gray-400 mt-1">
                    Cost per post: {TOKEN_REQUIRED_TO_POST} {TOKEN_SYMBOL} · 
                    Cost per reply: {TOKEN_REQUIRED_TO_REPLY} {TOKEN_SYMBOL}
                  </p>
                </div>
              )}
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
                    <GlitchText text="Forum Stats" intensity="low" />
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Topics</span>
                      <span className="text-white font-code">{topics.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Posts</span>
                      <span className="text-white font-code">
                        {topics.reduce((total, topic) => total + (topic.replies?.length || 0) + 1, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active Users</span>
                      <span className="text-white font-code">
                        {new Set(topics.flatMap(topic => 
                          [topic.author, ...(topic.replies?.map(r => r.author) || [])]
                        )).size}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Online Now</span>
                      <span className="text-vibe-neon font-code">
                        {Math.floor(Math.random() * 10) + 30}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Forum Content */}
              <div className="w-full lg:w-3/4">
                {!activeTopic ? (
                  // Topics List
                  <div className="card-chaos p-5 backdrop-blur-md mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                      <Input
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/30 border-vibe-neon/30 focus:border-vibe-neon"
                      />
                      <Dialog open={showNewTopicDialog} onOpenChange={setShowNewTopicDialog}>
                        <DialogTrigger asChild>
                          <Button className="button-chaos group whitespace-nowrap">
                            <PenTool className="mr-2 h-4 w-4" />
                            <span>New Topic</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black/90 border border-vibe-neon/30 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-vibe-neon">Create New Topic</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Cost: {TOKEN_REQUIRED_TO_POST} {TOKEN_SYMBOL}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 my-4">
                            <div>
                              <label className="text-sm text-gray-300 mb-1 block">Title</label>
                              <Input
                                placeholder="Topic title"
                                value={newTopicTitle}
                                onChange={(e) => setNewTopicTitle(e.target.value)}
                                className="bg-black/50 border-vibe-blue/30"
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm text-gray-300 mb-1 block">Category</label>
                              <select 
                                value={newTopicCategory}
                                onChange={(e) => setNewTopicCategory(e.target.value)}
                                className="w-full bg-black/50 border border-vibe-blue/30 rounded-md px-3 py-2 text-white"
                              >
                                <option value="vibe-coding">Vibe Coding</option>
                                <option value="projects">Projects</option>
                                <option value="governance">Governance</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-sm text-gray-300 mb-1 block">Content</label>
                              <Textarea
                                placeholder="Write your post here..."
                                value={newTopicContent}
                                onChange={(e) => setNewTopicContent(e.target.value)}
                                className="bg-black/50 border-vibe-blue/30 min-h-[150px]"
                              />
                            </div>
                            
                            {parseFloat(tokenBalance) < parseFloat(TOKEN_REQUIRED_TO_POST) && (
                              <div className="flex items-center gap-2 text-vibe-yellow bg-vibe-yellow/10 p-2 rounded">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">You need at least {TOKEN_REQUIRED_TO_POST} {TOKEN_SYMBOL} to post</span>
                              </div>
                            )}
                          </div>
                          
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowNewTopicDialog(false)}
                              className="border-gray-600 text-gray-400"
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="bg-vibe-neon text-black hover:bg-vibe-neon/90"
                              onClick={handleCreateTopic}
                              disabled={isPosting || !walletService.wallet || parseFloat(tokenBalance) < parseFloat(TOKEN_REQUIRED_TO_POST)}
                            >
                              {isPosting ? "Creating..." : "Create Topic"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="overflow-x-auto">
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-vibe-neon border-r-transparent"></div>
                          <p className="mt-2 text-gray-400">Loading forum topics...</p>
                        </div>
                      ) : filteredTopics.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-400">No topics found</p>
                          {searchQuery && (
                            <p className="mt-2 text-gray-500">Try a different search term</p>
                          )}
                        </div>
                      ) : (
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
                                      <button 
                                        className="text-white hover:text-vibe-neon transition-colors text-left"
                                        onClick={() => handleViewTopic(topic.id)}
                                      >
                                        {topic.title}
                                      </button>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      By {topic.author?.slice(0, 6)}...{topic.author?.slice(-4)} • {topic.date}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-2 text-center text-gray-300 hidden md:table-cell">
                                  {topic.replies?.length || 0}
                                </td>
                                <td className="py-4 px-2 text-center text-gray-300 hidden md:table-cell">
                                  {topic.views || 0}
                                </td>
                                <td className="py-4 px-2 text-center text-gray-300 hidden md:table-cell">
                                  {topic.likes || 0}
                                </td>
                                <td className="py-4 px-2 text-right">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-vibe-blue hover:text-vibe-neon hover:bg-transparent"
                                    onClick={() => handleViewTopic(topic.id)}
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ) : (
                  // Single Topic View
                  <div className="card-chaos p-5 backdrop-blur-md">
                    <div className="flex justify-between items-start mb-4">
                      <Button 
                        variant="ghost" 
                        className="text-gray-400 hover:text-white mb-4"
                        onClick={handleBackToTopics}
                      >
                        ← Back to Topics
                      </Button>
                      
                      {activeTopic.isPinned && (
                        <span className="text-xs font-code bg-vibe-yellow/10 text-vibe-yellow px-2 py-1 rounded">
                          Pinned
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-vibe-neon mb-4">
                      <GlitchText text={activeTopic.title} intensity="low" />
                    </h2>
                    
                    <div className="bg-black/30 border border-vibe-neon/20 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-vibe-neon/20 border border-vibe-neon/40 flex items-center justify-center mr-2">
                            <span className="text-vibe-neon font-bold text-sm">
                              {activeTopic.author?.slice(0, 1).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-vibe-neon">
                              {activeTopic.author?.slice(0, 6)}...{activeTopic.author?.slice(-4)}
                            </div>
                            <div className="text-xs text-gray-400">Posted {activeTopic.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-vibe-neon"
                            onClick={() => handleLike(activeTopic.id, 'topic')}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-gray-300">
                        {activeTopic.content}
                      </div>
                    </div>
                    
                    {/* Replies */}
                    {activeTopic.replies && activeTopic.replies.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-vibe-blue mb-3">Replies</h3>
                        
                        {activeTopic.replies.map((reply, index) => (
                          <div key={reply.id} className="bg-black/30 border border-vibe-blue/20 rounded-lg p-4 mb-4 ml-8">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-vibe-blue/20 border border-vibe-blue/40 flex items-center justify-center mr-2">
                                  <span className="text-vibe-blue font-bold text-sm">
                                    {reply.author?.slice(0, 1).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-vibe-blue">
                                    {reply.author?.slice(0, 6)}...{reply.author?.slice(-4)}
                                  </div>
                                  <div className="text-xs text-gray-400">Posted {reply.date}</div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-gray-400 hover:text-vibe-neon"
                                  onClick={() => handleLike(reply.id, 'reply')}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="text-gray-300">
                              {reply.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply Form */}
                    <div className="bg-black/30 border border-vibe-neon/20 rounded-lg p-4">
                      <Textarea 
                        placeholder="Write your reply..." 
                        className="bg-black/50 border-vibe-neon/30 focus:border-vibe-neon mb-3"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      
                      {!walletService.wallet && (
                        <div className="flex items-center gap-2 text-vibe-yellow bg-vibe-yellow/10 p-2 rounded mb-3">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Connect your wallet to reply</span>
                        </div>
                      )}
                      
                      {walletService.wallet && parseFloat(tokenBalance) < parseFloat(TOKEN_REQUIRED_TO_REPLY) && (
                        <div className="flex items-center gap-2 text-vibe-yellow bg-vibe-yellow/10 p-2 rounded mb-3">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">You need at least {TOKEN_REQUIRED_TO_REPLY} {TOKEN_SYMBOL} to reply</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          Cost: {TOKEN_REQUIRED_TO_REPLY} {TOKEN_SYMBOL}
                        </div>
                        <Button 
                          className="border border-vibe-blue text-vibe-blue hover:bg-vibe-blue/20"
                          onClick={handlePostReply}
                          disabled={isPosting || !walletService.wallet || parseFloat(tokenBalance) < parseFloat(TOKEN_REQUIRED_TO_REPLY)}
                        >
                          <Reply className="mr-2 h-4 w-4" /> 
                          {isPosting ? "Posting..." : "Post Reply"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Background elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-vibe-blue/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-vibe-pink/20 rounded-full blur-3xl -z-10"></div>
        </section>
      </main>
      
      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="bg-black/90 border border-vibe-neon/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-vibe-neon">Connect Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">
              You need to connect your wallet to interact with the forum.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center my-4">
            <Button 
              className="bg-vibe-neon text-black hover:bg-vibe-neon/90"
              onClick={async () => {
                await walletService.connect();
                setShowAuthDialog(false);
                checkTokenBalance();
              }}
            >
              Connect Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForumsPage;
