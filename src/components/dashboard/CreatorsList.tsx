
import { useState } from "react";
import CreatorCard from "@/components/dashboard/CreatorCard";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Creator {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  change: number;
  marketCap: number;
  followers: string;
  engagement: number;
  aiScore: number;
}

interface CreatorsListProps {
  creators: Creator[];
  selectedCreatorId: string | undefined;
  onSelectCreator: (id: string) => void;
  isLoading: boolean;
  searchQuery: string;
}

export const CreatorsList = ({ 
  creators, 
  selectedCreatorId,
  onSelectCreator,
  isLoading, 
  searchQuery 
}: CreatorsListProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-axium-gray-800">Top Creators</h2>
        <Button variant="ghost" size="sm" className="px-2 text-axium-gray-600 hover:text-axium-blue">
          <Filter className="h-4 w-4 mr-1" />
          Filter
        </Button>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          Array(5).fill(0).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))
        ) : creators.length > 0 ? (
          creators.map(creator => (
            <CreatorCard 
              key={creator.id} 
              creator={creator} 
              onSelect={onSelectCreator}
              selected={selectedCreatorId === creator.id}
              sentimentEnabled={true}
            />
          ))
        ) : (
          <div className="text-center py-6 text-axium-gray-500">
            <p>No creators found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </>
  );
};
