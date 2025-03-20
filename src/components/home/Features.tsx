
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
  Chip
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
    icon: Chip,
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
    <section ref={sectionRef} className="section-padding bg-gradient-to-b from-white to-axium-gray-100/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 bg-axium-blue/10 text-axium-blue rounded-full text-sm font-medium mb-4">
            <Lightbulb className="w-4 h-4 mr-2" />
            Platform Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-axium-gray-900 mb-4">
            The most advanced <span className="text-gradient-blue">creator economy</span> platform
          </h2>
          <p className="text-axium-gray-600 max-w-2xl mx-auto text-lg">
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
                    "cursor-pointer transition-all duration-300 transform",
                    index === activeFeature ? "scale-105" : "scale-100 opacity-80",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                    `animation-delay-${index * 200}`
                  )}
                  onClick={() => setActiveFeature(index)}
                >
                  <GlassCard
                    variant={index === activeFeature ? "blue" : "default"}
                    className="h-full"
                  >
                    <div className="flex flex-col h-full">
                      <feature.icon className={cn(
                        "h-6 w-6 mb-4",
                        index === activeFeature ? "text-axium-blue" : "text-axium-gray-700"
                      )} />
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className={cn(
                        "text-sm leading-relaxed",
                        index === activeFeature ? "text-axium-blue/80" : "text-axium-gray-600"
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
              <div className="absolute inset-0 bg-gradient-radial from-axium-blue/10 to-transparent rounded-full" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <GlassCard 
                  variant="premium" 
                  size="xl"
                  className="w-[90%] h-[90%] shadow-glass-blue"
                >
                  <div className="h-full flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-axium-gray-800">
                        {features[activeFeature].title}
                      </h3>
                      <div className="w-16 h-1 bg-axium-blue rounded-full mt-2" />
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <ActiveFeatureIcon className="h-24 w-24 text-axium-blue/20" />
                    </div>
                    
                    <p className="text-axium-gray-600 mt-auto">
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
