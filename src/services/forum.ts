
import { toast } from 'sonner';
import uniswapService from './uniswap';

// Mock data until connected to a backend
const mockTopics = [
  {
    id: 1,
    title: "How to optimize gas fees when deploying vibe-coded contracts?",
    category: "vibe-coding",
    author: "0x67ab6782c3e438d57db0bac2c8a142f8eebF412",
    date: "2 hours ago",
    content: "I've been experimenting with deploying contracts using vibe coding principles, but the gas fees are killing me. Has anyone found some good tricks to optimize?\n\nI've tried a few things like:\n- Reducing storage variables where possible\n- Using bytes32 instead of strings\n- Avoiding loops in core functions\n\nBut I'm still seeing really high deployment costs. Any chaotic wisdom to share?",
    replies: [
      {
        id: 101,
        author: "0x45de1bb5e4f72abc39f285ae87a823",
        date: "1 hour ago",
        content: "Have you tried using assembly blocks for the gas-intensive operations? It's messy and chaotic, but it works! Also, consider breaking your contract into multiple smaller ones if you can. Deploy the core functionality first, then add features later.",
        likes: 3
      }
    ],
    views: 89,
    likes: 23,
    isPinned: true,
  },
  {
    id: 2,
    title: "Share your craziest vibe-coded projects that actually worked",
    category: "projects",
    author: "0x45de1bb5e4f72abc39f285ae87a823",
    date: "1 day ago",
    content: "Let's share some of the wildest, most chaotic vibe-coded projects that somehow actually worked! I'll start: I built a DEX that deliberately introduces small price fluctuations based on moon phases. Users actually love the unpredictability!",
    replies: [],
    views: 205,
    likes: 45,
    isHot: true,
  },
  {
    id: 3,
    title: "CDAO-5: Proposal to add multi-chain support for VIBE",
    category: "governance",
    author: "0x91fc239827a5b45de8921fdcb734",
    date: "3 days ago",
    content: "I'd like to propose that we extend VIBE token to support multiple chains beyond Base. This would allow for wider adoption and more chaotic possibilities. The implementation could leverage existing cross-chain bridges but add our own chaotic twist to the transfer mechanism.",
    replies: [],
    views: 127,
    likes: 31,
  },
  {
    id: 4,
    title: "Embracing glitches: How to debug vibe-coded smart contracts",
    category: "vibe-coding",
    author: "0x23ab902cd5e8f7af14523e567",
    date: "4 days ago",
    content: "Traditional debugging techniques don't work well with vibe-coded contracts. I've been experimenting with embracing the glitches rather than fighting them. Here's my approach: intentionally introduce glitches in test environments and observe how they propagate. This has helped me build more resilient mainnet contracts.",
    replies: [],
    views: 64,
    likes: 15,
  },
  {
    id: 5,
    title: "Show off your chaos-inspired UI designs",
    category: "projects",
    author: "0x78cd45a9e12fd82a9b12a123",
    date: "5 days ago",
    content: "I'm working on a new interface that embraces chaos theory in its design. Elements move slightly at random intervals, and color schemes shift based on transaction activity. It sounds confusing, but user testing shows it actually creates a more engaging experience! Anyone else experimenting with chaos in UI?",
    replies: [],
    views: 189,
    likes: 37,
  },
];

// In-memory storage (replace with backend calls later)
let topics = [...mockTopics];
let nextId = 6;
let nextReplyId = 102;

export class ForumService {
  // Get all topics
  static async getTopics() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...topics];
  }
  
  // Get a specific topic by ID
  static async getTopicById(id: number) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const topic = topics.find(t => t.id === id);
    
    if (!topic) {
      throw new Error("Topic not found");
    }
    
    // Increment view count
    const updatedTopic = { ...topic, views: (topic.views || 0) + 1 };
    topics = topics.map(t => t.id === id ? updatedTopic : t);
    
    return updatedTopic;
  }
  
  // Create a new topic
  static async createTopic(topicData: {
    title: string;
    content: string;
    category: string;
    author: string;
  }) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // First, attempt to "charge" BRETT tokens (simulation)
    try {
      const topicId = nextId++;
      const newTopic = {
        id: topicId,
        title: topicData.title,
        content: topicData.content,
        category: topicData.category,
        author: topicData.author,
        date: "Just now",
        replies: [],
        views: 1,
        likes: 0,
        isPinned: false,
        isHot: false
      };
      
      topics = [newTopic, ...topics];
      return newTopic;
    } catch (error) {
      console.error("Error creating topic:", error);
      throw new Error("Failed to create topic");
    }
  }
  
  // Post a reply to a topic
  static async postReply(topicId: number, content: string, author: string) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const topic = topics.find(t => t.id === topicId);
    if (!topic) {
      throw new Error("Topic not found");
    }
    
    // First, attempt to "charge" BRETT tokens (simulation)
    try {
      const replyId = nextReplyId++;
      const newReply = {
        id: replyId,
        content,
        author,
        date: "Just now",
        likes: 0
      };
      
      const updatedTopic = {
        ...topic,
        replies: [...(topic.replies || []), newReply]
      };
      
      topics = topics.map(t => t.id === topicId ? updatedTopic : t);
      return newReply;
    } catch (error) {
      console.error("Error posting reply:", error);
      throw new Error("Failed to post reply");
    }
  }
  
  // Like a topic
  static async likeTopic(topicId: number) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const topic = topics.find(t => t.id === topicId);
    if (!topic) {
      throw new Error("Topic not found");
    }
    
    const updatedTopic = {
      ...topic,
      likes: (topic.likes || 0) + 1
    };
    
    topics = topics.map(t => t.id === topicId ? updatedTopic : t);
    return updatedTopic;
  }
  
  // Like a reply
  static async likeReply(replyId: number) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let updatedTopic = null;
    
    topics = topics.map(topic => {
      if (!topic.replies) return topic;
      
      const replyIndex = topic.replies.findIndex(r => r.id === replyId);
      if (replyIndex === -1) return topic;
      
      const updatedReplies = [...topic.replies];
      updatedReplies[replyIndex] = {
        ...updatedReplies[replyIndex],
        likes: (updatedReplies[replyIndex].likes || 0) + 1
      };
      
      updatedTopic = {
        ...topic,
        replies: updatedReplies
      };
      
      return updatedTopic;
    });
    
    if (!updatedTopic) {
      throw new Error("Reply not found");
    }
    
    return updatedTopic;
  }
}
