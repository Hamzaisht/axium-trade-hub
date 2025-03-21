
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercentage } from './utils';

interface StreamingPlatform {
  platform: string;
  isRealData: boolean;
  growth: number;
  listeners: number;
  streams: number;
  avgStreamTime: number;
  popularity: number;
}

interface StreamingTabProps {
  streaming: StreamingPlatform[];
}

export const StreamingTab = ({ streaming }: StreamingTabProps) => {
  if (streaming.length === 0) {
    return (
      <div className="py-6 text-center text-axium-gray-500">
        <p>No streaming data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {streaming.map((platform, index) => (
        <div key={`${platform.platform}-${index}`} className="bg-white/50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium flex items-center">
              {platform.platform}
              {platform.isRealData && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                  Real
                </span>
              )}
            </div>
            <div className="flex items-center">
              <TrendingUp className={cn(
                "h-4 w-4 mr-1",
                platform.growth > 0 ? "text-green-500" : "text-red-500"
              )} />
              <span className={cn(
                platform.growth > 0 ? "text-green-500" : "text-red-500"
              )}>
                {formatPercentage(platform.growth)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-axium-gray-600">Listeners</p>
              <p className="font-semibold">{formatNumber(platform.listeners)}</p>
            </div>
            <div>
              <p className="text-axium-gray-600">Streams</p>
              <p className="font-semibold">{formatNumber(platform.streams)}</p>
            </div>
            <div>
              <p className="text-axium-gray-600">Avg Time</p>
              <p className="font-semibold">{platform.avgStreamTime.toFixed(0)}s</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
