
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const HoldingsTable = () => {
  const { portfolio, isLoading } = usePortfolio();
  const navigate = useNavigate();
  
  const handleViewCreator = (creatorId: string) => {
    navigate(`/creator/${creatorId}`);
  };
  
  const handleTradeCreator = (creatorId: string) => {
    navigate(`/trading?ipo=${creatorId}`);
  };
  
  if (isLoading) {
    return (
      <GlassCard>
        <div className="p-5">
          <div className="animate-pulse">
            <div className="h-8 bg-axium-gray-200 rounded mb-6 w-1/3"></div>
            <div className="h-60 bg-axium-gray-200 rounded"></div>
          </div>
        </div>
      </GlassCard>
    );
  }
  
  if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return (
      <GlassCard>
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-4">Your Holdings</h3>
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-axium-gray-600 mb-4">You don't have any holdings yet</p>
            <Button onClick={() => navigate('/creators')}>Explore Creators</Button>
          </div>
        </div>
      </GlassCard>
    );
  }
  
  return (
    <GlassCard>
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-6">Your Holdings</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-axium-gray-200">
                <th className="py-3 px-4 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Asset</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Shares</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Avg. Price</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Current Price</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Value</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Return</th>
                <th className="py-3 px-4 text-center text-xs font-medium text-axium-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-axium-gray-200">
              {portfolio.holdings.map((holding) => {
                const currentValue = holding.quantity * holding.currentPrice;
                const investedValue = holding.quantity * holding.averagePurchasePrice;
                const profit = currentValue - investedValue;
                const profitPercent = ((profit / investedValue) * 100).toFixed(2);
                
                return (
                  <tr key={holding.ipoId} className="hover:bg-axium-gray-50">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full mr-3 bg-axium-gray-200 overflow-hidden flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, #0050FF20, #0050FF50)` }}
                        >
                          {holding.creatorName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-axium-gray-900">{holding.creatorSymbol}</p>
                          <p className="text-sm text-axium-gray-500">{holding.creatorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-medium">{holding.quantity.toFixed(2)}</p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-medium">${holding.averagePurchasePrice.toFixed(2)}</p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <p className="font-medium">${holding.currentPrice.toFixed(2)}</p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <p className="font-medium">${currentValue.toFixed(2)}</p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className={cn(
                        "inline-flex items-center justify-end px-2.5 py-0.5 rounded-full text-xs font-medium",
                        parseFloat(profitPercent) >= 0 
                          ? "bg-green-50 text-green-500" 
                          : "bg-red-50 text-red-500"
                      )}>
                        {parseFloat(profitPercent) >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {parseFloat(profitPercent) >= 0 ? "+" : ""}{profitPercent}%
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewCreator(holding.ipoId)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-axium-blue hover:bg-axium-blue/90 text-white"
                          onClick={() => handleTradeCreator(holding.ipoId)}
                        >
                          Trade
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </GlassCard>
  );
};

export default HoldingsTable;
