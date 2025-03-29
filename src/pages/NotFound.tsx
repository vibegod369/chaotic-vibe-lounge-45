
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GlitchText from "@/components/GlitchText";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex-grow flex items-center justify-center pt-20 pb-12">
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-6 text-vibe-pink">
          <GlitchText text="404" color="pink" intensity="high" />
        </h1>
        <p className="text-xl text-vibe-neon mb-8">CHAOS DETECTED: PAGE NOT FOUND</p>
        <div className="max-w-md mx-auto mb-8 p-4 border border-vibe-blue/30 bg-vibe-dark/50 rounded">
          <p className="text-gray-400 font-code text-sm">
            The void has consumed: <span className="text-vibe-yellow">{location.pathname}</span>
          </p>
        </div>
        <Button asChild className="button-chaos">
          <Link to="/">Return to Controlled Chaos</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
