
import { useState } from 'react';
import { ExternalLinkIcon, ThumbsUpIcon, XIcon, ClockIcon, ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import GlitchText from './GlitchText';

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  team: string;
  demoUrl: string;
  links: {
    website?: string;
    github?: string;
    twitter?: string;
  };
  votes: {
    stake: number;
    pass: number;
    tooEarly: number;
    share: number;
  };
}

interface ProjectCardProps {
  project: ProjectData;
  className?: string;
}

const ProjectCard = ({ project, className }: ProjectCardProps) => {
  const [hovered, setHovered] = useState(false);
  const [glitching, setGlitching] = useState(false);
  
  const randomGlitch = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 300);
  };

  const handleVote = (voteType: keyof typeof project.votes) => {
    randomGlitch();
    toast.success(`Voted "${voteType}" for ${project.name}`, {
      position: "bottom-right",
    });
  };
  
  const handleShare = () => {
    randomGlitch();
    toast.success("Sharing option activated", {
      description: "You can now introduce this project to a potential backer",
      position: "bottom-right",
    });
  };

  const totalVotes = Object.values(project.votes).reduce((sum, count) => sum + count, 0);

  return (
    <div 
      className={cn(
        "card-chaos rounded-lg transition-all duration-300 overflow-hidden",
        glitching && "animate-shake",
        hovered && "z-10 scale-[1.02]",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">
            <GlitchText text={project.name} intensity="low" color={hovered ? "neon" : "default"} />
          </h3>
          <a 
            href={project.demoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-vibe-blue hover:text-vibe-neon transition-colors"
          >
            <ExternalLinkIcon size={16} />
          </a>
        </div>
        
        <p className="text-sm text-gray-300 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="text-xs text-gray-400 mb-4">
          <p><span className="text-vibe-yellow">Team:</span> {project.team}</p>
        </div>
        
        <div className="grid grid-cols-4 gap-1 mb-4">
          <div className="col-span-1 bg-black/30 rounded px-2 py-1 text-center">
            <div className="text-xs text-gray-400">Stake</div>
            <div className="text-sm font-bold text-vibe-neon">{project.votes.stake}</div>
          </div>
          <div className="col-span-1 bg-black/30 rounded px-2 py-1 text-center">
            <div className="text-xs text-gray-400">Pass</div>
            <div className="text-sm font-bold text-vibe-pink">{project.votes.pass}</div>
          </div>
          <div className="col-span-1 bg-black/30 rounded px-2 py-1 text-center">
            <div className="text-xs text-gray-400">Early</div>
            <div className="text-sm font-bold text-vibe-yellow">{project.votes.tooEarly}</div>
          </div>
          <div className="col-span-1 bg-black/30 rounded px-2 py-1 text-center">
            <div className="text-xs text-gray-400">Share</div>
            <div className="text-sm font-bold text-vibe-blue">{project.votes.share}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-vibe-neon text-vibe-neon hover:bg-vibe-neon/20"
            onClick={() => handleVote('stake')}
          >
            <ThumbsUpIcon size={14} className="mr-1" /> Stake
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-vibe-pink text-vibe-pink hover:bg-vibe-pink/20"
            onClick={() => handleVote('pass')}
          >
            <XIcon size={14} className="mr-1" /> Pass
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-vibe-yellow text-vibe-yellow hover:bg-vibe-yellow/20"
            onClick={() => handleVote('tooEarly')}
          >
            <ClockIcon size={14} className="mr-1" /> Too Early
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-vibe-blue text-vibe-blue hover:bg-vibe-blue/20"
            onClick={handleShare}
          >
            <ShareIcon size={14} className="mr-1" /> Share
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "h-1 w-full bg-gray-800",
        hovered && "bg-gradient-to-r from-vibe-neon via-vibe-blue to-vibe-pink animate-pulse"
      )}></div>
    </div>
  );
};

export default ProjectCard;
