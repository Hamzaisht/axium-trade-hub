
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockIPOAPI, mockAIValuationAPI, IPO } from '@/utils/mockApi';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface IPOContextType {
  ipos: IPO[];
  selectedIPO: IPO | null;
  isLoading: boolean;
  fetchAllIPOs: () => Promise<void>;
  fetchIPOById: (ipoId: string) => Promise<void>;
  createIPO: (ipoData: Partial<IPO>) => Promise<IPO>;
  getValuationFactors: (ipoId: string) => Promise<any>;
  predictPriceMovement: (ipoId: string) => Promise<any>;
}

const IPOContext = createContext<IPOContextType | undefined>(undefined);

export const IPOProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [ipos, setIPOs] = useState<IPO[]>([]);
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setSelectedIPO(ipo);
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

    if (user?.role !== 'creator') {
      toast.error('Only creators can launch IPOs');
      throw new Error('Not authorized');
    }

    try {
      setIsLoading(true);
      const newIPO = await mockIPOAPI.createIPO(ipoData);
      
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
      return await mockAIValuationAPI.predictPriceMovement(ipoId);
    } catch (error) {
      toast.error('Failed to predict price movement');
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
        predictPriceMovement
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
