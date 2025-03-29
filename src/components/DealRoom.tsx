
import { useState } from 'react';
import { SearchIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProjectCard, { ProjectData } from './ProjectCard';
import GlitchText from './GlitchText';

const mockProjects: ProjectData[] = [
  {
    id: "1",
    name: "MetaVerse DAO",
    description: "A decentralized metaverse platform built on Ethereum that allows users to create, own, and monetize virtual assets and experiences.",
    team: "Crypto Pioneers",
    demoUrl: "#",
    links: {
      website: "#",
      github: "#",
      twitter: "#"
    },
    votes: {
      stake: 45,
      pass: 12,
      tooEarly: 8,
      share: 23
    }
  },
  {
    id: "2",
    name: "DeFi Pulse",
    description: "A DeFi aggregator that optimizes yields across multiple protocols and chains, providing the best returns for liquidity providers.",
    team: "YieldMaximizers",
    demoUrl: "#",
    links: {
      website: "#",
      github: "#"
    },
    votes: {
      stake: 67,
      pass: 5,
      tooEarly: 3,
      share: 34
    }
  },
  {
    id: "3",
    name: "NFTverse",
    description: "A platform for creating, trading, and displaying NFTs with built-in royalty distribution and cross-chain compatibility.",
    team: "NFT Collective",
    demoUrl: "#",
    links: {
      website: "#",
      twitter: "#"
    },
    votes: {
      stake: 29,
      pass: 18,
      tooEarly: 15,
      share: 10
    }
  },
  {
    id: "4",
    name: "ChainBridge",
    description: "A cross-chain solution enabling seamless asset transfer between Ethereum, Binance Smart Chain, Polygon, and other EVM-compatible networks.",
    team: "Bridge Builders",
    demoUrl: "#",
    links: {
      website: "#",
      github: "#"
    },
    votes: {
      stake: 38,
      pass: 9,
      tooEarly: 22,
      share: 17
    }
  }
];

const DealRoom = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof ProjectData["votes"]>("stake");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  const sortedProjects = [...mockProjects].sort((a, b) => {
    const valueA = a.votes[sortBy];
    const valueB = b.votes[sortBy];
    return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
  });

  const filteredProjects = sortedProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          <GlitchText text="Deal Room" color="neon" />
        </h2>
        <p className="text-gray-400">Discover and vote on upcoming vibe-coded projects.</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/30 border-vibe-blue/30 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`border-vibe-neon/50 ${sortBy === 'stake' ? 'bg-vibe-neon/20 text-vibe-neon' : 'text-gray-400'}`}
            onClick={() => setSortBy('stake')}
          >
            Stake
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-vibe-pink/50 ${sortBy === 'pass' ? 'bg-vibe-pink/20 text-vibe-pink' : 'text-gray-400'}`}
            onClick={() => setSortBy('pass')}
          >
            Pass
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-vibe-yellow/50 ${sortBy === 'tooEarly' ? 'bg-vibe-yellow/20 text-vibe-yellow' : 'text-gray-400'}`}
            onClick={() => setSortBy('tooEarly')}
          >
            Too Early
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-vibe-blue/50 ${sortBy === 'share' ? 'bg-vibe-blue/20 text-vibe-blue' : 'text-gray-400'}`}
            onClick={() => setSortBy('share')}
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-white/30"
            onClick={toggleSortDirection}
          >
            {sortDirection === "desc" ? <ArrowDownIcon size={16} /> : <ArrowUpIcon size={16} />}
          </Button>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">No projects found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              className={`transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DealRoom;
