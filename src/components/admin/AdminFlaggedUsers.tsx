import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { 
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  ShieldAlert,
  Eye,
  CornerDownRight,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Risk level types
type RiskLevel = 'high' | 'medium' | 'low';
type FlagStatus = 'pending' | 'reviewed' | 'cleared' | 'suspended';
type FlagType = 'manipulation' | 'fraud' | 'identity' | 'trading' | 'activity';

// Define a flagged user interface
interface FlaggedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  riskLevel: RiskLevel;
  status: FlagStatus;
  flagType: FlagType;
  flagReason: string;
  flagDate: string;
  activitySummary: string;
  notes?: string[];
}

export const AdminFlaggedUsers = () => {
  // Sample flagged users data
  const [flaggedUsers, setFlaggedUsers] = useState<FlaggedUser[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      avatar: 'https://i.pravatar.cc/150?u=flagged1',
      riskLevel: 'high',
      status: 'pending',
      flagType: 'manipulation',
      flagReason: 'Unusual trading pattern detected - potential market manipulation',
      flagDate: '2023-11-14',
      activitySummary: 'Multiple large buy orders followed by immediate sell-offs across 3 different creators',
      notes: ['User has been involved in 24 transactions in the last hour', 'Previous account was restricted last month']
    },
    {
      id: '2',
      name: 'Emily Johnson',
      email: 'emily@example.com',
      avatar: 'https://i.pravatar.cc/150?u=flagged2',
      riskLevel: 'medium',
      status: 'pending',
      flagType: 'identity',
      flagReason: 'Mismatched identity documents in KYC verification',
      flagDate: '2023-11-12',
      activitySummary: 'Attempted to verify with potentially altered documents',
      notes: ['Documents do not match database records', 'Multiple failed verification attempts']
    },
    {
      id: '3',
      name: 'Robert Davis',
      email: 'robert@example.com',
      avatar: 'https://i.pravatar.cc/150?u=flagged3',
      riskLevel: 'high',
      status: 'reviewed',
      flagType: 'fraud',
      flagReason: 'Attempted to use stolen payment method',
      flagDate: '2023-11-10',
      activitySummary: 'Payment provider flagged credit card as potentially stolen',
      notes: ['Card reported stolen by issuing bank', 'Account created 2 days before incident']
    },
    {
      id: '4',
      name: 'Sophia Williams',
      email: 'sophia@example.com',
      avatar: 'https://i.pravatar.cc/150?u=flagged4',
      riskLevel: 'low',
      status: 'pending',
      flagType: 'trading',
      flagReason: 'Multiple failed transactions in short time period',
      flagDate: '2023-11-09',
      activitySummary: '15 failed transaction attempts in 5 minutes',
      notes: ['Could be legitimate API testing or integration issue']
    },
    {
      id: '5',
      name: 'Michael Brown',
      email: 'michael@example.com',
      avatar: 'https://i.pravatar.cc/150?u=flagged5',
      riskLevel: 'medium',
      status: 'suspended',
      flagType: 'activity',
      flagReason: 'Unusual login activity from multiple countries',
      flagDate: '2023-11-08',
      activitySummary: 'Logins detected from 5 different countries in 24 hours',
      notes: ['Account accessed from US, Russia, China, India, and Brazil', 'No VPN detected']
    }
  ]);

  const handleClearFlag = (userId: string) => {
    setFlaggedUsers(flaggedUsers.map(user => 
      user.id === userId ? {...user, status: 'cleared'} : user
    ));
    toast.success('User flag cleared');
  };

  const handleSuspendUser = (userId: string) => {
    setFlaggedUsers(flaggedUsers.map(user => 
      user.id === userId ? {...user, status: 'suspended'} : user
    ));
    toast.success('User account suspended');
  };

  const handleMarkReviewed = (userId: string) => {
    setFlaggedUsers(flaggedUsers.map(user => 
      user.id === userId ? {...user, status: 'reviewed'} : user
    ));
    toast.success('Flag marked as reviewed');
  };

  const getRiskLevelColor = (level: RiskLevel) => {
    switch(level) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'low':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return '';
    }
  };

  const getFlagTypeIcon = (type: FlagType) => {
    switch(type) {
      case 'manipulation':
        return <AlertTriangle className="h-4 w-4" />;
      case 'fraud':
        return <ShieldAlert className="h-4 w-4" />;
      case 'identity':
        return <UserX className="h-4 w-4" />;
      case 'trading':
        return <AlertCircle className="h-4 w-4" />;
      case 'activity':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: FlagStatus) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending Review</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Reviewed</Badge>;
      case 'cleared':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Cleared</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Account Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Flagged Users</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input placeholder="Search flagged users..." />
          </div>
          <Button variant="outline" className="flex gap-1">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Flags</TabsTrigger>
          <TabsTrigger value="pending">Pending ({flaggedUsers.filter(u => u.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          <TabsTrigger value="cleared">Cleared</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">
            {flaggedUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskLevelColor(user.riskLevel)}>
                        {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)} Risk
                      </Badge>
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getFlagTypeIcon(user.flagType)}
                        <span>
                          {user.flagType.charAt(0).toUpperCase() + user.flagType.slice(1)}
                        </span>
                      </Badge>
                      <span className="text-sm text-gray-500">Flagged on {user.flagDate}</span>
                    </div>
                    <p className="text-sm font-medium">{user.flagReason}</p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Activity Summary</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.activitySummary}</p>
                  </div>
                  
                  {user.notes && user.notes.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Notes</div>
                      <ul className="space-y-1">
                        {user.notes.map((note, index) => (
                          <li key={index} className="flex text-sm text-gray-600 dark:text-gray-400">
                            <CornerDownRight className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <a href="#view-details">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </a>
                    </Button>
                    
                    <div className="flex gap-2">
                      {user.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1 border-green-500 text-green-700 hover:bg-green-50"
                            onClick={() => handleClearFlag(user.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Clear Flag</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                            onClick={() => handleMarkReviewed(user.id)}
                          >
                            <Clock className="h-4 w-4" />
                            <span>Mark Reviewed</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1 border-red-500 text-red-700 hover:bg-red-50"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Suspend User</span>
                          </Button>
                        </>
                      )}
                      
                      {user.status === 'reviewed' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1 border-green-500 text-green-700 hover:bg-green-50"
                            onClick={() => handleClearFlag(user.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Clear Flag</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1 border-red-500 text-red-700 hover:bg-red-50"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Suspend User</span>
                          </Button>
                        </>
                      )}
                      
                      {user.status === 'cleared' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1 border-red-500 text-red-700 hover:bg-red-50"
                          onClick={() => handleSuspendUser(user.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Suspend User</span>
                        </Button>
                      )}
                      
                      {user.status === 'suspended' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1 border-green-500 text-green-700 hover:bg-green-50"
                          onClick={() => handleClearFlag(user.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Reinstate User</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <div className="space-y-4">
            {flaggedUsers.filter(u => u.status === 'pending').map((user) => (
              // Same card component as above, but filtered
              <Card key={user.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskLevelColor(user.riskLevel)}>
                        {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)} Risk
                      </Badge>
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getFlagTypeIcon(user.flagType)}
                        <span>
                          {user.flagType.charAt(0).toUpperCase() + user.flagType.slice(1)}
                        </span>
                      </Badge>
                      <span className="text-sm text-gray-500">Flagged on {user.flagDate}</span>
                    </div>
                    <p className="text-sm font-medium">{user.flagReason}</p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Activity Summary</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.activitySummary}</p>
                  </div>
                  
                  {user.notes && user.notes.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Notes</div>
                      <ul className="space-y-1">
                        {user.notes.map((note, index) => (
                          <li key={index} className="flex text-sm text-gray-600 dark:text-gray-400">
                            <CornerDownRight className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <a href="#view-details">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </a>
                    </Button>
                    
                    <div className="flex gap-2">
                      {user.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1 border-green-500 text-green-700 hover:bg-green-50"
                            onClick={() => handleClearFlag(user.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Clear Flag</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                            onClick={() => handleMarkReviewed(user.id)}
                          >
                            <Clock className="h-4 w-4" />
                            <span>Mark Reviewed</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1 border-red-500 text-red-700 hover:bg-red-50"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Suspend User</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reviewed" className="mt-4">
          <div className="space-y-4">
            {flaggedUsers.filter(u => u.status === 'reviewed').map((user) => (
              // Same card component as above, but filtered
              <Card key={user.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskLevelColor(user.riskLevel)}>
                        {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)} Risk
                      </Badge>
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getFlagTypeIcon(user.flagType)}
                        <span>
                          {user.flagType.charAt(0).toUpperCase() + user.flagType.slice(1)}
                        </span>
                      </Badge>
                      <span className="text-sm text-gray-500">Flagged on {user.flagDate}</span>
                    </div>
                    <p className="text-sm font-medium">{user.flagReason}</p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Activity Summary</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.activitySummary}</p>
                  </div>
                  
                  {user.notes && user.notes.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Notes</div>
                      <ul className="space-y-1">
                        {user.notes.map((note, index) => (
                          <li key={index} className="flex text-sm text-gray-600 dark:text-gray-400">
                            <CornerDownRight className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <a href="#view-details">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </a>
                    </Button>
                    
                    <div className="flex gap-2">
                      {user.status === 'reviewed' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1 border-green-500 text-green-700 hover:bg-green-50"
                            onClick={() => handleClearFlag(user.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Clear Flag</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1 border-red-500 text-red-700 hover:bg-red-50"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Suspend User</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cleared" className="mt-4">
          <div className="space-y-4">
            {flaggedUsers.filter(u => u.status === 'cleared').map((user) => (
              // Same card component as above, but filtered
              <Card key={user.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskLevelColor(user.riskLevel)}>
                        {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)} Risk
                      </Badge>
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getFlagTypeIcon(user.flagType)}
                        <span>
                          {user.flagType.charAt(0).toUpperCase() + user.flagType.slice(1)}
                        </span>
                      </Badge>
                      <span className="text-sm text-gray-500">Flagged on {user.flagDate}</span>
                    </div>
                    <p className="text-sm font-medium">{user.flagReason}</p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Activity Summary</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.activitySummary}</p>
                  </div>
                  
                  {user.notes && user.notes.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Notes</div>
                      <ul className="space-y-1">
                        {user.notes.map((note, index) => (
                          <li key={index} className="flex text-sm text-gray-600 dark:text-gray-400">
                            <CornerDownRight className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <a href="#view-details">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </a>
                    </Button>
                    
                    <div className="flex gap-2">
                      {user.status === 'cleared' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1 border-red-500 text-red-700 hover:bg-red-50"
                          onClick={() => handleSuspendUser(user.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Suspend User</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suspended" className="mt-4">
          <div className="space-y-4">
            {flaggedUsers.filter(u => u.status === 'suspended').map((user) => (
              // Same card component as above, but filtered
              <Card key={user.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskLevelColor(user.riskLevel)}>
                        {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)} Risk
                      </Badge>
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getFlagTypeIcon(user.flagType)}
                        <span>
                          {user.flagType.charAt(0).toUpperCase() + user.flagType.slice(1)}
                        </span>
                      </Badge>
                      <span className="text-sm text-gray-500">Flagged on {user.flagDate}</span>
                    </div>
                    <p className="text-sm font-medium">{user.flagReason}</p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Activity Summary</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.activitySummary}</p>
                  </div>
                  
                  {user.notes && user.notes.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Notes</div>
                      <ul className="space-y-1">
                        {user.notes.map((note, index) => (
                          <li key={index} className="flex text-sm text-gray-600 dark:text-gray-400">
                            <CornerDownRight className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-4 pt-3 border-t">
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <a href="#view-details">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </a>
                    </Button>
                    
                    <div className="flex gap-2">
                      {user.status === 'suspended' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1 border-green-500 text-green-700 hover:bg-green-50"
                          onClick={() => handleClearFlag(user.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Reinstate User</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
