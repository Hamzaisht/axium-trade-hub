
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { TermsConsent } from "./TermsConsent";

interface AuthFormProps {
  mode: "login" | "register";
  onSuccess?: () => void;
}

export const AuthForm = ({ mode, onSuccess }: AuthFormProps) => {
  const { login, register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "investor" as "investor" | "creator"
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""
  });

  // Reset errors when changing modes
  useEffect(() => {
    setError(null);
    setFormErrors({
      name: "",
      email: "",
      password: "",
      terms: ""
    });
  }, [mode]);

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      terms: ""
    };
    let isValid = true;

    // Validate name (only in register mode)
    if (mode === "register" && !formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (mode === "register" && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    // Validate terms (only in register mode)
    if (mode === "register" && !agreedToTerms) {
      errors.terms = "You must agree to the terms and conditions";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Clear general error
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!validateForm()) return;
    
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
      setError(error instanceof Error ? error.message : 'Authentication failed');
      console.error(error);
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === "login" ? "Sign In" : "Create Account"}
      </h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
              className={`bg-white/80 ${formErrors.name ? "border-red-500" : ""}`}
              disabled={isLoading}
              autoComplete="name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
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
            className={`bg-white/80 ${formErrors.email ? "border-red-500" : ""}`}
            disabled={isLoading}
            autoComplete={mode === "login" ? "username" : "email"}
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`bg-white/80 pr-10 ${formErrors.password ? "border-red-500" : ""}`}
              disabled={isLoading}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-axium-gray-500"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
          
          {mode === "register" && (
            <PasswordStrengthIndicator password={formData.password} />
          )}
        </div>
        
        {mode === "register" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-white/80 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="investor">Investor</option>
                <option value="creator">Creator</option>
              </select>
            </div>
            
            <TermsConsent 
              checked={agreedToTerms} 
              onChange={setAgreedToTerms} 
            />
            {formErrors.terms && (
              <p className="text-red-500 text-sm">{formErrors.terms}</p>
            )}
          </>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-axium-blue hover:bg-axium-blue/90 mt-6"
          disabled={isLoading || (mode === "register" && !agreedToTerms)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "login" ? "Signing In..." : "Creating Account..."}
            </>
          ) : (
            mode === "login" ? "Sign In" : "Create Account"
          )}
        </Button>
      </form>
    </GlassCard>
  );
};

export default AuthForm;
