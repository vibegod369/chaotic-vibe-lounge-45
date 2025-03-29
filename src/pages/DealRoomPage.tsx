
import GlitchText from "@/components/GlitchText";
import DealRoom from "@/components/DealRoom";
import VibeContributor from "@/components/VibeContributor";

const DealRoomPage = () => {
  return (
    <main className="flex-grow pt-24">
      <section className="py-12 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <GlitchText text="DEAL ROOM" color="pink" />
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              The chaotic marketplace for projects seeking the Vibe Coded backing. 
              Vote for your favorite chaos and stake to show support.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Deal Room Projects */}
            <div className="w-full lg:w-2/3">
              <DealRoom />
            </div>
            
            {/* Vibe Contributor Dashboard */}
            <div className="w-full lg:w-1/3">
              <VibeContributor />
            </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-vibe-pink/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-vibe-blue/20 rounded-full blur-3xl -z-10"></div>
      </section>
    </main>
  );
};

export default DealRoomPage;
