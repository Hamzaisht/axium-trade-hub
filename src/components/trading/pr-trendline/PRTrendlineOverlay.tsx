
import { 
  LineChart, 
  Line, 
  ResponsiveContainer,
  ReferenceArea,
  Scatter
} from 'recharts';
import { PREvent } from '@/hooks/ai/usePREngine';

interface TrendlineDataPoint {
  date: string;
  value: number;
  fullDate: string;
  rawScore: number;
}

interface EventPoint {
  date: string;
  fullDate: string;
  eventValue: number;
  eventImpact: 'minor' | 'moderate' | 'major';
  eventHeadline: string;
  eventIsPositive: boolean;
  eventId: string;
  rawScore: number;
}

interface PRTrendlineOverlayProps {
  trendlineData: TrendlineDataPoint[];
  eventPoints: EventPoint[];
  prEvents?: PREvent[];
}

export const PRTrendlineOverlay = ({ trendlineData, eventPoints, prEvents }: PRTrendlineOverlayProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={trendlineData}
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
      >
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={false}
          name="PR Sentiment"
        />
        {/* Add reference areas for major events */}
        {prEvents?.filter(e => e.impact === 'major').map(event => (
          <ReferenceArea 
            key={event.id}
            x={new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
            y1={0}
            y2={100}
            stroke={event.isPositive ? "#10b981" : "#ef4444"}
            strokeOpacity={0.3}
            fillOpacity={0.1}
            fill={event.isPositive ? "#10b981" : "#ef4444"}
          />
        ))}
        {/* Add a scatter plot for PR events */}
        <Scatter 
          data={eventPoints}
          dataKey="eventValue"
          fill="#ff7300"
          shape={(props: any) => {
            const { cx, cy } = props;
            const { eventImpact, eventIsPositive } = props.payload;
            
            // Determine size based on impact
            let size = 4;
            if (eventImpact === 'moderate') size = 6;
            if (eventImpact === 'major') size = 8;
            
            // Determine color based on sentiment
            const color = eventIsPositive ? "#10b981" : "#ef4444";
            
            return (
              <circle 
                cx={cx} 
                cy={cy} 
                r={size} 
                fill={color} 
                stroke="#fff"
                strokeWidth={1}
              />
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PRTrendlineOverlay;
