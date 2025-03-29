
import { getSentimentColor, getSentimentLabel } from "./utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="font-medium">{label}</p>
        <p className={getSentimentColor(data.rawScore)}>
          Sentiment: {getSentimentLabel(data.rawScore)}
        </p>
        <p className="text-sm">Raw Score: {data.rawScore}</p>
      </div>
    );
  }
  
  return null;
};

export default CustomTooltip;
