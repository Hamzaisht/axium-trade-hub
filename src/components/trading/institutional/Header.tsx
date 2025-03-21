
import { Building2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  isInstitutional: boolean;
}

export const Header = ({ isInstitutional }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold flex items-center">
        <Building2 className="h-5 w-5 mr-2 text-axium-blue" />
        Axium Pro
        <Badge 
          variant="default" 
          className="ml-2 text-xs bg-axium-blue"
        >
          Institutional
        </Badge>
      </h2>
      
      {!isInstitutional && (
        <Badge variant="outline" className="text-xs">
          <Lock className="h-3 w-3 mr-1" />
          Restricted Access
        </Badge>
      )}
    </div>
  );
};
