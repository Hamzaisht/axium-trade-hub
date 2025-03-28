
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout";
import { AdminCreatorApplications } from "@/components/admin/AdminCreatorApplications";
import { AdminIPOApprovals } from "@/components/admin/AdminIPOApprovals";
import { AdminTopTraders } from "@/components/admin/AdminTopTraders";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { AdminPlatformControls } from "@/components/admin/AdminPlatformControls";
import { AdminFlaggedUsers } from "@/components/admin/AdminFlaggedUsers";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("applications");

  return (
    <ProtectedRoute requiredRole="admin">
      <Layout>
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-8">Admin Control Panel</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="ipo-approvals">IPO Approvals</TabsTrigger>
              <TabsTrigger value="top-traders">Top Traders</TabsTrigger>
              <TabsTrigger value="platform-controls">Platform Controls</TabsTrigger>
              <TabsTrigger value="flagged-users">Flagged Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="applications">
                <AdminCreatorApplications />
              </TabsContent>
              
              <TabsContent value="ipo-approvals">
                <AdminIPOApprovals />
              </TabsContent>
              
              <TabsContent value="top-traders">
                <AdminTopTraders />
              </TabsContent>
              
              <TabsContent value="platform-controls">
                <AdminPlatformControls />
              </TabsContent>
              
              <TabsContent value="flagged-users">
                <AdminFlaggedUsers />
              </TabsContent>
              
              <TabsContent value="analytics">
                <AdminAnalytics />
              </TabsContent>
              
              <TabsContent value="revenue">
                <AdminRevenue />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Admin;
