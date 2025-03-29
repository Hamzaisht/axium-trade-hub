
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarbleAvatar from "@/components/home/MarbleAvatar";
import { cn } from "@/lib/utils";
import { ArrowRight, Play } from "lucide-react";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleScrollDown = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="bg-[#0B0F1A] text-white min-h-screen overflow-x-hidden">
      {/* Hero Section with 3D Avatar */}
      <section className={cn(
        "relative h-screen w-full flex items-center justify-center transition-opacity duration-1000",
        isLoaded ? "opacity-100" : "opacity-0"
      )}>
        <Navbar />
        
        {/* 3D Avatar Canvas */}
        <div className="absolute inset-0 z-0">
          <MarbleAvatar scrollPosition={scrolled ? 1 : 0} />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 px-6 sm:px-8 max-w-5xl mx-auto text-center sm:text-left flex flex-col sm:flex-row items-center gap-12">
          <div className="w-full sm:w-1/2 space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-balance">
              <span className="block gold-text">Trade</span> the Influence.
            </h1>
            <h2 className="text-xl md:text-2xl text-axium-gray-400 max-w-xl">
              Welcome to Axium — the new market for creators, where influence becomes a tradable asset.
            </h2>
            <div className="pt-4 flex flex-wrap gap-4 justify-center sm:justify-start">
              <Button 
                onClick={() => navigate('/creators/kol-superstar?demo=true')}
                className="bg-gradient-to-r from-[#D4AF37]/80 to-[#D4AF37]/60 text-black font-medium px-8 py-6 rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all group"
                size="lg"
              >
                Try Demo
                <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline"
                className="bg-transparent backdrop-blur-sm border-[#D4AF37]/30 text-white px-8 py-6 rounded-lg hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all"
                size="lg"
              >
                Login to Trade
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Space for the 3D avatar to be visible on the right side */}
          <div className="w-full sm:w-1/2 h-[400px] sm:h-[600px]"></div>
        </div>
        
        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce"
          onClick={handleScrollDown}
        >
          <div className="w-8 h-14 rounded-full border-2 border-white/30 flex justify-center items-start p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse-subtle"></div>
          </div>
        </div>
      </section>
      
      {/* Content Section (scrolls into view) */}
      <div ref={contentRef}>
        <LiveTicker />
        
        <section className="py-24 bg-[#0D1424]/80">
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
                  icon: "LineChart",
                  title: "Institutional-Grade Tools",
                  description: "Advanced charting, order types, and analytics used by professional traders"
                },
                {
                  icon: "TrendingUp",
                  title: "AI-Powered Insights",
                  description: "Proprietary algorithms analyze creator performance and market sentiment"
                },
                {
                  icon: "Shield",
                  title: "Secure & Compliant",
                  description: "Enterprise-level security with regulatory compliance built-in"
                },
                {
                  icon: "Users",
                  title: "Exclusive Access",
                  description: "Connect with top creators and get early access to emerging talent"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-[#0A0E17] border border-[#1A2747] rounded-lg p-6 hover:translate-y-[-4px] transition-transform duration-300"
                >
                  <div className="mb-4">
                    {feature.icon === "LineChart" && <LineChart className="h-10 w-10 text-[#3AA0FF]" />}
                    {feature.icon === "TrendingUp" && <TrendingUp className="h-10 w-10 text-[#3AA0FF]" />}
                    {feature.icon === "Shield" && <Shield className="h-10 w-10 text-[#3AA0FF]" />}
                    {feature.icon === "Users" && <Users className="h-10 w-10 text-[#3AA0FF]" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[#8A9CCC]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <Features />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
};

import { LineChart, TrendingUp, Shield, Users } from "lucide-react";
import LiveTicker from "@/components/home/LiveTicker";
import Features from "@/components/home/Features";
import FAQ from "@/components/home/FAQ";

export default Home;
