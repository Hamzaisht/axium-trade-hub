
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink
} from "lucide-react";

// Define mock application data type
interface CreatorApplication {
  id: string;
  name: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  followers: number;
  platform: string;
  description: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  image?: string;
}

export const AdminCreatorApplications = () => {
  // Mock data for creator applications
  const [applications, setApplications] = useState<CreatorApplication[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      date: '2023-11-14',
      status: 'pending',
      followers: 1200000,
      platform: 'YouTube',
      description: 'Tech reviewer with over 1.2M subscribers focused on smartphone and gadget reviews.',
      socialLinks: {
        youtube: 'alexjohnsontech',
        twitter: 'alexjtech',
        instagram: 'alexjohnsontech'
      },
      image: 'https://i.pravatar.cc/150?u=alex'
    },
    {
      id: '2',
      name: 'Sophia Chen',
      email: 'sophia@example.com',
      date: '2023-11-12',
      status: 'pending',
      followers: 850000,
      platform: 'Instagram',
      description: 'Fashion influencer and designer with a growing presence across multiple platforms.',
      socialLinks: {
        instagram: 'sophiastyle',
        twitter: 'sophiachen'
      },
      image: 'https://i.pravatar.cc/150?u=sophia'
    },
    {
      id: '3',
      name: 'Marcus Webb',
      email: 'marcus@example.com',
      date: '2023-11-10',
      status: 'pending',
      followers: 3500000,
      platform: 'TikTok',
      description: 'Comedy creator with viral short-form content and expanding into long-form video.',
      socialLinks: {
        instagram: 'marcuswebb',
        twitter: 'marcuswebbcomedy',
        youtube: 'marcuswebbofficial'
      },
      image: 'https://i.pravatar.cc/150?u=marcus'
    }
  ]);

  const handleApprove = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? {...app, status: 'approved'} : app
    ));
    toast.success('Creator application approved');
  };

  const handleReject = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? {...app, status: 'rejected'} : app
    ));
    toast.success('Creator application rejected');
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Creator Applications</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            Pending: {applications.filter(app => app.status === 'pending').length}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved: {applications.filter(app => app.status === 'approved').length}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected: {applications.filter(app => app.status === 'rejected').length}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {applications.map((application) => (
          <Card key={application.id} className={`overflow-hidden ${
            application.status === 'approved' ? 'border-green-300' : 
            application.status === 'rejected' ? 'border-red-300' : ''
          }`}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={application.image} alt={application.name} />
                    <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{application.name}</CardTitle>
                    <CardDescription className="text-xs">{application.email}</CardDescription>
                  </div>
                </div>
                <Badge 
                  className={`${
                    application.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                    application.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                  }`}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <div className="mb-3">
                <div className="text-sm font-medium mb-1">Platform & Audience</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{application.platform}</Badge>
                  <Badge variant="outline">{formatFollowers(application.followers)} followers</Badge>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm font-medium mb-1">Social Links</div>
                <div className="flex gap-2">
                  {application.socialLinks.instagram && (
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                      <a href={`https://instagram.com/${application.socialLinks.instagram}`} target="_blank" rel="noreferrer">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {application.socialLinks.twitter && (
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                      <a href={`https://twitter.com/${application.socialLinks.twitter}`} target="_blank" rel="noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {application.socialLinks.youtube && (
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                      <a href={`https://youtube.com/${application.socialLinks.youtube}`} target="_blank" rel="noreferrer">
                        <Youtube className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Description</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {application.description}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2 pt-0">
              {application.status === 'pending' ? (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
                    onClick={() => handleApprove(application.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-500 text-red-700 hover:bg-red-50"
                    onClick={() => handleReject(application.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setApplications(applications.map(app => 
                    app.id === application.id ? {...app, status: 'pending'} : app
                  ))}
                >
                  Reset Status
                </Button>
              )}
              <Button variant="outline" size="icon" className="h-9 w-9">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
