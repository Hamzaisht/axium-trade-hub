
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { PREvent } from "./utils";

interface PREventsListProps {
  events?: PREvent[];
}

export const PREventsList = ({ events }: PREventsListProps) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-2 text-axium-gray-500 text-sm">
        No recent PR events detected
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.slice(0, 5).map(event => (
        <div 
          key={event.id} 
          className={cn(
            "p-2 text-xs rounded border",
            event.isPositive 
              ? "border-green-200 bg-green-50" 
              : "border-red-200 bg-red-50"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{event.headline}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant={event.impact === 'major' 
                      ? (event.isPositive ? "default" : "destructive") 
                      : "outline"
                    } 
                    className="ml-1 text-[10px]"
                  >
                    {event.impact}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Impact level: {event.impact}</p>
                  <p>Score: {event.sentimentScore}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-axium-gray-600">
            <span>{event.platform}</span>
            <span>{new Date(event.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PREventsList;
