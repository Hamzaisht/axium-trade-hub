
import { useState } from "react";
import { useCreators } from "@/hooks/useCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Creator } from "@/services/CreatorService";
import { Link } from "react-router-dom";

export function CreatorManagement() {
  const { data: creators = [], isLoading } = useCreators();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCreators = creators.filter(creator => 
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.handle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Creator Management</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search creators..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>Add Creator</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Creator Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-md bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted-foreground/20"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted-foreground/20 rounded"></div>
                      <div className="h-3 w-24 bg-muted-foreground/20 rounded"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-muted-foreground/20 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredCreators.length > 0 ? (
            <div className="space-y-2">
              {filteredCreators.map((creator) => (
                <CreatorRow key={creator.id} creator={creator} />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No creators found matching "{searchQuery}"</p>
              <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No creators added yet</p>
              <Button variant="link">Add your first creator</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CreatorRow({ creator }: { creator: Creator }) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={creator.avatar_url || ''} alt={creator.name} />
          <AvatarFallback>{getInitials(creator.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{creator.name}</h3>
          <p className="text-sm text-muted-foreground">@{creator.handle || creator.slug}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {creator.followers && (
          <div className="text-sm">
            <span className="text-muted-foreground">Followers:</span> {creator.followers.toLocaleString()}
          </div>
        )}
        {creator.engagement && (
          <div className="text-sm">
            <span className="text-muted-foreground">Engagement:</span> {creator.engagement.toFixed(1)}%
          </div>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link to={`/creators/${creator.slug}`}>View</Link>
        </Button>
      </div>
    </div>
  );
}
