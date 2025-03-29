
import { useState } from "react";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSoundFX } from "@/hooks/useSoundFX";
import { useTheme } from "@/contexts/ThemeContext";
import { Settings as SettingsIcon, Bell, Volume2, Shield, User, Lock, Save } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { toggleSound, soundEnabled } = useSoundFX();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <LayoutShell>
      <DashboardShell>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center">
              <SettingsIcon className="mr-2 h-8 w-8 text-blue-600 dark:text-[#3AA0FF]" />
              Settings
            </h1>
            <p className="text-gray-600 dark:text-[#8A9CCC]">Configure your account preferences</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card className="p-6 dark:bg-[#0C1221] border-gray-200 dark:border-[#1A2747]">
                <h3 className="text-xl font-semibold mb-6">General Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="theme" className="text-base font-medium">Dark Mode</Label>
                      <p className="text-sm text-gray-600 dark:text-[#8A9CCC]">Switch between light and dark theme</p>
                    </div>
                    <Switch 
                      id="theme" 
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound" className="text-base font-medium">Sound Effects</Label>
                      <p className="text-sm text-gray-600 dark:text-[#8A9CCC]">Enable interactive sound effects</p>
                    </div>
                    <Switch 
                      id="sound" 
                      checked={soundEnabled}
                      onCheckedChange={toggleSound}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics" className="text-base font-medium">Usage Analytics</Label>
                      <p className="text-sm text-gray-600 dark:text-[#8A9CCC]">Help us improve by sharing anonymous usage data</p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="p-6 dark:bg-[#0C1221] border-gray-200 dark:border-[#1A2747]">
                <h3 className="text-xl font-semibold mb-6">Notification Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifs" className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-[#8A9CCC]">Receive important updates via email</p>
                    </div>
                    <Switch id="email-notifs" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="price-alerts" className="text-base font-medium">Price Alerts</Label>
                      <p className="text-sm text-gray-600 dark:text-[#8A9CCC]">Get notified about significant price changes</p>
                    </div>
                    <Switch id="price-alerts" defaultChecked />
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="p-6 dark:bg-[#0C1221] border-gray-200 dark:border-[#1A2747]">
                <h3 className="text-xl font-semibold mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="2fa" className="text-base font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600 dark:text-[#8A9CCC]">Secure your account with an additional layer of protection</p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  <Button variant="outline" className="mt-2">
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card className="p-6 dark:bg-[#0C1221] border-gray-200 dark:border-[#1A2747]">
                <h3 className="text-xl font-semibold mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <div className="pt-4 border-t border-gray-200 dark:border-[#1A2747]">
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DashboardShell>
    </LayoutShell>
  );
};

export default Settings;
