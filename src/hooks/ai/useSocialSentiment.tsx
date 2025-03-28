
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface SocialSentimentData {
  overall: number; // 0-100 sentiment score
  positive: number; // Count of positive mentions
  negative: number; // Count of negative mentions
  neutral: number; // Count of neutral mentions
  sources: {
    twitter: number; // Twitter sentiment (0-100)
    instagram: number; // Instagram sentiment (0-100)
    tiktok: number; // TikTok sentiment (0-100)
    youtube: number; // YouTube sentiment (0-100)
    news: number; // News sentiment (0-100)
  };
  topics: Array<{
    topic: string;
    sentiment: number;
    volume: number;
  }>;
  history: Array<{
    date: string;
    sentiment: number;
  }>;
  lastUpdated: string;
}

interface UseSocialSentimentProps {
  ipoId?: string;
  enabled?: boolean;
}

export const useSocialSentiment = ({ ipoId, enabled = true }: UseSocialSentimentProps) => {
  // React Query for fetching sentiment data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['social-sentiment', ipoId],
    queryFn: async () => {
      if (!ipoId) return null;
      
      // For now, generate mock sentiment data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      const overall = 50 + Math.random() * 40; // 50-90 range
      
      return {
        overall,
        positive: Math.floor(5000 + Math.random() * 15000),
        negative: Math.floor(1000 + Math.random() * 5000),
        neutral: Math.floor(3000 + Math.random() * 10000),
        sources: {
          twitter: Math.floor(40 + Math.random() * 60),
          instagram: Math.floor(50 + Math.random() * 50),
          tiktok: Math.floor(60 + Math.random() * 40),
          youtube: Math.floor(45 + Math.random() * 55),
          news: Math.floor(30 + Math.random() * 70)
        },
        topics: [
          {
            topic: 'New Content',
            sentiment: Math.floor(60 + Math.random() * 40),
            volume: Math.floor(1000 + Math.random() * 5000)
          },
          {
            topic: 'Brand Deals',
            sentiment: Math.floor(50 + Math.random() * 40),
            volume: Math.floor(800 + Math.random() * 3000)
          },
          {
            topic: 'Personal Life',
            sentiment: Math.floor(40 + Math.random() * 50),
            volume: Math.floor(1200 + Math.random() * 4000)
          },
          {
            topic: 'Controversy',
            sentiment: Math.floor(20 + Math.random() * 40),
            volume: Math.floor(500 + Math.random() * 2000)
          },
          {
            topic: 'Collaborations',
            sentiment: Math.floor(70 + Math.random() * 30),
            volume: Math.floor(900 + Math.random() * 3500)
          }
        ],
        history: generateSentimentHistory(),
        lastUpdated: new Date().toISOString()
      };
    },
    enabled: !!ipoId && enabled,
    refetchInterval: enabled ? 30000 : false, // Refetch every 30 seconds if enabled
    staleTime: 20000
  });
  
  return {
    sentimentData: data as SocialSentimentData | null | undefined,
    isLoading,
    error,
    refetch
  };
};

// Helper function to generate sentiment history data
const generateSentimentHistory = () => {
  const history = [];
  const now = new Date();
  
  // Generate data for the last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate a sentiment value between 30 and 90 with some continuity
    const sentiment = Math.max(
      30,
      Math.min(
        90,
        50 + (Math.sin(i / 5) * 20) + (Math.random() * 10 - 5)
      )
    );
    
    history.push({
      date: date.toISOString(),
      sentiment: Math.floor(sentiment)
    });
  }
  
  return history;
};

export default useSocialSentiment;
