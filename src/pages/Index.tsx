
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import LiveTicker from "@/components/home/LiveTicker";
import Features from "@/components/home/Features";
import FAQ from "@/components/home/FAQ";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    // Add a small delay to ensure smooth animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={cn(
      "min-h-screen transition-opacity duration-500 bg-background text-foreground",
      isLoaded ? "opacity-100" : "opacity-0"
    )}>
      <Navbar />
      
      <main>
        <Hero />
        
        <LiveTicker />
        
        <Features />
        
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to invest in the creator economy?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of investors already trading on Axium.io and discover 
              the future of influencer investments.
            </p>
            <Button 
              size="lg" 
              className={cn(
                "hover:bg-opacity-90 font-medium rounded-2xl backdrop-blur-md",
                isDark ? "bg-white text-background border border-white/10" 
                      : "bg-white text-primary border border-zinc-200"
              )}
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
}

export default Index;
