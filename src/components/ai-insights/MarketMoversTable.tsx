
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface MarketMover {
  id: string;
  name: string;
  change: number;
  price: number;
}

export interface MarketMoversTableProps {
  marketMovers: MarketMover[];
  onSelectCreator: (creatorId: string) => void;
}

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({ 
  marketMovers, 
  onSelectCreator 
}) => {
  // Sort movers by absolute change
  const sortedMovers = [...marketMovers].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  return (
    <div className="overflow-hidden">
      <div className="space-y-1">
        {sortedMovers.map((mover) => (
          <div 
            key={mover.id} 
            className="flex items-center justify-between p-2 rounded-md hover:bg-axium-gray-100 dark:hover:bg-axium-gray-800 cursor-pointer transition-colors"
            onClick={() => onSelectCreator(mover.id)}
          >
            <div className="flex items-center">
              <div className={`w-1.5 h-8 rounded-sm mr-2 ${mover.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <div className="font-medium text-sm">{mover.name}</div>
                <div className="text-xs text-axium-gray-600 dark:text-axium-gray-400">${mover.price.toFixed(2)}</div>
              </div>
            </div>
            <Badge 
              className={`flex items-center ${
                mover.change >= 0 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {mover.change >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {mover.change >= 0 ? '+' : ''}{mover.change.toFixed(1)}%
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketMoversTable;
