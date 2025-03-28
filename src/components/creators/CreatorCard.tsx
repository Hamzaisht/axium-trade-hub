
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IPO } from "@/utils/mockApi";
import { TrendingUp, TrendingDown, Eye } from "lucide-react";

interface CreatorCardProps {
  creator: IPO;
  compact?: boolean;
}

export const CreatorCard = ({ creator, compact = false }: CreatorCardProps) => {
  const navigate = useNavigate();
  
  const viewCreator = () => {
    navigate(`/creator/${creator.id}`);
  };
  
  const tradeCreator = () => {
    navigate(`/trading?ipo=${creator.id}`);
  };
  
  // Compact version (for dashboards, lists)
  if (compact) {
    return (
      <GlassCard className="flex flex-col h-full p-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-axium-blue/20 to-axium-blue/40 rounded-lg flex items-center justify-center text-axium-blue font-bold mr-3">
            {creator.creatorName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">{creator.creatorName}</h3>
            <Badge variant="outline" className="text-xs">${creator.symbol}</Badge>
          </div>
        </div>
        
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-lg font-semibold">${creator.currentPrice.toFixed(2)}</span>
          <span 
            className={`flex items-center text-xs ${creator.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {creator.priceChange >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(creator.priceChange).toFixed(2)}%
          </span>
        </div>
        
        <div className="mt-auto">
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={viewCreator}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            View Profile
          </Button>
        </div>
      </GlassCard>
    );
  }
  
  // Full version
  return (
    <GlassCard className="flex flex-col h-full">
      <div className="p-5">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-axium-blue/20 to-axium-blue/40 rounded-lg flex items-center justify-center text-axium-blue font-bold text-xl mr-3">
            {creator.creatorName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{creator.creatorName}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">${creator.symbol}</Badge>
              <Badge variant="secondary" className="bg-axium-gray-200">IPO: ${creator.initialPrice.toFixed(2)}</Badge>
            </div>
          </div>
        </div>
        
        <p className="text-axium-gray-600 text-sm mb-4 line-clamp-2">
          {creator.description || "No description available for this creator."}
        </p>
        
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-2xl font-semibold">${creator.currentPrice.toFixed(2)}</span>
          <span 
            className={`flex items-center ${creator.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {creator.priceChange >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(creator.priceChange).toFixed(2)}%
          </span>
        </div>
        
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-axium-gray-600">Engagement Score</span>
              <span>{creator.engagementScore}/100</span>
            </div>
            <Progress value={creator.engagementScore} className="h-1.5" />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-axium-gray-600">AI Valuation Score</span>
              <span>{creator.aiScore}/100</span>
            </div>
            <Progress value={creator.aiScore} className="h-1.5" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs mb-6">
          <div className="bg-axium-gray-100 rounded p-2">
            <span className="block text-axium-gray-600">Market Cap</span>
            <span className="font-semibold">${(creator.currentPrice * creator.totalShares).toLocaleString()}</span>
          </div>
          <div className="bg-axium-gray-100 rounded p-2">
            <span className="block text-axium-gray-600">Total Shares</span>
            <span className="font-semibold">{creator.totalShares.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto border-t border-axium-gray-200 p-4 flex gap-2">
        <Button 
          className="flex-1 bg-axium-blue hover:bg-axium-blue/90"
          onClick={tradeCreator}
        >
          Trade
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={viewCreator}
        >
          <Eye className="h-4 w-4 mr-2" />
          Profile
        </Button>
      </div>
    </GlassCard>
  );
};

export default CreatorCard;
