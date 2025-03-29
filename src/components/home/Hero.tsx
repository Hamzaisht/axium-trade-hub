
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, TrendingUp, Shield, BarChart3, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const scrollToContent = () => {
    if (scrollRef.current) {
      window.scrollTo({
        top: scrollRef.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section className="min-h-[90vh] flex items-center pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(0,80,255,0.05)_0%,transparent_50%)] opacity-70 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(11,15,26,0.5)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(11,15,26,0.5)_1.5px,transparent_1.5px)] bg-[size:40px_40px] opacity-10 pointer-events-none z-0"></div>
      
      {/* Ambient glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-axium-blue/10 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-axium-neon-blue/10 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={cn(
            "transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="inline-flex items-center px-3 py-1 bg-axium-blue/10 text-axium-neon-blue rounded-full text-sm font-medium mb-6 animate-pulse-subtle">
              <TrendingUp className="w-4 h-4 mr-2" />
              Revolutionizing Creator Economy
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Trade <span className="text-gradient-neon">Creator Tokens</span> Powered by AI Valuation
            </h1>
            <p className="text-lg md:text-xl text-axium-gray-300 mb-8 max-w-xl leading-relaxed">
              Axium.io transforms creator influence into tradable assets. 
              Invest in your favorite creators and watch your portfolio grow with their success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-axium-blue hover:bg-axium-blue/90 font-medium text-white glow-hover">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-axium-gray-600 text-axium-gray-300 hover:bg-axium-gray-800/50 font-medium">
                Explore Creators
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4 max-w-lg">
              <div className="flex items-center gap-3">
                <div className="bg-axium-blue/20 p-2 rounded-full animate-pulse-subtle">
                  <BarChart3 className="h-5 w-5 text-axium-neon-blue" />
                </div>
                <p className="text-axium-gray-300 font-medium">AI-Powered Valuations</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-axium-blue/20 p-2 rounded-full animate-pulse-subtle">
                  <Shield className="h-5 w-5 text-axium-neon-blue" />
                </div>
                <p className="text-axium-gray-300 font-medium">Secure Blockchain</p>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "relative transition-all duration-700 delay-300 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-conic from-axium-blue/10 via-transparent to-axium-blue-light/5 rounded-full animate-spin-slow [animation-duration:20s] opacity-70" />
              
              <GlassCard 
                variant="blue" 
                size="lg" 
                className="absolute top-[5%] left-[10%] h-52 w-64 animate-float terminal-card neon-border"
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="bg-axium-blue/20 text-axium-neon-blue text-xs font-semibold px-2 py-1 rounded">
                        TRENDING
                      </div>
                      <TrendingUp className="h-4 w-4 text-axium-success" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">Emma Watson</h3>
                    <p className="text-axium-gray-400 text-sm">$EMW</p>
                  </div>
                  
                  <div>
                    <div className="h-16 bg-gradient-to-r from-axium-blue/10 to-axium-neon-blue/5 rounded-md mb-3"></div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-axium-gray-400">Current Value</p>
                        <p className="font-semibold text-lg text-white">$24.82</p>
                      </div>
                      <div className="bg-axium-success/20 text-axium-success text-xs font-medium px-2 py-1 rounded">
                        +12.5%
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard 
                variant="blue" 
                size="lg" 
                className="absolute bottom-[15%] right-[5%] h-56 w-64 animation-delay-200 animate-float terminal-card"
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="bg-axium-neon-blue/20 text-axium-neon-teal text-xs font-semibold px-2 py-1 rounded">
                        CREATOR IPO
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg text-white">Zendaya</h3>
                    <p className="text-axium-gray-400 text-sm">$ZEN</p>
                  </div>
                  
                  <div>
                    <div className="h-16 bg-axium-blue/10 rounded-md mb-3"></div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-axium-gray-400">Initial Price</p>
                        <p className="font-semibold text-lg text-white">$18.40</p>
                      </div>
                      <Button size="sm" className="bg-axium-blue text-white hover:bg-axium-blue/90 px-3 glow-hover">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard 
                variant="default" 
                size="md" 
                className="absolute bottom-[10%] left-[5%] h-32 w-52 animation-delay-400 animate-float terminal-card"
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">Portfolio Value</h3>
                  </div>
                  <div>
                    <p className="font-semibold text-2xl text-white">$142,580</p>
                    <p className="text-axium-success text-sm font-medium">+8.3% Today</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button onClick={scrollToContent} className="text-axium-gray-300 hover:text-white transition-colors">
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </div>
      
      <div ref={scrollRef} className="absolute bottom-0 left-0 w-full h-4"></div>
    </section>
  );
};

export default Hero;
