
import { toast } from "sonner";

// Types for our mock API data
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'creator';
  profileImage?: string;
  walletAddress?: string;
  kycVerified: boolean;
}

export interface IPO {
  id: string;
  creatorId: string;
  creatorName: string;
  symbol: string;
  initialPrice: number;
  currentPrice: number;
  totalSupply: number;
  availableSupply: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  description: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  engagementScore: number;
  aiScore: number;
}

export interface Order {
  id: string;
  userId: string;
  ipoId: string;
  creatorSymbol: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  price: number;
  quantity: number;
  status: 'open' | 'filled' | 'canceled';
  createdAt: string;
}

export interface Trade {
  id: string;
  buyerId: string;
  sellerId: string;
  ipoId: string;
  creatorSymbol: string;
  price: number;
  quantity: number;
  timestamp: string;
}

export interface Portfolio {
  userId: string;
  totalValue: number;
  cash: number;
  holdings: {
    ipoId: string;
    creatorSymbol: string;
    creatorName: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
  }[];
  history: {
    date: string;
    value: number;
  }[];
}

// Mock data
const mockUsers: User[] = [
  {
    id: "u1",
    name: "John Investor",
    email: "john@example.com",
    role: "investor",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    kycVerified: true
  },
  {
    id: "u2",
    name: "Emma Watson",
    email: "emma@example.com",
    role: "creator",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    kycVerified: true
  }
];

const mockIPOs: IPO[] = [
  {
    id: "ipo1",
    creatorId: "u2",
    creatorName: "Emma Watson",
    symbol: "EMW",
    initialPrice: 20.0,
    currentPrice: 24.82,
    totalSupply: 1000000,
    availableSupply: 250000,
    startDate: "2023-05-01T00:00:00Z",
    endDate: "2023-05-15T00:00:00Z",
    status: "active",
    description: "Award-winning actress, UN Women Goodwill Ambassador, and entrepreneur.",
    socialLinks: {
      twitter: "https://twitter.com/emmawatson",
      instagram: "https://instagram.com/emmawatson"
    },
    engagementScore: 78,
    aiScore: 92
  },
  {
    id: "ipo2",
    creatorId: "u3",
    creatorName: "Cristiano Ronaldo",
    symbol: "CR7",
    initialPrice: 42.0,
    currentPrice: 56.75,
    totalSupply: 2000000,
    availableSupply: 500000,
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2023-06-15T00:00:00Z",
    status: "active",
    description: "Professional football player, entrepreneur, and philanthropist.",
    socialLinks: {
      twitter: "https://twitter.com/cristiano",
      instagram: "https://instagram.com/cristiano"
    },
    engagementScore: 93,
    aiScore: 95
  },
  {
    id: "ipo3",
    creatorId: "u4",
    creatorName: "Taylor Swift",
    symbol: "SWIFT",
    initialPrice: 35.0,
    currentPrice: 41.20,
    totalSupply: 1500000,
    availableSupply: 375000,
    startDate: "2023-07-01T00:00:00Z",
    endDate: "2023-07-15T00:00:00Z",
    status: "upcoming",
    description: "Multi-Grammy winning singer-songwriter and entrepreneur.",
    socialLinks: {
      twitter: "https://twitter.com/taylorswift13",
      instagram: "https://instagram.com/taylorswift"
    },
    engagementScore: 88,
    aiScore: 91
  }
];

const mockOrders: Order[] = [
  {
    id: "o1",
    userId: "u1",
    ipoId: "ipo1",
    creatorSymbol: "EMW",
    type: "buy",
    orderType: "limit",
    price: 24.50,
    quantity: 10,
    status: "open",
    createdAt: "2023-05-10T10:30:00Z"
  },
  {
    id: "o2",
    userId: "u1",
    ipoId: "ipo2",
    creatorSymbol: "CR7",
    type: "buy",
    orderType: "market",
    price: 56.75,
    quantity: 5,
    status: "filled",
    createdAt: "2023-06-05T14:20:00Z"
  }
];

const mockTrades: Trade[] = [
  {
    id: "t1",
    buyerId: "u1",
    sellerId: "u5",
    ipoId: "ipo2",
    creatorSymbol: "CR7",
    price: 56.75,
    quantity: 5,
    timestamp: "2023-06-05T14:20:00Z"
  }
];

const mockPortfolios: Portfolio[] = [
  {
    userId: "u1",
    totalValue: 10283.75,
    cash: 5000,
    holdings: [
      {
        ipoId: "ipo1",
        creatorSymbol: "EMW",
        creatorName: "Emma Watson",
        quantity: 10,
        averagePrice: 23.40,
        currentPrice: 24.82
      },
      {
        ipoId: "ipo2",
        creatorSymbol: "CR7",
        creatorName: "Cristiano Ronaldo",
        quantity: 5,
        averagePrice: 56.75,
        currentPrice: 56.75
      }
    ],
    history: [
      { date: "2023-05-01", value: 5000 },
      { date: "2023-05-10", value: 7340 },
      { date: "2023-06-05", value: 10283.75 }
    ]
  }
];

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate JWT token
export const generateToken = (user: User) => {
  return `mock-jwt-token-${user.id}-${Date.now()}`;
};

// Auth API functions
export const mockAuthAPI = {
  login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
    await delay(800); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== "password") { // Simple mock password check
      throw new Error("Invalid email or password");
    }
    
    const token = generateToken(user);
    localStorage.setItem("axium_token", token);
    localStorage.setItem("axium_user", JSON.stringify(user));
    
    return { user, token };
  },
  
  register: async (userData: Partial<User>, password: string): Promise<{ user: User, token: string }> => {
    await delay(1000);
    
    if (!userData.email || !userData.name || !password) {
      throw new Error("Missing required fields");
    }
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error("User with this email already exists");
    }
    
    const newUser: User = {
      id: `u${mockUsers.length + 1}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || "investor",
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      kycVerified: false
    };
    
    mockUsers.push(newUser);
    
    const token = generateToken(newUser);
    localStorage.setItem("axium_token", token);
    localStorage.setItem("axium_user", JSON.stringify(newUser));
    
    return { user: newUser, token };
  },
  
  logout: async (): Promise<void> => {
    await delay(300);
    localStorage.removeItem("axium_token");
    localStorage.removeItem("axium_user");
  },
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("axium_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch (e) {
      return null;
    }
  },
  
  completeKYC: async (userId: string, kycData: any): Promise<User> => {
    await delay(1500);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    // Update user with KYC data
    mockUsers[userIndex].kycVerified = true;
    
    // Update local storage
    localStorage.setItem("axium_user", JSON.stringify(mockUsers[userIndex]));
    
    return mockUsers[userIndex];
  }
};

// IPO API functions
export const mockIPOAPI = {
  getAllIPOs: async (): Promise<IPO[]> => {
    await delay(800);
    return [...mockIPOs];
  },
  
  getIPOById: async (ipoId: string): Promise<IPO> => {
    await delay(500);
    
    const ipo = mockIPOs.find(ipo => ipo.id === ipoId);
    if (!ipo) {
      throw new Error("IPO not found");
    }
    
    return ipo;
  },
  
  createIPO: async (ipoData: Partial<IPO>): Promise<IPO> => {
    await delay(1200);
    
    const currentUser = mockAuthAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }
    
    if (currentUser.role !== "creator") {
      throw new Error("Only creators can launch IPOs");
    }
    
    const newIPO: IPO = {
      id: `ipo${mockIPOs.length + 1}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      symbol: ipoData.symbol || `${currentUser.name.substring(0, 3).toUpperCase()}`,
      initialPrice: ipoData.initialPrice || 10.0,
      currentPrice: ipoData.initialPrice || 10.0,
      totalSupply: ipoData.totalSupply || 1000000,
      availableSupply: ipoData.availableSupply || 250000,
      startDate: ipoData.startDate || new Date().toISOString(),
      endDate: ipoData.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: "upcoming",
      description: ipoData.description || `IPO for ${currentUser.name}`,
      socialLinks: ipoData.socialLinks || {},
      engagementScore: Math.floor(Math.random() * 50) + 50, // Random score between 50-100
      aiScore: Math.floor(Math.random() * 30) + 70 // Random score between 70-100
    };
    
    mockIPOs.push(newIPO);
    
    return newIPO;
  }
};

// Trading API functions
export const mockTradingAPI = {
  placeOrder: async (orderData: Partial<Order>): Promise<Order> => {
    await delay(1000);
    
    const currentUser = mockAuthAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }
    
    // Validate order data
    if (!orderData.ipoId || !orderData.type || !orderData.price || !orderData.quantity) {
      throw new Error("Missing required order fields");
    }
    
    // Find the IPO
    const ipo = mockIPOs.find(ipo => ipo.id === orderData.ipoId);
    if (!ipo) {
      throw new Error("IPO not found");
    }
    
    const newOrder: Order = {
      id: `o${mockOrders.length + 1}`,
      userId: currentUser.id,
      ipoId: orderData.ipoId,
      creatorSymbol: ipo.symbol,
      type: orderData.type as 'buy' | 'sell',
      orderType: orderData.orderType as 'market' | 'limit' || 'market',
      price: orderData.price,
      quantity: orderData.quantity,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    
    mockOrders.push(newOrder);
    
    // For market orders, immediately execute the trade
    if (newOrder.orderType === 'market') {
      newOrder.status = 'filled';
      
      // Create a trade
      const newTrade: Trade = {
        id: `t${mockTrades.length + 1}`,
        buyerId: newOrder.type === 'buy' ? currentUser.id : 'system',
        sellerId: newOrder.type === 'sell' ? currentUser.id : 'system',
        ipoId: newOrder.ipoId,
        creatorSymbol: newOrder.creatorSymbol,
        price: newOrder.price,
        quantity: newOrder.quantity,
        timestamp: new Date().toISOString()
      };
      
      mockTrades.push(newTrade);
      
      // Update user's portfolio
      const userPortfolio = mockPortfolios.find(p => p.userId === currentUser.id);
      if (userPortfolio) {
        if (newOrder.type === 'buy') {
          // Deduct cash
          userPortfolio.cash -= newOrder.price * newOrder.quantity;
          
          // Add to holdings or update existing
          const existingHolding = userPortfolio.holdings.find(h => h.ipoId === newOrder.ipoId);
          if (existingHolding) {
            // Update average price
            const totalCost = existingHolding.averagePrice * existingHolding.quantity + newOrder.price * newOrder.quantity;
            const newQuantity = existingHolding.quantity + newOrder.quantity;
            existingHolding.averagePrice = totalCost / newQuantity;
            existingHolding.quantity = newQuantity;
            existingHolding.currentPrice = ipo.currentPrice;
          } else {
            // Add new holding
            userPortfolio.holdings.push({
              ipoId: newOrder.ipoId,
              creatorSymbol: ipo.symbol,
              creatorName: ipo.creatorName,
              quantity: newOrder.quantity,
              averagePrice: newOrder.price,
              currentPrice: ipo.currentPrice
            });
          }
        } else if (newOrder.type === 'sell') {
          // Add cash
          userPortfolio.cash += newOrder.price * newOrder.quantity;
          
          // Update holdings
          const existingHolding = userPortfolio.holdings.find(h => h.ipoId === newOrder.ipoId);
          if (existingHolding) {
            if (existingHolding.quantity === newOrder.quantity) {
              // Remove holding completely
              userPortfolio.holdings = userPortfolio.holdings.filter(h => h.ipoId !== newOrder.ipoId);
            } else {
              // Update quantity
              existingHolding.quantity -= newOrder.quantity;
            }
          }
        }
        
        // Update total value
        userPortfolio.totalValue = userPortfolio.cash + userPortfolio.holdings.reduce(
          (sum, holding) => sum + holding.quantity * holding.currentPrice, 0
        );
        
        // Add to history
        userPortfolio.history.push({
          date: new Date().toISOString(),
          value: userPortfolio.totalValue
        });
      } else {
        // Create new portfolio for user if it doesn't exist
        const newPortfolio: Portfolio = {
          userId: currentUser.id,
          totalValue: 10000, // Starting amount
          cash: 10000 - (newOrder.type === 'buy' ? newOrder.price * newOrder.quantity : 0),
          holdings: newOrder.type === 'buy' ? [{
            ipoId: newOrder.ipoId,
            creatorSymbol: ipo.symbol,
            creatorName: ipo.creatorName,
            quantity: newOrder.quantity,
            averagePrice: newOrder.price,
            currentPrice: ipo.currentPrice
          }] : [],
          history: [
            { date: new Date().toISOString(), value: 10000 }
          ]
        };
        
        mockPortfolios.push(newPortfolio);
      }
      
      toast.success(`Order successfully executed: ${newOrder.type === 'buy' ? 'Bought' : 'Sold'} ${newOrder.quantity} ${newOrder.creatorSymbol} tokens at $${newOrder.price}`);
    } else {
      toast.success(`Limit order placed successfully`);
    }
    
    return newOrder;
  },
  
  cancelOrder: async (orderId: string): Promise<Order> => {
    await delay(700);
    
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error("Order not found");
    }
    
    const currentUser = mockAuthAPI.getCurrentUser();
    if (!currentUser || mockOrders[orderIndex].userId !== currentUser.id) {
      throw new Error("Not authorized to cancel this order");
    }
    
    if (mockOrders[orderIndex].status !== 'open') {
      throw new Error("Only open orders can be canceled");
    }
    
    mockOrders[orderIndex].status = 'canceled';
    
    return mockOrders[orderIndex];
  },
  
  getUserOrders: async (): Promise<Order[]> => {
    await delay(600);
    
    const currentUser = mockAuthAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }
    
    return mockOrders.filter(o => o.userId === currentUser.id);
  },
  
  getUserTrades: async (): Promise<Trade[]> => {
    await delay(600);
    
    const currentUser = mockAuthAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }
    
    return mockTrades.filter(t => t.buyerId === currentUser.id || t.sellerId === currentUser.id);
  },
  
  getOrderBook: async (ipoId: string): Promise<{ bids: Order[], asks: Order[] }> => {
    await delay(800);
    
    const openOrders = mockOrders.filter(o => o.ipoId === ipoId && o.status === 'open');
    
    return {
      bids: openOrders.filter(o => o.type === 'buy').sort((a, b) => b.price - a.price),
      asks: openOrders.filter(o => o.type === 'sell').sort((a, b) => a.price - b.price)
    };
  }
};

// Portfolio API functions
export const mockPortfolioAPI = {
  getUserPortfolio: async (): Promise<Portfolio> => {
    await delay(700);
    
    const currentUser = mockAuthAPI.getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }
    
    let portfolio = mockPortfolios.find(p => p.userId === currentUser.id);
    
    if (!portfolio) {
      // Create a new portfolio if user doesn't have one
      portfolio = {
        userId: currentUser.id,
        totalValue: 10000, // Starting amount
        cash: 10000,
        holdings: [],
        history: [
          { date: new Date().toISOString(), value: 10000 }
        ]
      };
      
      mockPortfolios.push(portfolio);
    }
    
    // Update current prices of holdings
    portfolio.holdings.forEach(holding => {
      const ipo = mockIPOs.find(ipo => ipo.id === holding.ipoId);
      if (ipo) {
        holding.currentPrice = ipo.currentPrice;
      }
    });
    
    // Recalculate total value
    portfolio.totalValue = portfolio.cash + portfolio.holdings.reduce(
      (sum, holding) => sum + holding.quantity * holding.currentPrice, 0
    );
    
    return portfolio;
  }
};

// AI Valuation API functions
export const mockAIValuationAPI = {
  getValuationFactors: async (ipoId: string): Promise<{
    socialEngagement: {
      twitter: number;
      instagram: number;
      youtube: number;
    };
    mediaPerformance: {
      streams: number;
      views: number;
      mentions: number;
    };
    brandDeals: {
      total: number;
      value: number;
      growth: number;
    };
    sentimentAnalysis: {
      score: number;
      trend: 'positive' | 'neutral' | 'negative';
      keywords: string[];
    };
  }> => {
    await delay(1000);
    
    // Find the IPO
    const ipo = mockIPOs.find(ipo => ipo.id === ipoId);
    if (!ipo) {
      throw new Error("IPO not found");
    }
    
    // Generate mock AI valuation data
    return {
      socialEngagement: {
        twitter: Math.floor(Math.random() * 5000000) + 1000000,
        instagram: Math.floor(Math.random() * 10000000) + 5000000,
        youtube: Math.floor(Math.random() * 2000000) + 500000
      },
      mediaPerformance: {
        streams: Math.floor(Math.random() * 500000000) + 100000000,
        views: Math.floor(Math.random() * 1000000000) + 200000000,
        mentions: Math.floor(Math.random() * 50000) + 10000
      },
      brandDeals: {
        total: Math.floor(Math.random() * 20) + 5,
        value: Math.floor(Math.random() * 100000000) + 10000000,
        growth: Math.floor(Math.random() * 30) + 5
      },
      sentimentAnalysis: {
        score: ipo.aiScore / 100, // Convert to 0-1 scale
        trend: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
        keywords: ['talented', 'inspiring', 'innovative', 'authentic', 'influential'].sort(() => Math.random() - 0.5).slice(0, 3)
      }
    };
  },
  
  predictPriceMovement: async (ipoId: string): Promise<{
    prediction: 'up' | 'down' | 'stable';
    confidence: number;
    targetPrice: number;
    timeframe: '24h' | '7d' | '30d';
    factors: string[];
  }> => {
    await delay(1200);
    
    // Find the IPO
    const ipo = mockIPOs.find(ipo => ipo.id === ipoId);
    if (!ipo) {
      throw new Error("IPO not found");
    }
    
    // Generate prediction factors
    const factors = [
      'Recent social media engagement shows positive trend',
      'New brand partnership announced',
      'Upcoming project release',
      'Positive sentiment analysis',
      'Comparable creators showing similar patterns'
    ].sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Random prediction with bias toward movement
    const predictions: ('up' | 'down' | 'stable')[] = ['up', 'up', 'down', 'stable'];
    const prediction = predictions[Math.floor(Math.random() * predictions.length)];
    
    // Target price calculation
    let targetPrice = ipo.currentPrice;
    if (prediction === 'up') {
      targetPrice *= (1 + (Math.random() * 0.15 + 0.05));
    } else if (prediction === 'down') {
      targetPrice *= (1 - (Math.random() * 0.10 + 0.03));
    }
    
    return {
      prediction,
      confidence: Math.floor(Math.random() * 20) + 70, // 70-90% confidence
      targetPrice: parseFloat(targetPrice.toFixed(2)),
      timeframe: ['24h', '7d', '30d'][Math.floor(Math.random() * 3)] as '24h' | '7d' | '30d',
      factors
    };
  }
};
