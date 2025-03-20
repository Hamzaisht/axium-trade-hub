
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

interface AuthFormProps {
  mode: "login" | "register";
  onSuccess?: () => void;
}

export const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
  const { login, register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "investor" as "investor" | "creator"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await register(
          {
            name: formData.name,
            email: formData.email,
            role: formData.role as "investor" | "creator"
          },
          formData.password
        );
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled in the context and displayed via toast
      console.error(error);
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="investor">Investor</option>
              <option value="creator">Creator</option>
            </select>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-axium-blue hover:bg-axium-blue/90"
          disabled={isLoading}
        >
          {isLoading
            ? "Loading..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </Button>
      </form>
    </GlassCard>
  );
};

export default AuthForm;
