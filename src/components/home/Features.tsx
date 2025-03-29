
import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShieldCheck,
  Lightbulb, 
  Sparkles,
  Cpu
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Creator IPO System",
    description: "Celebrities and influencers launch their own tradable CLC tokens with customizable parameters and initial valuation."
  },
  {
    icon: Sparkles,
    title: "AI-Powered Valuation",
    description: "Tokens are priced using real-time social media engagement, streaming data, and brand partnerships."
  },
  {
    icon: BarChart3,
    title: "Live Trading Marketplace",
    description: "Invest in creators with advanced order types including limit, market, and stop-loss orders."
  },
  {
    icon: ShieldCheck,
    title: "Smart Contract Integration",
    description: "All transactions are secured through blockchain technology on Ethereum Layer 2 or Solana."
  },
  {
    icon: Users,
    title: "Portfolio Management",
    description: "Track your investments with real-time analytics, custom watchlists, and price alerts."
  },
  {
    icon: Cpu,
    title: "Advanced Analytics",
    description: "Access sentiment analysis and predictive models to make informed investment decisions."
  }
];

export const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Get the current feature's icon component
  const ActiveFeatureIcon = features[activeFeature].icon;
  
  return (
    <section ref={sectionRef} className="section-padding bg-axium-dark-bg relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(11,15,26,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(11,15,26,0.5)_1px,transparent_1px)] bg-[size:30px_30px] opacity-10 pointer-events-none z-0"></div>
      
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-axium-neon-purple/5 rounded-full blur-[150px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-axium-neon-blue/5 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      
      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-axium-blue/10 text-axium-neon-blue rounded-full text-sm font-medium mb-4 animate-pulse-subtle">
            <Lightbulb className="w-4 h-4 mr-2" />
            Platform Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The most advanced <span className="text-gradient-neon">creator economy</span> platform
          </h2>
          <p className="text-axium-gray-300 max-w-2xl mx-auto text-lg">
            Our AI-powered platform combines financial technology with the creator economy 
            to revolutionize how fans invest in their favorite celebrities and influencers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className={cn(
                    "cursor-pointer transition-all duration-500 transform",
                    index === activeFeature ? "scale-105" : "scale-100 opacity-80",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                    `animation-delay-${index * 200}`
                  )}
                  onClick={() => setActiveFeature(index)}
                >
                  <GlassCard
                    variant={index === activeFeature ? "blue" : "default"}
                    className={cn(
                      "h-full terminal-card",
                      index === activeFeature && "neon-border"
                    )}
                  >
                    <div className="flex flex-col h-full">
                      <feature.icon className={cn(
                        "h-6 w-6 mb-4",
                        index === activeFeature ? "text-axium-neon-blue animate-pulse-subtle" : "text-axium-gray-300"
                      )} />
                      <h3 className={cn(
                        "text-lg font-semibold mb-2",
                        index === activeFeature ? "text-white" : "text-axium-gray-200"
                      )}>
                        {feature.title}
                      </h3>
                      <p className={cn(
                        "text-sm leading-relaxed",
                        index === activeFeature ? "text-axium-gray-300" : "text-axium-gray-400"
                      )}>
                        {feature.description}
                      </p>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
          
          <div className={cn(
            "order-1 lg:order-2 transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Radial glow effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,174,219,0.1)_0%,transparent_70%)] rounded-full animate-pulse-subtle"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <GlassCard 
                  variant="premium" 
                  size="xl"
                  className="w-[90%] h-[90%] terminal-card neon-border"
                >
                  <div className="h-full flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-white">
                        {features[activeFeature].title}
                      </h3>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-axium-neon-blue to-transparent rounded-full mt-2" />
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <ActiveFeatureIcon className="h-24 w-24 text-axium-neon-blue/20 animate-float" />
                    </div>
                    
                    <p className="text-axium-gray-300 mt-auto">
                      {features[activeFeature].description}
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
