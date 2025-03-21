
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercentage } from './utils';

interface SocialPlatform {
  platform: string;
  isRealData: boolean;
  growth: number;
  followers: number;
  engagement: number;
  posts: number;
}

interface SocialTabProps {
  social: SocialPlatform[];
}

export const SocialTab = ({ social }: SocialTabProps) => {
  if (social.length === 0) {
    return (
      <div className="py-6 text-center text-axium-gray-500">
        <p>No social media data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {social.map((platform, index) => (
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
              <p className="text-axium-gray-600">Followers</p>
              <p className="font-semibold">{formatNumber(platform.followers)}</p>
            </div>
            <div>
              <p className="text-axium-gray-600">Engagement</p>
              <p className="font-semibold">{formatPercentage(platform.engagement)}</p>
            </div>
            <div>
              <p className="text-axium-gray-600">Posts</p>
              <p className="font-semibold">{platform.posts}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
