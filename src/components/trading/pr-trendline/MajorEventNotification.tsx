
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MajorEventNotificationProps {
  event: {
    isPositive: boolean;
    headline: string;
    timestamp: string;
  };
}

export const MajorEventNotification = ({ event }: MajorEventNotificationProps) => {
  if (!event) return null;

  return (
    <div className={cn(
      "mb-4 p-3 border rounded-lg",
      event.isPositive ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
    )}>
      <div className="flex items-start gap-2">
        <div className={cn(
          "mt-1 p-1 rounded-full",
          event.isPositive ? "bg-green-100" : "bg-red-100"
        )}>
          {event.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">
              {event.isPositive ? "Positive" : "Negative"} PR Event
            </h4>
            <Badge variant={event.isPositive ? "default" : "destructive"} className="text-[10px] py-0 h-4">
              Major Impact
            </Badge>
          </div>
          <p className="text-sm font-medium">{event.headline}</p>
          <p className="text-xs text-axium-gray-600 mt-1">
            {new Date(event.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MajorEventNotification;
