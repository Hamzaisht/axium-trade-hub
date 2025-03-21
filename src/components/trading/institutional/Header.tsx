
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Network, LockKeyhole, Users } from "lucide-react";

export const Header = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      <div className="flex items-center mb-2 md:mb-0">
        <Building2 className="h-5 w-5 text-axium-blue mr-2" />
        <h2 className="text-xl font-semibold text-axium-gray-900">Institutional Trading</h2>
        <Badge variant="outline" className="ml-3 bg-axium-blue text-white">Pro</Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8">
          <Network className="h-4 w-4 mr-1" />
          API Docs
        </Button>
        <Button variant="outline" size="sm" className="h-8">
          <LockKeyhole className="h-4 w-4 mr-1" />
          Access Controls
        </Button>
        <Button variant="outline" size="sm" className="h-8">
          <Users className="h-4 w-4 mr-1" />
          LP Program
        </Button>
      </div>
    </div>
  );
};
