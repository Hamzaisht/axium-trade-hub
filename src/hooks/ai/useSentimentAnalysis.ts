
import { useState, useEffect } from 'react';

export interface CreatorSentimentData {
  overallSentiment: number;
  positiveMentions: number;
  negativeMentions: number;
  keywords: string[];
  lastUpdated: string;
}

interface UseSentimentAnalysisProps {
  creatorId?: string;
}

const useSentimentAnalysis = ({ creatorId }: UseSentimentAnalysisProps) => {
  const [sentimentData, setSentimentData] = useState<CreatorSentimentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!creatorId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      try {
        // Generate mock sentiment data
        // In a real app, this would be an API call to a sentiment analysis service
        const mockSentimentData: CreatorSentimentData = {
          overallSentiment: Math.floor(65 + Math.random() * 25), // 65-90
          positiveMentions: Math.floor(8000 + Math.random() * 10000),
          negativeMentions: Math.floor(1000 + Math.random() * 5000),
          keywords: [
            'trending', 'viral', 'growth', 'partnership', 'collaboration',
            'innovative', 'authentic', 'engaging'
          ],
          lastUpdated: new Date().toISOString()
        };
        
        setSentimentData(mockSentimentData);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [creatorId]);

  return {
    sentimentData,
    isLoading,
    error
  };
};

export default useSentimentAnalysis;
