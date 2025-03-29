export interface ChartDataPoint {
  timestamp: string;
  price: number;
  volume?: number;
}

export type TimeFrame = "1H" | "1D" | "1W" | "1M" | "3M" | "1Y";

const generateMockData = (
  timeframe: TimeFrame, 
  basePrice: number = 25.75,
  volatility: number = 0.02
): ChartDataPoint[] => {
  const now = new Date();
  const data: ChartDataPoint[] = [];
  let price = basePrice;
  
  let dataPoints = 0;
  let interval = 0;
  
  switch(timeframe) {
    case '1D':
      dataPoints = 24 * 6; // Every 10 minutes for a day
      interval = 10 * 60 * 1000; // 10 minutes in ms
      break;
    case '1W':
      dataPoints = 7 * 24; // Hourly for a week
      interval = 60 * 60 * 1000; // 1 hour in ms
      break;
    case '1M':
      dataPoints = 30; // Daily for a month
      interval = 24 * 60 * 60 * 1000; // 1 day in ms
      break;
    case '3M':
      dataPoints = 90; // Daily for 3 months
      interval = 24 * 60 * 60 * 1000; // 1 day in ms
      break;
    case '1Y':
      dataPoints = 52; // Weekly for a year
      interval = 7 * 24 * 60 * 60 * 1000; // 1 week in ms
      break;
  }
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * interval));
    const change = (Math.random() - 0.5) * volatility * price;
    price = Math.max(price + change, 0.01); // Ensure price doesn't go below 0.01
    
    const volume = Math.floor(Math.random() * 10000) + 5000;
    
    data.push({
      timestamp: date.toISOString(),
      price: parseFloat(price.toFixed(2)),
      volume
    });
  }
  
  return data;
};

export const getChartData = (
  creatorId: string, 
  timeframe: TimeFrame = '1D'
): Promise<ChartDataPoint[]> => {
  // In a real application, this would fetch data from an API
  // For now, we'll generate mock data based on the creator ID
  // to ensure consistency for the same creator
  
  const seed = creatorId.charCodeAt(0) % 10;
  const basePrice = 15 + seed * 2;
  const volatility = 0.01 + (seed * 0.005);
  
  return Promise.resolve(generateMockData(timeframe, basePrice, volatility));
};

// Pre-generated datasets for immediate use
export const mockChartData: Record<TimeFrame, ChartDataPoint[]> = {
  '1D': generateMockData('1D'),
  '1W': generateMockData('1W'),
  '1M': generateMockData('1M'),
  '3M': generateMockData('3M'),
  '1Y': generateMockData('1Y')
};
