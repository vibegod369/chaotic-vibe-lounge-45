
import React from 'react';
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  intensity?: 'low' | 'medium' | 'high';
  color?: 'default' | 'neon' | 'pink' | 'blue' | 'yellow';
}

const GlitchText = ({ 
  text, 
  className, 
  as: Component = 'span', 
  intensity = 'medium',
  color = 'default'
}: GlitchTextProps) => {
  const getColorClass = () => {
    switch(color) {
      case 'neon': return 'text-vibe-neon';
      case 'pink': return 'text-vibe-pink';
      case 'blue': return 'text-vibe-blue';
      case 'yellow': return 'text-vibe-yellow';
      default: return 'text-white';
    }
  };
  
  const getIntensityClass = () => {
    switch(intensity) {
      case 'low': return 'animate-[glitch_8s_infinite_ease-in-out]';
      case 'high': return 'animate-[glitch_1s_infinite_ease-in-out]';
      default: return 'animate-glitch';
    }
  };

  return (
    <Component 
      className={cn(
        "inline-block relative", 
        getColorClass(),
        getIntensityClass(),
        className
      )}
      data-text={text}
    >
      {text}
    </Component>
  );
};

export default GlitchText;
