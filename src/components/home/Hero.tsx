
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MarbleAvatar from "./MarbleAvatar";

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="min-h-screen w-full flex items-center overflow-hidden bg-[#0B0F1A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Hero Text Column */}
          <div className={cn(
            "transition-all duration-700 transform backdrop-blur-sm",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Trade <span className="gold-text drop-shadow-lg">the Influence.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mt-6 max-w-xl leading-relaxed">
              Welcome to Axium — the new market for creators, where influence becomes a tradable asset.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#D4AF37] to-[#B08C28] text-black hover:bg-gradient-to-r hover:from-[#E5C048] hover:to-[#C19D39] font-medium shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
                onClick={() => window.location.href = '/creators/kol-superstar?demo=true'}
              >
                Try Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-zinc-500 text-white hover:bg-zinc-800 hover:border-zinc-300 transition-all"
                onClick={() => window.location.href = '/login'}
              >
                Login to Trade
              </Button>
            </div>
            
            <div className="mt-12 border-t border-zinc-800 pt-6">
              <p className="text-zinc-500 text-sm">Discover the future of influencer investments.</p>
              <p className="text-zinc-400 text-sm mt-1">Start trading on the most advanced platform for creator economy assets.</p>
            </div>
          </div>
          
          {/* 3D Avatar Column */}
          <div className={cn(
            "relative h-[70vh] transition-all duration-700 delay-300 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <MarbleAvatar />
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#D4AF37" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="opacity-80"
        >
          <path d="M12 5v14"></path>
          <path d="m19 12-7 7-7-7"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
