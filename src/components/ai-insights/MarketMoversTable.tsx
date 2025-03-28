
import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

interface MarketMover {
  factor: string;
  impact: number;
  description: string;
  timestamp: string;
}

interface MarketMoversTableProps {
  marketMovers: MarketMover[];
  className?: string;
}

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({
  marketMovers,
  className
}) => {
  return (
    <GlassCard className={`p-6 ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-4">Top Market Movers</h3>
      <div className="space-y-4 overflow-hidden">
        {marketMovers.slice(0, 5).map((mover, index) => (
          <div key={index} className="border-b border-axium-gray-200/50 last:border-b-0 pb-3 last:pb-0">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">{mover.factor}</div>
              <div className={`flex items-center ${mover.impact >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {mover.impact >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(mover.impact).toFixed(2)}%
              </div>
            </div>
            <p className="text-sm text-axium-gray-600 mb-1">{mover.description}</p>
            <div className="text-xs text-axium-gray-500">
              {formatDate(new Date(mover.timestamp))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
