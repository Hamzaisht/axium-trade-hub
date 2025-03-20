
import React from "react";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  // Calculate password strength
  const getStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "No password", color: "bg-gray-200" };
    
    let strength = 0;
    const rules = [
      /[a-z]/, // has lowercase
      /[A-Z]/, // has uppercase
      /[0-9]/, // has number
      /[^a-zA-Z0-9]/, // has special char
    ];
    
    // Add strength for password length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Add strength for each rule matched
    rules.forEach(rule => {
      if (rule.test(password)) strength += 1;
    });
    
    // Map strength to color and label
    const strengthMap = [
      { strength: 0, label: "Very weak", color: "bg-red-500" },
      { strength: 2, label: "Weak", color: "bg-red-500" },
      { strength: 4, label: "Medium", color: "bg-yellow-500" },
      { strength: 5, label: "Strong", color: "bg-green-500" },
      { strength: 6, label: "Very strong", color: "bg-green-600" }
    ];
    
    const result = strengthMap.findLast(s => strength >= s.strength) || strengthMap[0];
    return { ...result, strength: (strength / 6) * 100 };
  };
  
  const { strength, label, color } = getStrength(password);
  
  return (
    <div className="space-y-1 mt-1">
      <div className="flex justify-between text-xs">
        <span>Password strength:</span>
        <span 
          className={strength > 50 
            ? "text-green-600 font-medium" 
            : strength > 30 
              ? "text-yellow-600 font-medium" 
              : "text-red-600 font-medium"
          }
        >
          {label}
        </span>
      </div>
      <Progress 
        value={strength} 
        className="h-1.5" 
        indicatorClassName={color}
      />
      {password && strength < 50 && (
        <ul className="text-xs text-axium-gray-600 mt-1 list-disc pl-4">
          {password.length < 8 && <li>Use at least 8 characters</li>}
          {!/[A-Z]/.test(password) && <li>Include uppercase letters</li>}
          {!/[a-z]/.test(password) && <li>Include lowercase letters</li>}
          {!/[0-9]/.test(password) && <li>Include numbers</li>}
          {!/[^a-zA-Z0-9]/.test(password) && <li>Include special characters</li>}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
