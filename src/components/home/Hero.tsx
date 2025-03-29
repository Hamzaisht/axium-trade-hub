
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Cyberpunk Background Elements */}
      <div className="absolute inset-0 z-0 dark:bg-[radial-gradient(ellipse_at_top_right,rgba(0,207,255,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 z-0 dark:bg-[radial-gradient(circle_at_bottom_left,rgba(0,255,208,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 z-0 dark:cyberpunk-grid"></div>
      
      {/* Animated Glowing Lines */}
      <div className="absolute top-20 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-axium-neon-blue/30 to-transparent z-0"></div>
      <div className="absolute bottom-20 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-axium-neon-mint/30 to-transparent z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="inline-flex items-center px-3 py-1 bg-axium-neon-blue/10 text-axium-neon-blue rounded-full text-sm font-medium mb-6 border border-axium-neon-blue/20 shadow-neon-blue">
              <TrendingUp className="w-4 h-4 mr-2" />
              Creator Economy Revolution
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block relative">
                <span className="text-gradient-blue cyber-flicker">Trade Creator Tokens</span>
                <span className="absolute -bottom-2 left-0 w-1/2 h-[2px] bg-gradient-to-r from-axium-neon-blue via-axium-neon-mint to-transparent"></span>
              </span>
              <span className="text-foreground mt-2 block">Powered by AI Valuation</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Axium.io transforms creator influence into tradable assets. 
              Invest in your favorite creators and watch your portfolio grow with their success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="group bg-axium-neon-blue hover:bg-axium-neon-blue/90 text-black dark:text-black font-medium hover-glow-blue"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-axium-neon-mint/50 text-axium-neon-mint hover:bg-axium-neon-mint/10 hover:text-axium-neon-mint font-medium hover-glow-mint"
              >
                Explore Creators
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4 max-w-lg">
              <div className="flex items-center gap-3 bg-foreground/5 backdrop-blur-sm p-3 rounded-lg border border-axium-neon-blue/10">
                <div className="bg-axium-neon-blue/10 p-2 rounded-full">
                  <BarChart3 className="h-5 w-5 text-axium-neon-blue" />
                </div>
                <p className="text-foreground/80 font-medium">AI-Powered Valuations</p>
              </div>
              <div className="flex items-center gap-3 bg-foreground/5 backdrop-blur-sm p-3 rounded-lg border border-axium-neon-mint/10">
                <div className="bg-axium-neon-mint/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-axium-neon-mint" />
                </div>
                <p className="text-foreground/80 font-medium">Secure Blockchain</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-conic from-axium-neon-blue/10 via-transparent to-axium-neon-mint/5 rounded-full animate-spin-slow [animation-duration:20s] opacity-70"></div>
              
              {/* Trading Card - Emma Watson */}
              <div className="absolute top-[5%] left-[10%] w-64 cyber-panel animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-axium-neon-blue/20 to-transparent opacity-40"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-axium-neon-blue/70 to-transparent"></div>
                <div className="relative p-5 z-10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="bg-axium-neon-blue/10 text-axium-neon-blue text-xs font-semibold px-2 py-1 rounded border border-axium-neon-blue/30">
                      TRENDING
                    </div>
                    <TrendingUp className="h-4 w-4 text-axium-success" />
                  </div>
                  <h3 className="font-semibold text-lg text-white">Emma Watson</h3>
                  <p className="text-axium-neon-blue text-sm">$EMW</p>
                  
                  <div className="h-16 bg-gradient-to-r from-axium-neon-blue/5 to-axium-neon-blue/10 rounded-md my-3"></div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-axium-gray-400">Current Value</p>
                      <p className="font-semibold text-lg text-white">$24.82</p>
                    </div>
                    <div className="bg-axium-success/10 text-axium-success text-xs font-medium px-2 py-1 rounded border border-axium-success/30">
                      +12.5%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Trading Card - Zendaya */}
              <div className="absolute bottom-[15%] right-[5%] w-64 cyber-panel animation-delay-200 animate-float">
                <div className="absolute inset-0 bg-gradient-to-l from-axium-neon-mint/20 to-transparent opacity-40"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-axium-neon-mint/70 to-transparent"></div>
                <div className="relative p-5 z-10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="bg-white/10 text-axium-neon-mint text-xs font-semibold px-2 py-1 rounded border border-axium-neon-mint/30">
                      CREATOR IPO
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-white">Zendaya</h3>
                  <p className="text-axium-neon-mint text-sm">$ZEN</p>
                  
                  <div className="h-16 bg-white/10 rounded-md my-3"></div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-axium-gray-400">Initial Price</p>
                      <p className="font-semibold text-lg text-white">$18.40</p>
                    </div>
                    <Button size="sm" className="bg-axium-neon-mint text-black hover:bg-axium-neon-mint/90 px-3 hover-glow-mint">
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Portfolio Value Card */}
              <div className="absolute bottom-[10%] left-[5%] w-52 cyber-panel animation-delay-400 animate-float">
                <div className="absolute inset-0 bg-gradient-to-t from-axium-neon-gold/20 to-transparent opacity-40"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-axium-neon-gold/70 to-transparent"></div>
                <div className="relative p-4 z-10">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">Portfolio Value</h3>
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-2xl text-white">$142,580</p>
                    <p className="text-axium-success text-sm font-medium flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.3% Today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
