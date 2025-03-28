
// Mock data for trading application
import { IPO } from './mockApi';

// Helper function to simulate network delay
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Sample IPO data
export const mockIPOs: IPO[] = [
  {
    id: "1",
    symbol: "CRTV",
    creatorName: "Creative Studios",
    category: "Entertainment",
    currentPrice: 125.50,
    targetPrice: 150.00,
    priceChange: 5.2,
    description: "Leading digital content studio specializing in animation and visual effects.",
    launchDate: "2023-01-15",
    valuation: 25000000,
    volume: 15000,
    supply: 100000,
    website: "https://creativestudios.com",
    twitter: "https://twitter.com/creativestudios",
    discord: "https://discord.gg/creativestudios",
    telegram: "https://t.me/creativestudios",
    youtube: "https://youtube.com/creativestudios",
    instagram: "https://instagram.com/creativestudios",
    featured: true
  },
  {
    id: "2",
    symbol: "TECH",
    creatorName: "Tech Innovators",
    category: "Technology",
    currentPrice: 85.75,
    targetPrice: 110.00,
    priceChange: -2.3,
    description: "Innovative tech company focusing on AI and machine learning solutions.",
    launchDate: "2023-02-20",
    valuation: 18000000,
    volume: 12000,
    supply: 75000,
    website: "https://techinnovators.com",
    twitter: "https://twitter.com/techinnovators",
    discord: "https://discord.gg/techinnovators",
    telegram: "https://t.me/techinnovators",
    youtube: "https://youtube.com/techinnovators",
    instagram: "https://instagram.com/techinnovators",
    featured: false
  },
  {
    id: "3",
    symbol: "GAME",
    creatorName: "GameWorld Studios",
    category: "Gaming",
    currentPrice: 150.25,
    targetPrice: 175.00,
    priceChange: 8.7,
    description: "Award-winning game development studio creating immersive gaming experiences.",
    launchDate: "2023-03-10",
    valuation: 30000000,
    volume: 20000,
    supply: 120000,
    website: "https://gameworldstudios.com",
    twitter: "https://twitter.com/gameworldstudios",
    discord: "https://discord.gg/gameworldstudios",
    telegram: "https://t.me/gameworldstudios",
    youtube: "https://youtube.com/gameworldstudios",
    instagram: "https://instagram.com/gameworldstudios",
    featured: true
  }
];

// Mock orders for trading
export const mockOrders = [
  {
    id: "order1",
    ipoId: "1",
    userId: "user1",
    type: "buy",
    orderType: "limit",
    price: 120.00,
    quantity: 5,
    status: "open",
    timestamp: new Date().toISOString()
  },
  {
    id: "order2",
    ipoId: "1",
    userId: "user2",
    type: "sell",
    orderType: "limit",
    price: 130.00,
    quantity: 3,
    status: "open",
    timestamp: new Date().toISOString()
  }
];

// Mock trades for trading history
export const mockTrades = [
  {
    id: "trade1",
    ipoId: "1",
    buyerId: "user1",
    sellerId: "user3",
    price: 124.50,
    quantity: 2,
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "trade2",
    ipoId: "2",
    buyerId: "user2",
    sellerId: "user4",
    price: 85.00,
    quantity: 5,
    timestamp: new Date(Date.now() - 7200000).toISOString()
  }
];
