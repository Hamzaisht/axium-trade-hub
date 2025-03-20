
import { useState } from "react";
import { useIPO } from "@/contexts/IPOContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { IPO } from "@/utils/mockApi";

interface IPOFormProps {
  onSuccess?: () => void;
}

export const IPOForm = ({ onSuccess }: IPOFormProps) => {
  const { createIPO, isLoading } = useIPO();
  const [formData, setFormData] = useState<Partial<IPO>>({
    symbol: "",
    initialPrice: 10,
    totalSupply: 1000000,
    availableSupply: 250000,
    description: "",
    socialLinks: {
      twitter: "",
      instagram: "",
      youtube: ""
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("social.")) {
      const socialKey = name.split(".")[1] as "twitter" | "instagram" | "youtube";
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else if (name === "initialPrice" || name === "totalSupply" || name === "availableSupply") {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createIPO(formData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled in the context and displayed via toast
      console.error(error);
    }
  };

  return (
    <GlassCard className="w-full p-6">
      <h2 className="text-2xl font-bold mb-6">Launch Your Creator IPO</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="symbol">Token Symbol (3-5 letters)</Label>
            <Input
              id="symbol"
              name="symbol"
              placeholder="BTC"
              value={formData.symbol}
              onChange={handleChange}
              required
              maxLength={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initialPrice">Initial Token Price ($)</Label>
            <Input
              id="initialPrice"
              name="initialPrice"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="10.00"
              value={formData.initialPrice}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalSupply">Total Token Supply</Label>
            <Input
              id="totalSupply"
              name="totalSupply"
              type="number"
              min="1000"
              placeholder="1000000"
              value={formData.totalSupply}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="availableSupply">Available Supply for Public</Label>
            <Input
              id="availableSupply"
              name="availableSupply"
              type="number"
              min="100"
              placeholder="250000"
              value={formData.availableSupply}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Creator Description</Label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe yourself and your brand..."
            value={formData.description}
            onChange={handleChange}
            required
            className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Social Media Links</h3>
          
          <div className="space-y-2">
            <Label htmlFor="social.twitter">Twitter URL</Label>
            <Input
              id="social.twitter"
              name="social.twitter"
              placeholder="https://twitter.com/username"
              value={formData.socialLinks?.twitter}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="social.instagram">Instagram URL</Label>
            <Input
              id="social.instagram"
              name="social.instagram"
              placeholder="https://instagram.com/username"
              value={formData.socialLinks?.instagram}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="social.youtube">YouTube Channel</Label>
            <Input
              id="social.youtube"
              name="social.youtube"
              placeholder="https://youtube.com/c/channelname"
              value={formData.socialLinks?.youtube}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-axium-blue hover:bg-axium-blue/90"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Launch IPO"}
        </Button>
      </form>
    </GlassCard>
  );
};

export default IPOForm;
