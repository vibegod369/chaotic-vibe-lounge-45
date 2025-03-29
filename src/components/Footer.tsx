
import { Link } from 'react-router-dom';
import { GithubIcon, TwitterIcon, ExternalLinkIcon } from 'lucide-react';
import GlitchText from './GlitchText';

const Footer = () => {
  return (
    <footer className="relative border-t border-vibe-pink/30 py-10 overflow-hidden noise-bg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-vibe-neon/10 border-2 border-vibe-neon flex items-center justify-center mr-2">
                <span className="text-vibe-neon font-glitch font-bold">V</span>
              </div>
              <h2 className="text-lg font-bold">
                <GlitchText text="VIBE CODED CAOS" intensity="low" />
              </h2>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Embrace the chaos. Launch with $VIBE. A celebration of the raw, unfiltered spirit of blockchain innovation.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-vibe-neon transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-vibe-blue transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-vibe-pink transition-colors"
                aria-label="Website"
              >
                <ExternalLinkIcon size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-vibe-yellow">Ecosystem</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-neon transition-colors">
                  Vibe DEX
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-neon transition-colors">
                  Deal Room
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-neon transition-colors">
                  Chaos DAO
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-neon transition-colors">
                  Forums
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-neon transition-colors">
                  Launch Token
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-vibe-pink">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-pink transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-pink transition-colors">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-pink transition-colors">
                  Technical Overview
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-pink transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-vibe-pink transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-vibe-pink/20 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Vibe Coded Caos DAO. All rights reserved. Use at your own risk.
          </p>
          <div className="mt-2 text-xs text-gray-600 font-code">
            Contract: 0x5Ca1Ab1E70603Be5B3c063C3AD8E5f19E2822575
          </div>
        </div>
      </div>
      
      {/* Chaotic elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-vibe-pink/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-vibe-blue/10 rounded-full blur-3xl"></div>
    </footer>
  );
};

export default Footer;
