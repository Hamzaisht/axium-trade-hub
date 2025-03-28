
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPO } from "@/utils/mockApi";
import { useIPO } from "@/contexts/IPOContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { CreatorCard } from "@/components/creators/CreatorCard";

const CreatorsList = () => {
  const { ipos, isLoading } = useIPO();
  const [featuredCreators, setFeaturedCreators] = useState<(IPO & { priceChange: number })[]>([]);
  const navigate = useNavigate();

  // Select a few featured creators
  useEffect(() => {
    if (!isLoading && ipos.length > 0) {
      // Get some diverse creators for the featured list
      // Using initialPrice and currentPrice to calculate price change percentage
      const topPerformers = [...ipos]
        .map(ipo => ({
          ...ipo,
          priceChange: ((ipo.currentPrice - ipo.initialPrice) / ipo.initialPrice) * 100
        }))
        .sort((a, b) => b.priceChange - a.priceChange)
        .slice(0, 3);
      
      setFeaturedCreators(topPerformers);
    }
  }, [ipos, isLoading]);

  return (
    <GlassCard className="col-span-1 xl:col-span-3">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Featured Creators</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/creators")}
          >
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <p className="text-center text-axium-gray-500 py-12">Loading creators...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCreators.map(creator => (
              <CreatorCard key={creator.id} creator={creator} compact />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default CreatorsList;
