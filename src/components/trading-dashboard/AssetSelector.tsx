
import { useState } from "react";
import { IPO } from "@/utils/mockApi";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Search,
  ChevronLeft,
  ChevronRight, 
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AssetSelectorProps {
  ipos: IPO[];
  selectedIPO: IPO | null;
  onSelectIPO: (ipoId: string) => void;
  className?: string;
}

export const AssetSelector = ({ 
  ipos, 
  selectedIPO, 
  onSelectIPO, 
  className 
}: AssetSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  
  if (!ipos || ipos.length === 0 || !selectedIPO) {
    return null;
  }

  // Extract unique categories
  const categories = Array.from(new Set(ipos.map(ipo => ipo.category || "Other")));
  
  // Filter IPOs by search term and category
  const filteredIPOs = ipos.filter(ipo => {
    const matchesSearch = searchTerm === "" || 
      ipo.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ipo.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === null || ipo.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort by current price (highest first)
  const sortedIPOs = [...filteredIPOs].sort((a, b) => b.currentPrice - a.currentPrice);

  return (
    <GlassCard className={cn("mb-4", className)}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <h3 className="text-sm font-semibold">Creator Assets</h3>
            <Badge variant="outline" className="ml-2 text-[10px]">
              {ipos.length} Available
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", showFavorites && "text-yellow-500")}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <Star className="h-4 w-4" />
            </Button>
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-axium-gray-500" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assets..."
                className="h-7 pl-7 pr-2 text-xs w-[160px]"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex items-center space-x-1 mb-3 overflow-x-auto scrollbar-none pb-1">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="h-6 px-2 text-xs whitespace-nowrap"
          >
            All Assets
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-6 px-2 text-xs whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Assets list */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 bg-white/80 dark:bg-axium-gray-800/80 z-10 rounded-full shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="overflow-x-auto scrollbar-none">
            <div className="flex space-x-2 py-1 px-4">
              {sortedIPOs.map((ipo) => {
                const isPositive = ipo.priceChange >= 0;
                
                return (
                  <Button
                    key={ipo.id}
                    variant={selectedIPO?.id === ipo.id ? "default" : "outline"}
                    className={cn(
                      "flex-shrink-0 h-auto px-3 py-2",
                      selectedIPO?.id === ipo.id 
                        ? "bg-axium-blue text-white dark:bg-axium-blue dark:text-white" 
                        : "border-axium-gray-200 dark:border-axium-gray-700"
                    )}
                    onClick={() => onSelectIPO(ipo.id)}
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <span className="font-medium">{ipo.symbol}</span>
                        {ipo.category && (
                          <span className="ml-1.5 text-[10px] px-1 py-0 rounded bg-axium-gray-200/80 dark:bg-axium-gray-700/80 text-axium-gray-700 dark:text-axium-gray-300">
                            {ipo.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs font-mono mr-1.5">${ipo.currentPrice.toFixed(2)}</span>
                        <div 
                          className={cn(
                            "flex items-center text-[10px] px-1 rounded",
                            isPositive 
                              ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" 
                              : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                          )}
                        >
                          {isPositive ? (
                            <TrendingUp size={8} className="mr-0.5" />
                          ) : (
                            <TrendingDown size={8} className="mr-0.5" />
                          )}
                          {Math.abs(ipo.priceChange).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 bg-white/80 dark:bg-axium-gray-800/80 z-10 rounded-full shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default AssetSelector;
