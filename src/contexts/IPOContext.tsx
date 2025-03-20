
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockIPOAPI, mockAIValuationAPI, IPO } from '@/utils/mockApi';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { mockWebSocket, WSEvents } from '@/utils/mockWebSocket';

interface IPOContextType {
  ipos: IPO[];
  selectedIPO: IPO | null;
  isLoading: boolean;
  fetchAllIPOs: () => Promise<void>;
  fetchIPOById: (ipoId: string) => Promise<void>;
  createIPO: (ipoData: Partial<IPO>) => Promise<IPO>;
  getValuationFactors: (ipoId: string) => Promise<any>;
  predictPriceMovement: (ipoId: string) => Promise<any>;
  isConnected: boolean;
  // Simulated blockchain
  launchIPOOnChain: (ipoId: string) => Promise<{ txHash: string, status: string }>;
  getOnChainData: (ipoId: string) => Promise<{ 
    contractAddress: string, 
    totalSupply: number, 
    circulatingSupply: number,
    holders: number
  }>;
}

const IPOContext = createContext<IPOContextType | undefined>(undefined);

// This map simulates blockchain data for IPOs
const mockBlockchainData = new Map<string, {
  contractAddress: string;
  totalSupply: number;
  circulatingSupply: number;
  holders: number;
  onChain: boolean;
  creationTxHash?: string;
}>();

export const IPOProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [ipos, setIPOs] = useState<IPO[]>([]);
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to the mock WebSocket when the context is initialized
  useEffect(() => {
    mockWebSocket.connect();
    
    // Handle connection status changes
    const connectionHandler = (data: { status: string }) => {
      setIsConnected(data.status === 'connected');
    };

    // Handle price updates
    const priceUpdateHandler = (data: { ipoId: string, newPrice: number }) => {
      // Update the price of the IPO in our local state
      setIPOs(prev => {
        return prev.map(ipo => {
          if (ipo.id === data.ipoId) {
            return { ...ipo, currentPrice: data.newPrice };
          }
          return ipo;
        });
      });
      
      // Also update selectedIPO if it matches
      if (selectedIPO && selectedIPO.id === data.ipoId) {
        setSelectedIPO(prev => {
          if (!prev) return null;
          return { ...prev, currentPrice: data.newPrice };
        });
      }
    };

    // Subscribe to WebSocket events
    mockWebSocket.on(WSEvents.CONNECTION, connectionHandler);
    mockWebSocket.on(WSEvents.PRICE_UPDATE, priceUpdateHandler);

    // Cleanup function
    return () => {
      mockWebSocket.off(WSEvents.CONNECTION, connectionHandler);
      mockWebSocket.off(WSEvents.PRICE_UPDATE, priceUpdateHandler);
    };
  }, [selectedIPO]);

  // Initialize blockchain data for any existing IPOs
  useEffect(() => {
    // Initialize the IPOs we already have with blockchain data
    ipos.forEach(ipo => {
      if (!mockBlockchainData.has(ipo.id)) {
        mockBlockchainData.set(ipo.id, {
          contractAddress: `0x${Array.from({length: 40}, () => 
            Math.floor(Math.random() * 16).toString(16)).join('')}`,
          totalSupply: ipo.totalSupply,
          circulatingSupply: ipo.availableSupply,
          holders: Math.floor(Math.random() * 500) + 50,
          onChain: Math.random() > 0.5 // Randomly determine if it's on chain already
        });
      }
    });
  }, [ipos]);

  const fetchAllIPOs = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const allIPOs = await mockIPOAPI.getAllIPOs();
      setIPOs(allIPOs);
    } catch (error) {
      toast.error('Failed to fetch IPOs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIPOById = async (ipoId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const ipo = await mockIPOAPI.getIPOById(ipoId);
      setSelectedIPO(ipo || null);
    } catch (error) {
      toast.error('Failed to fetch IPO details');
    } finally {
      setIsLoading(false);
    }
  };

  const createIPO = async (ipoData: Partial<IPO>): Promise<IPO> => {
    if (!isAuthenticated) {
      toast.error('Please log in to create an IPO');
      throw new Error('Not authenticated');
    }

    // Check for creator access using the apiRole property
    if (user?.apiRole !== 'creator') {
      toast.error('Only creators can launch IPOs');
      throw new Error('Not authorized');
    }

    try {
      setIsLoading(true);
      const newIPO = await mockIPOAPI.createIPO(ipoData);
      
      // Initialize blockchain data for the new IPO
      mockBlockchainData.set(newIPO.id, {
        contractAddress: `0x${Array.from({length: 40}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`,
        totalSupply: newIPO.totalSupply,
        circulatingSupply: 0, // Initially no tokens in circulation
        holders: 0, // No holders yet
        onChain: false // Not deployed to blockchain yet
      });
      
      // Refresh IPOs after creating a new one
      await fetchAllIPOs();
      
      toast.success('IPO created successfully');
      return newIPO;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create IPO');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getValuationFactors = async (ipoId: string) => {
    try {
      setIsLoading(true);
      return await mockAIValuationAPI.getValuationFactors(ipoId);
    } catch (error) {
      toast.error('Failed to fetch valuation factors');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const predictPriceMovement = async (ipoId: string) => {
    try {
      setIsLoading(true);
      // Using default values for timeframe and modelType
      return await mockAIValuationAPI.predictPriceMovement(ipoId, 'short_term', 'standard');
    } catch (error) {
      toast.error('Failed to predict price movement');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Simulated blockchain functions
  const launchIPOOnChain = async (ipoId: string): Promise<{ txHash: string, status: string }> => {
    if (!isAuthenticated) {
      toast.error('Please log in to launch an IPO on chain');
      throw new Error('Not authenticated');
    }

    try {
      setIsLoading(true);
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const blockchainData = mockBlockchainData.get(ipoId);
      if (!blockchainData) {
        throw new Error('IPO not found in blockchain data');
      }
      
      // Generate a random transaction hash
      const txHash = `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      // Update blockchain data
      mockBlockchainData.set(ipoId, {
        ...blockchainData,
        onChain: true,
        creationTxHash: txHash,
        circulatingSupply: Math.floor(blockchainData.totalSupply * 0.25) // Release 25% of tokens
      });
      
      toast.success('IPO successfully deployed to blockchain');
      
      return {
        txHash,
        status: 'confirmed'
      };
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to launch IPO on chain');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getOnChainData = async (ipoId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const blockchainData = mockBlockchainData.get(ipoId);
      if (!blockchainData) {
        throw new Error('IPO not found in blockchain data');
      }
      
      return {
        contractAddress: blockchainData.contractAddress,
        totalSupply: blockchainData.totalSupply,
        circulatingSupply: blockchainData.circulatingSupply,
        holders: blockchainData.holders
      };
    } catch (error) {
      toast.error('Failed to fetch on-chain data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IPOContext.Provider
      value={{
        ipos,
        selectedIPO,
        isLoading,
        fetchAllIPOs,
        fetchIPOById,
        createIPO,
        getValuationFactors,
        predictPriceMovement,
        isConnected,
        launchIPOOnChain,
        getOnChainData
      }}
    >
      {children}
    </IPOContext.Provider>
  );
};

export const useIPO = () => {
  const context = useContext(IPOContext);
  if (context === undefined) {
    throw new Error('useIPO must be used within an IPOProvider');
  }
  return context;
};
