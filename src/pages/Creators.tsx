
import { useState, useEffect } from 'react';
import { useIPO } from '@/contexts/IPOContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreatorCard } from '@/components/creators/CreatorCard';
import { Search, TrendingUp, BarChart3, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const Creators = () => {
  const { ipos, isLoading, fetchAllIPOs } = useIPO();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Fetch creators data on component mount
  useEffect(() => {
    fetchAllIPOs();
  }, [fetchAllIPOs]);

  // Mock categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'entertainer', name: 'Entertainers' },
    { id: 'athlete', name: 'Athletes' },
    { id: 'musician', name: 'Musicians' },
    { id: 'content', name: 'Content Creators' },
    { id: 'influencer', name: 'Influencers' },
  ];

  // Filter and sort creators
  const filteredCreators = ipos.filter(creator => {
    const matchesSearch = creator.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || creator.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Sort creators based on selected option
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return b.currentPrice - a.currentPrice;
      case 'price-low':
        return a.currentPrice - b.currentPrice;
      case 'growth':
        return (b.priceChange || 0) - (a.priceChange || 0);
      case 'engagement':
        return b.engagementScore - a.engagementScore;
      case 'ai-score':
        return b.aiScore - a.aiScore;
      case 'popularity':
      default:
        // Default sort by a combination of factors (market cap)
        const bMarketCap = b.currentPrice * (b.totalSupply || 1000000);
        const aMarketCap = a.currentPrice * (a.totalSupply || 1000000);
        return bMarketCap - aMarketCap;
    }
  });

  // Get trending creators (highest price change)
  const trendingCreators = [...ipos]
    .map(creator => ({
      ...creator,
      priceChange: ((creator.currentPrice - creator.initialPrice) / creator.initialPrice) * 100
    }))
    .sort((a, b) => b.priceChange - a.priceChange)
    .slice(0, 6);

  // Group by highest engagement
  const highestEngagement = [...ipos]
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 6);

  // Group by highest AI scores
  const highestAIScore = [...ipos]
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 6);
    
  // For debugging
  console.log("IPOs data:", ipos);
  console.log("Filtered creators:", filteredCreators);
  console.log("Loading state:", isLoading);

  return (
    <div className="min-h-screen bg-axium-gray-100/30">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-axium-gray-900 mb-2">Explore Creators</h1>
            <p className="text-axium-gray-600">Discover and invest in your favorite creators</p>
          </div>
          
          <Tabs defaultValue="explore" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="explore">All Creators</TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="engagement">
                <Users className="h-4 w-4 mr-2" />
                Highest Engagement
              </TabsTrigger>
              <TabsTrigger value="ai-score">
                <BarChart3 className="h-4 w-4 mr-2" />
                Top AI Scores
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="explore">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-axium-gray-400" />
                  <Input
                    placeholder="Search creators by name or symbol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter creators by category</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="popularity">Most Popular</SelectItem>
                              <SelectItem value="price-high">Price: High to Low</SelectItem>
                              <SelectItem value="price-low">Price: Low to High</SelectItem>
                              <SelectItem value="growth">Highest Growth</SelectItem>
                              <SelectItem value="engagement">Highest Engagement</SelectItem>
                              <SelectItem value="ai-score">Highest AI Score</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sort creators by different metrics</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-10 w-10 border-4 border-axium-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-axium-gray-600">Loading creators...</p>
                </div>
              ) : sortedCreators.length === 0 ? (
                <div className="text-center py-12 space-y-6">
                  <p className="text-axium-gray-600">No creators found with your search criteria.</p>
                  {ipos.length === 0 && (
                    <div>
                      <p className="text-axium-gray-600 mb-4">No creator data available. Try refreshing the page.</p>
                      <Button onClick={() => fetchAllIPOs()} className="bg-axium-blue hover:bg-axium-blue/90">
                        Refresh Creators
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCreators.map(creator => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trending">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-10 w-10 border-4 border-axium-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-axium-gray-600">Loading trending creators...</p>
                </div>
              ) : trendingCreators.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-axium-gray-600">No trending creators available.</p>
                  <Button onClick={() => fetchAllIPOs()} className="mt-4 bg-axium-blue hover:bg-axium-blue/90">
                    Refresh Data
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingCreators.map(creator => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="engagement">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-10 w-10 border-4 border-axium-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-axium-gray-600">Loading creators by engagement...</p>
                </div>
              ) : highestEngagement.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-axium-gray-600">No creator engagement data available.</p>
                  <Button onClick={() => fetchAllIPOs()} className="mt-4 bg-axium-blue hover:bg-axium-blue/90">
                    Refresh Data
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {highestEngagement.map(creator => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ai-score">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-10 w-10 border-4 border-axium-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-axium-gray-600">Loading creators by AI score...</p>
                </div>
              ) : highestAIScore.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-axium-gray-600">No AI score data available.</p>
                  <Button onClick={() => fetchAllIPOs()} className="mt-4 bg-axium-blue hover:bg-axium-blue/90">
                    Refresh Data
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {highestAIScore.map(creator => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Creators;
