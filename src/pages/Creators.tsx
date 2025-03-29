import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp, TrendingDown, ArrowUpDown, Star, Sparkles, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const allCreators = [
  {
    id: "1",
    name: "Emma Watson",
    symbol: "$EMW",
    category: "Acting",
    price: 24.82,
    change: 12.5,
    marketCap: 124100000,
    followers: "28.5M",
    popularity: 91,
    trending: true,
    verified: true
  },
  {
    id: "2",
    name: "Zendaya",
    symbol: "$ZEN",
    category: "Acting",
    price: 18.40,
    change: 5.2,
    marketCap: 92000000,
    followers: "169M",
    popularity: 87,
    trending: true,
    verified: true
  },
  {
    id: "3",
    name: "Tom Holland",
    symbol: "$THLD",
    category: "Acting",
    price: 21.35,
    change: -1.8,
    marketCap: 106800000,
    followers: "75.4M",
    popularity: 79,
    trending: false,
    verified: true
  },
  {
    id: "4",
    name: "LeBron James",
    symbol: "$LBJ",
    category: "Sports",
    price: 56.78,
    change: 3.4,
    marketCap: 283900000,
    followers: "154M",
    popularity: 93,
    trending: false,
    verified: true
  },
  {
    id: "5",
    name: "Taylor Swift",
    symbol: "$SWIFT",
    category: "Music",
    price: 89.21,
    change: 8.7,
    marketCap: 446050000,
    followers: "267M",
    popularity: 98,
    trending: true,
    verified: true
  },
  {
    id: "6",
    name: "BTS",
    symbol: "$BTS",
    category: "Music",
    price: 45.63,
    change: -2.3,
    marketCap: 228150000,
    followers: "70.2M",
    popularity: 95,
    trending: false,
    verified: true
  },
  {
    id: "7",
    name: "Dua Lipa",
    symbol: "$DLIPA",
    category: "Music",
    price: 19.92,
    change: 6.1,
    marketCap: 99600000,
    followers: "88.3M",
    popularity: 85,
    trending: false,
    verified: true
  },
  {
    id: "8",
    name: "Cristiano Ronaldo",
    symbol: "$CR7",
    category: "Sports",
    price: 72.15,
    change: 4.5,
    marketCap: 360750000,
    followers: "603M",
    popularity: 97,
    trending: true,
    verified: true
  },
  {
    id: "9",
    name: "Billie Eilish",
    symbol: "$BLSH",
    category: "Music",
    price: 31.47,
    change: -0.9,
    marketCap: 157350000,
    followers: "108M",
    popularity: 89,
    trending: false,
    verified: true
  },
  {
    id: "10",
    name: "Ryan Reynolds",
    symbol: "$RYNR",
    category: "Acting",
    price: 42.36,
    change: 7.2,
    marketCap: 211800000,
    followers: "47.8M",
    popularity: 88,
    trending: true,
    verified: true
  },
  {
    id: "11",
    name: "Serena Williams",
    symbol: "$SRNW",
    category: "Sports",
    price: 36.49,
    change: 1.8,
    marketCap: 182450000,
    followers: "16.2M",
    popularity: 84,
    trending: false,
    verified: true
  },
  {
    id: "12",
    name: "Ariana Grande",
    symbol: "$ARGR",
    category: "Music",
    price: 52.84,
    change: 3.7,
    marketCap: 264200000,
    followers: "371M",
    popularity: 92,
    trending: true,
    verified: true
  }
];

const upcomingIPOs = [
  {
    id: "101",
    name: "Timothée Chalamet",
    symbol: "$TIMO",
    category: "Acting",
    initialPrice: 14.50,
    marketCap: 72500000,
    followers: "18.3M",
    popularity: 88,
    launchDate: "May 15, 2023",
    verified: true
  },
  {
    id: "102",
    name: "Olivia Rodrigo",
    symbol: "$OLIV",
    category: "Music",
    initialPrice: 19.25,
    marketCap: 96250000,
    followers: "33.7M",
    popularity: 90,
    launchDate: "May 18, 2023",
    verified: true
  },
  {
    id: "103",
    name: "Chloe Kim",
    symbol: "$CKIM",
    category: "Sports",
    initialPrice: 12.80,
    marketCap: 64000000,
    followers: "1.2M",
    popularity: 79,
    launchDate: "May 22, 2023",
    verified: true
  }
];

const Creators = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredCreators = allCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      creator.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || creator.category === categoryFilter;
    const matchesTab = activeTab === "all" || 
                     (activeTab === "trending" && creator.trending) ||
                     (activeTab === "gainers" && creator.change > 0) ||
                     (activeTab === "losers" && creator.change < 0);
    
    return matchesSearch && matchesCategory && matchesTab;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      case "change-high":
        return b.change - a.change;
      case "change-low":
        return a.change - b.change;
      case "market-cap":
        return b.marketCap - a.marketCap;
      case "popularity":
      default:
        return b.popularity - a.popularity;
    }
  });
  
  return (
    <div className="min-h-screen bg-axium-gray-100/30">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-axium-gray-900 mb-2">Creator Tokens</h1>
            <p className="text-axium-gray-600">Discover and invest in your favorite creators</p>
          </div>
          
          <div className="mb-8">
            <Tabs defaultValue="creators" className="w-full">
              <TabsList className="w-full max-w-md mx-auto bg-axium-gray-100 p-1">
                <TabsTrigger value="creators" className="flex-1">
                  Active Tokens
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex-1">
                  Upcoming IPOs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="creators" className="mt-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-axium-gray-500" />
                    <Input 
                      placeholder="Search creators or tokens" 
                      className="pl-9 bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Acting">Acting</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="price-high">Price (High to Low)</SelectItem>
                        <SelectItem value="price-low">Price (Low to High)</SelectItem>
                        <SelectItem value="change-high">Change % (High to Low)</SelectItem>
                        <SelectItem value="change-low">Change % (Low to High)</SelectItem>
                        <SelectItem value="market-cap">Market Cap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    <Button
                      variant="ghost"
                      className={cn(
                        "rounded-none py-6 px-6",
                        activeTab === "all" ? "text-axium-blue border-b-2 border-axium-blue" : "text-axium-gray-600"
                      )}
                      onClick={() => setActiveTab("all")}
                    >
                      All Tokens
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        "rounded-none py-6 px-6",
                        activeTab === "trending" ? "text-axium-blue border-b-2 border-axium-blue" : "text-axium-gray-600"
                      )}
                      onClick={() => setActiveTab("trending")}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Trending
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        "rounded-none py-6 px-6",
                        activeTab === "gainers" ? "text-axium-blue border-b-2 border-axium-blue" : "text-axium-gray-600"
                      )}
                      onClick={() => setActiveTab("gainers")}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Top Gainers
                    </Button>
                    <Button
                      variant="ghost"
                      className={cn(
                        "rounded-none py-6 px-6",
                        activeTab === "losers" ? "text-axium-blue border-b-2 border-axium-blue" : "text-axium-gray-600"
                      )}
                      onClick={() => setActiveTab("losers")}
                    >
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Top Losers
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-axium-gray-200">
                    <thead className="bg-axium-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">
                          Creator
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">
                          <div className="flex items-center cursor-pointer" onClick={() => setSortBy(sortBy === "price-high" ? "price-low" : "price-high")}>
                            Price
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">
                          <div className="flex items-center cursor-pointer" onClick={() => setSortBy(sortBy === "change-high" ? "change-low" : "change-high")}>
                            24h Change
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">
                          <div className="flex items-center cursor-pointer" onClick={() => setSortBy("market-cap")}>
                            Market Cap
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-axium-gray-600 uppercase tracking-wider">
                          Social
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-axium-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-axium-gray-200">
                      {filteredCreators.map((creator) => (
                        <tr key={creator.id} className="hover:bg-axium-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-axium-gray-200 overflow-hidden flex-shrink-0">
                                <div className="h-full w-full bg-gradient-to-br from-axium-blue/20 to-axium-blue-light/30" />
                              </div>
                              <div className="ml-4">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-axium-gray-900">
                                    {creator.name}
                                  </div>
                                  {creator.trending && (
                                    <span className="ml-2 bg-axium-blue/10 text-axium-blue text-xs py-0.5 px-1.5 rounded-full">
                                      Trending
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-axium-gray-900">{creator.symbol}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-axium-gray-600">{creator.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-axium-gray-900">${creator.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              creator.change >= 0 
                                ? "bg-axium-success/10 text-axium-success" 
                                : "bg-axium-error/10 text-axium-error"
                            )}>
                              {creator.change >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {creator.change >= 0 ? "+" : ""}{creator.change}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-axium-gray-600">
                              ${(creator.marketCap / 1000000).toFixed(1)}M
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-axium-gray-600">{creator.followers}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center space-x-2">
                              <Button 
                                size="sm"
                                className="bg-axium-blue hover:bg-axium-blue/90 text-white px-4"
                              >
                                Trade
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="border-axium-gray-200 text-axium-gray-700 hover:bg-axium-gray-100"
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingIPOs.map((ipo) => (
                    <GlassCard 
                      key={ipo.id}
                      variant="gold"
                      interactive={true}
                      className="flex flex-col h-full"
                    >
                      <div className="mb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-axium-gray-200 mr-3">
                              <div className="h-full w-full bg-gradient-to-br from-axium-blue/20 to-axium-blue-light/30" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">{ipo.name}</h3>
                              <p className="text-axium-gray-600">{ipo.symbol}</p>
                            </div>
                          </div>
                          <div className="bg-axium-blue/10 text-axium-blue text-xs py-1 px-2 rounded-full">
                            Upcoming IPO
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-axium-gray-500 text-sm">Initial Price</p>
                            <p className="font-semibold text-xl">${ipo.initialPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-axium-gray-500 text-sm">Category</p>
                            <p className="font-medium">{ipo.category}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <div>
                            <p className="text-axium-gray-500 text-sm">Launch Date</p>
                            <p className="font-medium">{ipo.launchDate}</p>
                          </div>
                          <div>
                            <p className="text-axium-gray-500 text-sm">Followers</p>
                            <p className="font-medium">{ipo.followers}</p>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-sm text-axium-gray-500">Popularity Score</p>
                            <p className="text-sm font-medium text-axium-gray-800">{ipo.popularity}/100</p>
                          </div>
                          <div className="h-2 bg-axium-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-axium-blue rounded-full"
                              style={{ width: `${ipo.popularity}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button className="w-full bg-axium-blue hover:bg-axium-blue/90 text-white">
                          Join Waitlist
                        </Button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Creators;
