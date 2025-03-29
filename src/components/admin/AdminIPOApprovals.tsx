
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  Users
} from "lucide-react";

// Define mock IPO data type
interface IPOApplication {
  id: string;
  creatorName: string;
  symbol: string;
  initialPrice: number;
  totalSupply: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  aiScore: number;
  riskFactors: string[];
}

export const AdminIPOApprovals = () => {
  // Mock data for IPO applications
  const [ipoApplications, setIpoApplications] = useState<IPOApplication[]>([
    {
      id: '1',
      creatorName: 'Emma Wilson',
      symbol: 'EWL',
      initialPrice: 12.50,
      totalSupply: 1000000,
      requestDate: '2023-11-15',
      status: 'pending',
      description: 'Fitness influencer with strong engagement and consistent revenue growth.',
      aiScore: 87,
      riskFactors: ['Limited business diversification']
    },
    {
      id: '2',
      creatorName: 'Tech Innovators',
      symbol: 'TIN',
      initialPrice: 25.00,
      totalSupply: 2500000,
      requestDate: '2023-11-13',
      status: 'pending',
      description: 'Tech review channel with 5M+ subscribers and expanding merchandise line.',
      aiScore: 92,
      riskFactors: []
    },
    {
      id: '3',
      creatorName: 'Mia Cooking',
      symbol: 'MCKG',
      initialPrice: 8.75,
      totalSupply: 1500000,
      requestDate: '2023-11-10',
      status: 'pending',
      description: 'Culinary content creator with cookbook deal and growing subscription service.',
      aiScore: 78,
      riskFactors: ['Seasonal revenue fluctuation', 'High production costs']
    },
    {
      id: '4',
      creatorName: 'Global Explorers',
      symbol: 'GEXP',
      initialPrice: 15.00,
      totalSupply: 1200000,
      requestDate: '2023-11-08',
      status: 'pending',
      description: 'Travel documentarians with brand partnerships and premium content service.',
      aiScore: 65,
      riskFactors: ['Travel restrictions impact', 'High operating expenses', 'Revenue volatility']
    }
  ]);

  const handleApprove = (id: string) => {
    setIpoApplications(ipoApplications.map(ipo => 
      ipo.id === id ? {...ipo, status: 'approved'} : ipo
    ));
    toast.success('IPO approved and scheduled for launch');
  };

  const handleReject = (id: string) => {
    setIpoApplications(ipoApplications.map(ipo => 
      ipo.id === id ? {...ipo, status: 'rejected'} : ipo
    ));
    toast.success('IPO application rejected');
  };

  const getRiskLevel = (aiScore: number, riskFactors: string[]) => {
    if (aiScore >= 85) return 'Low';
    if (aiScore >= 70) return 'Moderate';
    if (aiScore >= 50) return 'High';
    return 'Very High';
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'Low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'High':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'Very High':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">IPO Applications</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            Pending: {ipoApplications.filter(ipo => ipo.status === 'pending').length}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved: {ipoApplications.filter(ipo => ipo.status === 'approved').length}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected: {ipoApplications.filter(ipo => ipo.status === 'rejected').length}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {ipoApplications.map((ipo) => {
          const riskLevel = getRiskLevel(ipo.aiScore, ipo.riskFactors);
          const riskBadgeColor = getRiskBadgeColor(riskLevel);
          
          return (
            <Card key={ipo.id} className={`overflow-hidden ${
              ipo.status === 'approved' ? 'border-green-300' : 
              ipo.status === 'rejected' ? 'border-red-300' : ''
            }`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      {ipo.creatorName} 
                      <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                        ${ipo.symbol}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-500">Submitted on {ipo.requestDate}</p>
                  </div>
                  <Badge 
                    className={`${
                      ipo.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                      ipo.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                      'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                    }`}
                  >
                    {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <div className="flex items-center mb-1">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium">Initial Price</span>
                    </div>
                    <p className="text-xl font-bold">${ipo.initialPrice.toFixed(2)}</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <div className="flex items-center mb-1">
                      <Users className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium">Total Supply</span>
                    </div>
                    <p className="text-xl font-bold">{ipo.totalSupply.toLocaleString()}</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium">Risk Assessment</span>
                      </div>
                      <Badge className={riskBadgeColor}>{riskLevel}</Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>AI Score:</span>
                        <span className="font-medium">{ipo.aiScore}/100</span>
                      </div>
                      <Slider
                        defaultValue={[ipo.aiScore]}
                        max={100}
                        step={1}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ipo.description}
                    </p>
                  </div>
                  
                  {ipo.riskFactors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Risk Factors</h4>
                      <div className="flex flex-wrap gap-2">
                        {ipo.riskFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2 pt-0">
                {ipo.status === 'pending' ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
                      onClick={() => handleApprove(ipo.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-500 text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(ipo.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIpoApplications(ipoApplications.map(app => 
                      app.id === ipo.id ? {...app, status: 'pending'} : app
                    ))}
                  >
                    Reset Status
                  </Button>
                )}
                <Button variant="outline" className="flex gap-1">
                  <span>View Details</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
