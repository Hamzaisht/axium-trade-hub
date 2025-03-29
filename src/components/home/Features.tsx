
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Shield, Activity, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const FEATURES = [
  {
    icon: BarChart3,
    title: "AI-Powered Valuations",
    description: "Our proprietary AI models analyze social metrics, engagement rates, and market trends to determine accurate creator token valuations.",
    color: "blue"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Trading",
    description: "Execute trades instantly with minimal slippage on our high-performance exchange designed specifically for creator assets.",
    color: "mint"
  },
  {
    icon: Shield,
    title: "Secure Blockchain",
    description: "All transactions are secured by advanced blockchain technology, ensuring transparency and immutability of ownership records.",
    color: "gold"
  },
  {
    icon: Activity,
    title: "Market Analytics",
    description: "Access detailed market insights, historical data, and performance metrics to make informed investment decisions.",
    color: "magenta"
  },
  {
    icon: Zap,
    title: "Creator IPOs",
    description: "Launch creator tokens with customizable parameters and initial valuation, with full control over token distribution.",
    color: "blue"
  }
];

export const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      {isDark && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,207,255,0.05),transparent_70%)]"></div>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-axium-neon-blue/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-axium-neon-mint/20 to-transparent"></div>
        </>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-axium-neon-blue via-axium-neon-mint to-axium-neon-blue bg-clip-text text-transparent">
              Revolutionary
            </span> Trading Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Axium.io combines cutting-edge technology with financial innovation to create the ultimate creator economy trading platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="cyber-panel cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient overlay based on feature color */}
              <div className={`absolute inset-0 opacity-30 bg-gradient-to-br ${
                feature.color === 'blue' ? 'from-axium-neon-blue/20' :
                feature.color === 'mint' ? 'from-axium-neon-mint/20' :
                feature.color === 'gold' ? 'from-axium-neon-gold/20' :
                'from-axium-neon-magenta/20'
              } to-transparent transition-opacity duration-300 ${
                hoveredIndex === index ? 'opacity-50' : 'opacity-30'
              }`}></div>
              
              {/* Top border */}
              <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${
                feature.color === 'blue' ? 'via-axium-neon-blue/70' :
                feature.color === 'mint' ? 'via-axium-neon-mint/70' :
                feature.color === 'gold' ? 'via-axium-neon-gold/70' :
                'via-axium-neon-magenta/70'
              } to-transparent`}></div>
              
              <div className="relative p-6 z-10">
                <div className={`rounded-full p-3 inline-block mb-4 ${
                  feature.color === 'blue' ? 'bg-axium-neon-blue/10 text-axium-neon-blue' :
                  feature.color === 'mint' ? 'bg-axium-neon-mint/10 text-axium-neon-mint' :
                  feature.color === 'gold' ? 'bg-axium-neon-gold/10 text-axium-neon-gold' :
                  'bg-axium-neon-magenta/10 text-axium-neon-magenta'
                }`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                
                <div className={`flex items-center text-sm font-medium transition-transform duration-300 ${
                  hoveredIndex === index ? 'translate-x-2' : ''
                } ${
                  feature.color === 'blue' ? 'text-axium-neon-blue' :
                  feature.color === 'mint' ? 'text-axium-neon-mint' :
                  feature.color === 'gold' ? 'text-axium-neon-gold' :
                  'text-axium-neon-magenta'
                }`}>
                  <span>Learn more</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-background border border-axium-neon-blue text-axium-neon-blue hover:bg-axium-neon-blue/10 hover-glow-blue"
          >
            Explore All Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
