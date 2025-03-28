
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/GlassCard";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search creators or symbols" 
}: SearchBarProps) => {
  return (
    <GlassCard className="p-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-axium-gray-500" />
        <Input 
          placeholder={placeholder} 
          className="pl-9 pr-3 py-2 bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </GlassCard>
  );
};
