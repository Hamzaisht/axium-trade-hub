
import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Sparkles, AlertCircle, InfoIcon, BarChart4 } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface AITrendPredictionProps {
  ipoId?: string;
  className?: string;
}

interface PredictionData {
  trend: 'up' | 'down' | 'neutral';
  confidence: number;
  volume: 'high' | 'medium' | 'low';
  timeframe: string;
  prediction: number;
  points: Array<{
    time: string;
    price: number;
    isPrediction?: boolean;
  }>;
  explanation: string;
}

export const AITrendPrediction = ({ ipoId, className }: AITrendPredictionProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  useEffect(() => {
    if (!ipoId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to get AI prediction
    setTimeout(() => {
      try {
        // Mock AI prediction data
        const mockPrediction: PredictionData = {
          trend: Math.random() > 0.5 ? 'up' : 'down',
          confidence: Math.floor(65 + Math.random() * 30), // Between 65-95%
          volume: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          timeframe: '24h',
          prediction: Math.floor(2500 + Math.random() * 1000) / 100, // Between $25-$35
          points: generatePredictionPoints(),
          explanation: "Based on recent social media sentiment analysis, market trends, and the creator's engagement metrics, the model predicts an upward movement. The creator has experienced a 15% increase in follower count in the last 30 days and launched a new content series that has been well-received."
        };
        
        setPrediction(mockPrediction);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    }, 1500);
  }, [ipoId]);
  
  // Generate mock prediction data points
  const generatePredictionPoints = () => {
    const points = [];
    const now = new Date();
    const basePrice = 30 + Math.random() * 10;
    const trend = Math.random() > 0.5 ? 1 : -1;
    const volatility = 0.5 + Math.random() * 0.5;
    
    // Historical data (past 24 hours)
    for (let i = 24; i >= 1; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const timeStr = `${time.getHours()}:00`;
      const priceVariation = trend * (Math.random() * volatility) * (i / 24);
      const price = basePrice + priceVariation;
      
      points.push({
        time: timeStr,
        price: parseFloat(price.toFixed(2))
      });
    }
    
    // Current price
    const currentPrice = points[points.length - 1].price +
      (trend * Math.random() * volatility);
    
    points.push({
      time: `${now.getHours()}:00`,
      price: parseFloat(currentPrice.toFixed(2))
    });
    
    // Prediction points (next 24 hours)
    const predictionTrend = Math.random() > 0.5 ? 1 : -1;
    const predictionVolatility = 0.3 + Math.random() * 0.7;
    
    for (let i = 1; i <= 24; i++) {
      const time = new Date(now.getTime() + (i * 60 * 60 * 1000));
      const timeStr = `${time.getHours()}:00`;
      const priceVariation = predictionTrend * (Math.random() * predictionVolatility) * (i / 12);
      const price = currentPrice + priceVariation;
      
      points.push({
        time: timeStr,
        price: parseFloat(price.toFixed(2)),
        isPrediction: true
      });
    }
    
    return points;
  };
  
  if (loading) {
    return (
      <GlassCard className={className}>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-7 w-20" />
          </div>
          <div className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </GlassCard>
    );
  }
  
  if (error) {
    return (
      <GlassCard className={className}>
        <div className="p-4">
          <div className="flex items-center text-red-500 mb-2">
            <AlertCircle className="h-5 w-5 mr-2" />
            <h3 className="font-medium">AI Prediction Error</h3>
          </div>
          <p className="text-axium-gray-600">We couldn't load AI predictions: {error.message}</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </GlassCard>
    );
  }
  
  if (!prediction) {
    return (
      <GlassCard className={className}>
        <div className="p-4">
          <div className="flex items-center text-axium-gray-500 mb-2">
            <InfoIcon className="h-5 w-5 mr-2" />
            <h3 className="font-medium">No Prediction Available</h3>
          </div>
          <p className="text-axium-gray-600">Select a creator to view AI price predictions.</p>
        </div>
      </GlassCard>
    );
  }
  
  // Calculate the cutoff index between historical and prediction data
  const currentIndex = prediction.points.findIndex(p => p.isPrediction) - 1;
  const currentPrice = prediction.points[currentIndex]?.price || 0;
  const predictionPrice = prediction.points[prediction.points.length - 1]?.price || 0;
  const priceDifference = predictionPrice - currentPrice;
  const percentChange = (priceDifference / currentPrice) * 100;
  
  return (
    <GlassCard className={className}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-axium-blue mr-2" />
            <h3 className="font-medium">AI Price Prediction</h3>
          </div>
          
          <Badge variant={prediction?.trend === 'up' ? 'success' : prediction?.trend === 'down' ? 'destructive' : 'outline'}>
            {prediction?.trend === 'up' ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : prediction?.trend === 'down' ? (
              <ArrowDown className="h-3 w-3 mr-1" />
            ) : null}
            {prediction?.timeframe} Forecast
          </Badge>
        </div>
        
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={prediction?.points}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                tickFormatter={(value) => value.split(':')[0]} 
                interval={4}
                style={{ fontSize: '10px' }}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']} 
                tickFormatter={(value) => `$${value}`}
                style={{ fontSize: '10px' }}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Price']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <ReferenceLine 
                x={prediction?.points[currentIndex]?.time} 
                stroke="rgba(59, 130, 246, 0.5)" 
                strokeDasharray="3 3"
                label={{ value: 'Now', position: 'insideTopLeft', style: { fontSize: 10 } }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey={(data) => data.isPrediction ? data.price : null} 
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <div>
            <h4 className="text-sm text-axium-gray-500">Predicted Price</h4>
            <p className="text-xl font-semibold">${predictionPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <h4 className="text-sm text-axium-gray-500">24h Change</h4>
            <p className={`text-xl font-semibold ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-axium-gray-100/50 p-2 rounded">
            <h4 className="text-xs text-axium-gray-500">Confidence</h4>
            <p className="font-medium">{prediction?.confidence}%</p>
          </div>
          <div className="bg-axium-gray-100/50 p-2 rounded">
            <h4 className="text-xs text-axium-gray-500">Trend</h4>
            <p className="font-medium capitalize">{prediction?.trend}</p>
          </div>
          <div className="bg-axium-gray-100/50 p-2 rounded">
            <h4 className="text-xs text-axium-gray-500">Volume</h4>
            <p className="font-medium capitalize">{prediction?.volume}</p>
          </div>
        </div>
        
        {showExplanation && (
          <div className="mt-4 p-3 bg-axium-blue/5 rounded-md text-sm text-axium-gray-700">
            <h4 className="font-medium text-axium-blue mb-1 flex items-center">
              <InfoIcon className="h-4 w-4 mr-1" /> Analysis Explanation
            </h4>
            <p>{prediction?.explanation}</p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? 'Hide explanation' : 'Show explanation'}
        </Button>
      </div>
    </GlassCard>
  );
};

export default AITrendPrediction;
