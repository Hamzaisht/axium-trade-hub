
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import LavaOracle from "@/components/home/LavaOracle";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [marketSpike, setMarketSpike] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for marketSpike parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasMarketSpike = urlParams.get('marketSpike') === 'true';
    setMarketSpike(hasMarketSpike);
    
    // Trigger load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={cn(
      "min-h-screen bg-[#0B0F1A] text-white transition-opacity duration-1000",
      isLoaded ? "opacity-100" : "opacity-0"
    )}>
      <div className="relative h-screen w-full overflow-hidden">
        <Navbar />
        
        <main className="h-[calc(100vh-80px)] w-full">
          {/* Hero Section with Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full px-8 md:px-16 lg:px-24">
            {/* Left Column - Hero Text */}
            <div className={cn(
              "flex flex-col justify-center z-10 transition-all duration-700 delay-300 transform",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-wide text-balance">
                <span className="gold-text">Trade</span> the Influence.
              </h1>
              
              <p className="text-base sm:text-lg text-zinc-400 mt-4 md:mt-6 max-w-xl tracking-wide text-balance">
                Axium is the first AI-powered market where creators become tradable.
              </p>
              
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-gradient-to-r from-axium-gold to-[#D4AF37] text-black hover:bg-gradient-to-r hover:from-[#FFE14D] hover:to-[#D4AF37] font-semibold shadow-lg hover:shadow-gold-glow transition-all px-6 py-6 h-auto"
                  onClick={() => navigate('/creators/kol-superstar?demo=true')}
                >
                  Try Demo
                  <Play className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-zinc-600 text-white hover:bg-zinc-800 hover:border-zinc-300 transition-all px-6 py-6 h-auto"
                  onClick={() => navigate('/login')}
                >
                  Login to Trade
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-12 pt-4 border-t border-zinc-800/50 text-zinc-500 text-sm">
                <p className="tracking-wide">Trade influencers, artists, and public figures safely and securely on the blockchain.</p>
              </div>
            </div>
            
            {/* Right Column - 3D Avatar */}
            <div className={cn(
              "relative h-full md:h-[90%] transition-all duration-1000 delay-500 transform",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}>
              <div className="w-full h-full relative">
                {/* Radial gradient background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1),transparent_70%)]"></div>
                
                {/* 3D Lava Oracle */}
                <LavaOracle marketSpike={marketSpike} />
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce opacity-70">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#FFD700" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14"></path>
              <path d="m19 12-7 7-7-7"></path>
            </svg>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
