
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Scatter
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { normalizeSentimentScore } from './utils';

interface ChartDataPoint {
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

interface PRTrendlineChartProps {
  trendlineData: ChartDataPoint[];
  eventPoints: EventPoint[];
}

export const PRTrendlineChart = ({ trendlineData, eventPoints }: PRTrendlineChartProps) => {
  if (trendlineData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-axium-gray-500">
        No PR trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={trendlineData}
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
      >
        <XAxis 
          dataKey="date"
          tick={{ fontSize: 10 }}
          tickLine={false}
        />
        <YAxis 
          domain={[0, 100]} 
          tick={{ fontSize: 10 }}
          tickLine={false}
          width={25}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={50} stroke="#888" strokeDasharray="3 3">
          <Label value="Neutral" position="insideLeft" fontSize={10} />
        </ReferenceLine>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 5 }}
        />
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

export default PRTrendlineChart;
