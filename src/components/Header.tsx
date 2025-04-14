
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, TwitterIcon, DiscIcon, GithubIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import ConnectWallet from './ConnectWallet';
import GlitchText from './GlitchText';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const socialLinks = [
    { name: 'Twitter', icon: <TwitterIcon className="h-4 w-4" />, url: 'https://twitter.com/' },
    { name: 'Discord', icon: <DiscIcon className="h-4 w-4" />, url: 'https://discord.gg/' },
    { name: 'GitHub', icon: <GithubIcon className="h-4 w-4" />, url: 'https://github.com/' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrollPosition > 50 
          ? "py-2 backdrop-blur-xl bg-black/70 border-b border-vibe-pink/20" 
          : "py-4 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-vibe-neon/10 border-2 border-vibe-neon flex items-center justify-center mr-2">
              <span className="text-vibe-neon font-glitch font-bold text-xl">V</span>
            </div>
            <div className="glitch-container">
              <h1 className="text-xl font-bold font-glitch">
                <GlitchText text="VIBE CODED CHAOS" intensity="low" />
              </h1>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-1 mr-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-vibe-neon transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <ConnectWallet />
            </div>
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden text-vibe-neon border border-vibe-neon/30"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>
      
      <div 
        className={cn(
          "fixed inset-0 bg-black/90 backdrop-blur-lg z-40 transition-transform duration-300 pt-20",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
          "md:hidden"
        )}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-6">
          <div className="flex justify-center space-x-4 py-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-gray-400 hover:text-vibe-neon transition-colors"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
          
          <div className="pt-4 flex flex-col space-y-3">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
