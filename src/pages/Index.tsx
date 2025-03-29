import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import LiveTicker from "@/components/home/LiveTicker";
import Features from "@/components/home/Features";
import FAQ from "@/components/home/FAQ";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
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
      <div className="relative z-10">
        <Navbar />
        
        <main>
          <Hero />
          
          <LiveTicker />
          
          <Features />
          
          <FAQ />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
