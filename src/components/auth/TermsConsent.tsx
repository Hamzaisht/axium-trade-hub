
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface TermsConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const TermsConsent = ({ checked, onChange }: TermsConsentProps) => {
  return (
    <div className="flex items-start space-x-2 mt-2">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={onChange}
        className="mt-1"
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-axium-gray-700"
        >
          I agree to the{" "}
          <Link to="/terms" className="text-axium-blue hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-axium-blue hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>
    </div>
  );
};

export default TermsConsent;
