
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import ConnectWallet from './ConnectWallet';
import GlitchText from './GlitchText';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Vibe DEX', path: '#' },
    { name: 'Deal Room', path: '#' },
    { name: 'DAO', path: '#' },
    { name: 'Forums', path: '#' },
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
                <GlitchText text="VIBE CODED CAOS" intensity="low" />
              </h1>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className="px-3 py-2 text-sm font-medium relative overflow-hidden group"
              >
                <span className="relative z-10 group-hover:text-vibe-neon transition-colors">
                  {link.name}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-vibe-neon group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            <ConnectWallet />
          </nav>
          
          {/* Mobile Navigation */}
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
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/90 backdrop-blur-lg z-40 transition-transform duration-300 pt-20",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
          "md:hidden"
        )}
      >
        <nav className="container mx-auto px-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className="px-4 py-3 text-lg font-medium border-b border-vibe-neon/20 hover:bg-vibe-neon/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4">
            <ConnectWallet />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
