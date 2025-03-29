
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="min-h-[90vh] flex items-center pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-axium-blue/5 to-transparent opacity-40 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={cn(
            "transition-all duration-700 transform backdrop-blur-sm rounded-2xl p-8",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="inline-flex items-center px-3 py-1 bg-axium-neon-blue/10 text-axium-neon-blue rounded-full text-sm font-medium mb-6 backdrop-blur-md">
              <TrendingUp className="w-4 h-4 mr-2" />
              Revolutionary Trading Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Trade <span className="text-gradient-blue">Creator Tokens</span> Powered by AI Valuation
            </h1>
            <p className="text-lg md:text-xl text-[#8A9CCC] mb-8 max-w-xl leading-relaxed">
              Axium.io transforms creator influence into tradable assets. 
              Invest in your favorite creators and watch your portfolio grow with their success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-axium-neon-blue hover:bg-axium-neon-blue/90 font-medium text-white">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-[#1A2747] text-[#8A9CCC] hover:bg-[#1A2747]/50 hover:text-white backdrop-blur-md">
                Explore Creators
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4 max-w-lg">
              <div className="flex items-center gap-3">
                <div className="bg-axium-neon-blue/10 p-2 rounded-full">
                  <BarChart3 className="h-5 w-5 text-axium-neon-blue" />
                </div>
                <p className="text-white font-medium">AI-Powered Valuations</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-axium-neon-blue/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-axium-neon-blue" />
                </div>
                <p className="text-white font-medium">Secure Blockchain</p>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "relative transition-all duration-700 delay-300 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-conic from-axium-neon-blue/10 via-transparent to-purple-500/5 rounded-full animate-spin-slow [animation-duration:20s] opacity-70" />
              
              <GlassCard 
                variant="premium" 
                size="lg" 
                className="absolute top-[5%] left-[10%] h-52 w-64 animate-float backdrop-blur-xl bg-black/30 border border-white/10"
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="bg-axium-neon-blue/20 text-axium-neon-blue text-xs font-semibold px-2 py-1 rounded">
                        TRENDING
                      </div>
                      <TrendingUp className="h-4 w-4 text-axium-success" />
                    </div>
                    <h3 className="font-semibold text-lg">Emma Watson</h3>
                    <p className="text-[#8A9CCC] text-sm">$EMW</p>
                  </div>
                  
                  <div>
                    <div className="h-16 bg-gradient-to-r from-axium-neon-blue/5 to-axium-neon-blue/10 rounded-md mb-3"></div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-[#8A9CCC]">Current Value</p>
                        <p className="font-semibold text-lg">$24.82</p>
                      </div>
                      <div className="bg-axium-success/10 text-axium-success text-xs font-medium px-2 py-1 rounded">
                        +12.5%
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard 
                variant="blue" 
                size="lg" 
                className="absolute bottom-[15%] right-[5%] h-56 w-64 animation-delay-200 animate-float backdrop-blur-xl bg-axium-neon-blue/10 border border-axium-neon-blue/20"
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded">
                        CREATOR IPO
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg">Zendaya</h3>
                    <p className="text-white/70 text-sm">$ZEN</p>
                  </div>
                  
                  <div>
                    <div className="h-16 bg-white/10 rounded-md mb-3"></div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-white/70">Initial Price</p>
                        <p className="font-semibold text-lg">$18.40</p>
                      </div>
                      <Button size="sm" className="bg-white text-axium-neon-blue hover:bg-white/90 px-3">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard 
                variant="default" 
                size="md" 
                className="absolute bottom-[10%] left-[5%] h-32 w-52 animation-delay-400 animate-float backdrop-blur-xl bg-black/20 border border-white/10"
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Portfolio Value</h3>
                  </div>
                  <div>
                    <p className="font-semibold text-2xl">$142,580</p>
                    <p className="text-axium-success text-sm font-medium">+8.3% Today</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
