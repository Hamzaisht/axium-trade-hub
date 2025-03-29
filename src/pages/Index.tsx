
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import LavaOracle from "@/components/home/LavaOracle";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [marketSpike, setMarketSpike] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
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
    
    // Hide overlay after a delay
    const overlayTimer = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(overlayTimer);
    };
  }, []);
  
  return (
    <div className={cn(
      "min-h-screen bg-[#0A0E1A] text-white transition-opacity duration-1000 relative overflow-hidden",
      isLoaded ? "opacity-100" : "opacity-0"
    )}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFDMjgiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoNjB2NjBIMzB6Ii8+PHBhdGggZD0iTTMwIDMwTDAgMGgzMHYzMHoiIGZpbGw9IiMxRjI5M0EiIGZpbGwtb3BhY2l0eT0iLjEiLz48cGF0aCBkPSJNMzAgMzBMMCA2MGgzMFYzMHoiIGZpbGw9IiMxRjI5M0EiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PHBhdGggZD0iTTMwIDMwbDMwIDMwSDMwVjMweiIgZmlsbD0iIzFGMjkzQSIgZmlsbC1vcGFjaXR5PSIuMDQiLz48cGF0aCBkPSJNMzAgMzBsMzAtMzBIMzB2MzB6IiBmaWxsPSIjMUYyOTNBIiBmaWxsLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-20 z-0"></div>
      
      {/* Entry animation overlay */}
      <div className={cn(
        "fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-1000",
        showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 relative">
            <div className="absolute inset-0 rounded-full border-4 border-[#38BDF8]/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-2 border-[#38BDF8]/60 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full border-b-4 border-[#FFD700] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#FFD700] font-bold text-2xl gold-text">A</span>
            </div>
          </div>
          <p className="mt-4 text-lg text-[#38BDF8] animate-pulse">AXIUM.IO</p>
        </div>
      </div>
      
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
              <div className="mb-6 flex items-center">
                <div className="h-10 w-1 bg-gradient-to-b from-[#FFD700] to-[#38BDF8] mr-3 rounded-full"></div>
                <h2 className="text-xl font-light tracking-widest text-[#38BDF8]">INDEX VIEW</h2>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-wide text-balance relative">
                <span className="gold-text">Next-Gen</span> Creator <br />Economy
                <div className="absolute -top-8 -right-8 text-[#FFD700] animate-pulse">
                  <Sparkles size={24} />
                </div>
              </h1>
              
              <p className="text-base sm:text-lg text-[#8A9CCC] mt-4 md:mt-6 max-w-xl tracking-wide text-balance leading-relaxed">
                Axium's AI-powered market is revolutionizing how creators monetize influence, turning online presence into tradable digital assets.
              </p>
              
              <div className="relative">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#38BDF8]/30 to-transparent my-8 relative">
                  <div className="absolute w-20 h-1 bg-gradient-to-r from-[#38BDF8] to-[#00FFD0] rounded-full -top-[2px] animate-pulse"></div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-gradient-to-r from-[#38BDF8] to-[#00FFD0] text-black hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] font-semibold transition-all px-6 py-6 h-auto group relative overflow-hidden"
                  onClick={() => navigate('/creators/kol-superstar?demo=true')}
                >
                  <span className="relative z-10 flex items-center">
                    Try Demo
                    <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#38BDF8] to-[#00FFD0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-[#38BDF8]/30 text-white hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]/70 transition-all px-6 py-6 h-auto backdrop-blur-sm"
                  onClick={() => navigate('/login')}
                >
                  <span className="flex items-center">
                    Login to Trade
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
              
              <div className="mt-12 pt-4 border-t border-[#1A2032] text-[#5A6A8A] text-sm">
                <p className="tracking-wide flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#00FFD0] mr-2 animate-pulse"></span>
                  Secured by advanced blockchain technology and AI valuation models
                </p>
              </div>
            </div>
            
            {/* Right Column - 3D Avatar */}
            <div className={cn(
              "relative h-full md:h-[90%] transition-all duration-1000 delay-500 transform",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}>
              <div className="w-full h-full relative">
                {/* Oracle container with glass effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden backdrop-blur-sm border border-[#38BDF8]/20 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFD0]/50 to-transparent"></div>
                </div>
                
                {/* Radial gradient background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_70%)]"></div>
                
                {/* 3D Lava Oracle */}
                <LavaOracle marketSpike={marketSpike} />
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce opacity-70">
            <div className="w-8 h-14 rounded-full border-2 border-[#38BDF8]/30 flex justify-center items-start p-2">
              <div className="w-1 h-3 bg-[#38BDF8]/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
