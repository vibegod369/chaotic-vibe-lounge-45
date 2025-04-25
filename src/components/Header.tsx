import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MenuIcon, XIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';
import GlitchText from './GlitchText';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Whitepaper', path: '/whitepaper' },
    { name: 'DAO', path: '/dao' },
    { name: 'Deal Room', path: '/deal-room' },
    { name: 'VibeDEX', path: '/vibe-dex' },
    { name: 'Forums', path: '/forums' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-vibe-dark/80 backdrop-blur-md py-4 border-b border-vibe-neon/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold tracking-tighter">
              <GlitchText text="VIBE" color="neon" />
              <span className="text-vibe-pink">DAO</span>
            </div>
          </Link>

          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={`text-sm ${
                    isActive(item.path)
                      ? 'text-vibe-neon bg-vibe-neon/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
          )}

          <div className="flex items-center space-x-2">
            <ConnectWallet />

            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <XIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {isMobile && isMenuOpen && (
          <nav className="md:hidden mt-4 py-2 space-y-1 border-t border-vibe-neon/10">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`w-full justify-start text-sm ${
                  isActive(item.path)
                    ? 'text-vibe-neon bg-vibe-neon/10'
                    : 'text-gray-400'
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
