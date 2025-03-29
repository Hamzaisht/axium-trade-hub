
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import LiveTicker from "@/components/home/LiveTicker";
import Features from "@/components/home/Features";
import FAQ from "@/components/home/FAQ";
import PremiumBackground from "@/components/home/PremiumBackground";
import AnimatedCubeExample from "@/components/home/AnimatedCubeExample";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight, ExternalLink, LineChart, Shield, Star, TrendingUp, Users } from "lucide-react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Add a small delay to ensure smooth animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={cn(
      "min-h-screen bg-[#0A0E17] text-white transition-opacity duration-500",
      isLoaded ? "opacity-100" : "opacity-0"
    )}>
      {/* The premium background needs to be the first component so it appears behind everything */}
      <PremiumBackground />
      
      <Navbar />
      
      <main>
        <Hero />
        
        <LiveTicker />
        
        <section className="py-24 bg-[#0D1424]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Trade on Axium?</h2>
              <p className="text-[#8A9CCC] text-lg max-w-2xl mx-auto">
                The most advanced platform for investing in the creator economy
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <LineChart className="h-10 w-10 text-[#3AA0FF]" />,
                  title: "Institutional-Grade Tools",
                  description: "Advanced charting, order types, and analytics used by professional traders"
                },
                {
                  icon: <TrendingUp className="h-10 w-10 text-[#3AA0FF]" />,
                  title: "AI-Powered Insights",
                  description: "Proprietary algorithms analyze creator performance and market sentiment"
                },
                {
                  icon: <Shield className="h-10 w-10 text-[#3AA0FF]" />,
                  title: "Secure & Compliant",
                  description: "Enterprise-level security with regulatory compliance built-in"
                },
                {
                  icon: <Users className="h-10 w-10 text-[#3AA0FF]" />,
                  title: "Exclusive Access",
                  description: "Connect with top creators and get early access to emerging talent"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-[#0A0E17] border border-[#1A2747] rounded-lg p-6 hover:translate-y-[-4px] transition-transform duration-300">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[#8A9CCC]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <AnimatedCubeExample />
        
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/bg-dots.svg')] bg-center opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Built for the Professional Creator Investor
                </h2>
                <p className="text-[#8A9CCC] text-lg mb-8">
                  Axium delivers institutional-grade trading tools reimagined for the creator economy.
                  From real-time market data to advanced order types, we've built the Bloomberg Terminal
                  for creator investing.
                </p>
                <ul className="space-y-4">
                  {[
                    "Real-time price feeds and order book depth",
                    "Advanced order types including TWAP, VWAP and iceberg orders",
                    "Proprietary AI valuation models for creator price discovery",
                    "Institutional liquidity pools with cross-chain settlement",
                    "Comprehensive creator analytics and sentiment analysis"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#3AA0FF]/20 flex items-center justify-center mr-3 mt-0.5">
                        <Star className="h-3 w-3 text-[#3AA0FF]" />
                      </div>
                      <span className="text-[#8A9CCC]">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Button className="bg-[#3AA0FF] hover:bg-[#2D7DD2] text-white">
                    View All Features
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#3AA0FF]/20 to-purple-500/20 rounded-lg blur opacity-30"></div>
                <div className="relative border border-[#1A2747] rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/terminal-preview.png" 
                    alt="Axium Trading Terminal" 
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x800/0A0E17/3AA0FF?text=Axium+Terminal';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-gradient-to-b from-[#0D1424] to-[#0A0E17] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to invest in the creator economy?
            </h2>
            <p className="text-[#8A9CCC] text-lg max-w-2xl mx-auto mb-8">
              Join thousands of investors already trading on Axium.io and discover 
              the future of influencer investments.
            </p>
            <Button 
              size="lg" 
              className="bg-[#3AA0FF] hover:bg-[#2D7DD2] text-white font-medium"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
        
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
