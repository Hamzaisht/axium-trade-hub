
import { faker } from '@faker-js/faker';
import { delay } from './data';

// Portfolio type definition
export interface Portfolio {
  userId: string;
  holdings: Array<{
    ipoId: string;
    symbol: string;
    creatorName: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
  }>;
  totalValue: number;
  cash: number;
  invested: number;
  history: Array<{
    date: string;
    value: number;
  }>;
}

// Mock Portfolio API
export class MockPortfolioAPI {
  async getUserPortfolio(userId: string): Promise<Portfolio> {
    await delay(500);
    
    // Generate random holdings
    const holdingsCount = faker.number.int({ min: 3, max: 8 });
    const holdings = Array.from({ length: holdingsCount }, () => {
      const averagePrice = faker.number.float({ min: 5, max: 50, fractionDigits: 2 });
      const priceChange = faker.number.float({ min: -20, max: 30, fractionDigits: 2 });
      const currentPrice = averagePrice * (1 + priceChange / 100);
      const quantity = faker.number.int({ min: 10, max: 1000 });
      
      return {
        ipoId: faker.string.uuid(),
        symbol: faker.finance.currencyCode().substring(0, 3),
        creatorName: faker.person.fullName(),
        quantity,
        averagePrice,
        currentPrice
      };
    });
    
    // Calculate total invested and current value
    const invested = holdings.reduce((sum, holding) => sum + holding.quantity * holding.averagePrice, 0);
    const currentValue = holdings.reduce((sum, holding) => sum + holding.quantity * holding.currentPrice, 0);
    const cash = faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 });
    
    // Generate portfolio value history (30 days)
    const history = Array.from({ length: 30 }, (_, i) => {
      const daysAgo = 29 - i;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      // Add some randomness to historical values
      const dailyChange = faker.number.float({ min: -5, max: 5, fractionDigits: 2 });
      const factor = 1 + (dailyChange / 100);
      const value = i === 29 ? currentValue : currentValue * Math.pow(factor, daysAgo);
      
      return {
        date: date.toISOString().split('T')[0],
        value: parseFloat(value.toFixed(2))
      };
    });
    
    return {
      userId,
      holdings,
      totalValue: currentValue + cash,
      cash,
      invested,
      history
    };
  }
  
  async getPortfolioPerformance(userId: string, timeframe: 'day' | 'week' | 'month' | 'year' = 'month') {
    await delay(300);
    
    const dataPoints = {
      day: 24,
      week: 7,
      month: 30,
      year: 12
    }[timeframe];
    
    const labels = Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date();
      if (timeframe === 'day') {
        date.setHours(date.getHours() - (dataPoints - i - 1));
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe === 'week') {
        date.setDate(date.getDate() - (dataPoints - i - 1));
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (timeframe === 'month') {
        date.setDate(date.getDate() - (dataPoints - i - 1));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        date.setMonth(date.getMonth() - (dataPoints - i - 1));
        return date.toLocaleDateString('en-US', { month: 'short' });
      }
    });
    
    // Generate random performance data
    const startValue = faker.number.float({ min: 5000, max: 50000, fractionDigits: 2 });
    let currentValue = startValue;
    
    const values = Array.from({ length: dataPoints }, () => {
      const change = faker.number.float({ min: -5, max: 5, fractionDigits: 2 });
      currentValue = currentValue * (1 + change / 100);
      return parseFloat(currentValue.toFixed(2));
    });
    
    const benchmarkValues = Array.from({ length: dataPoints }, (_, i) => {
      const benchmarkChange = faker.number.float({ min: -3, max: 3, fractionDigits: 2 });
      return parseFloat((startValue * (1 + (benchmarkChange * i) / 100)).toFixed(2));
    });
    
    // Calculate changes
    const netChange = currentValue - startValue;
    const percentChange = (netChange / startValue) * 100;
    
    return {
      labels,
      datasets: [
        {
          label: 'Portfolio',
          data: values
        },
        {
          label: 'Benchmark',
          data: benchmarkValues
        }
      ],
      summary: {
        startValue,
        currentValue,
        netChange,
        percentChange
      }
    };
  }
}

export const mockPortfolioAPI = new MockPortfolioAPI();
