
import { ReactNode } from "react";
import { PriceTickerScroll } from "@/components/market/PriceTickerScroll";
import { LiveChart } from "@/components/market/LiveChart";
import { MarketFeed } from "@/components/market/MarketFeed";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-axium-gray-100/30">
      <PriceTickerScroll className="mb-4 -mx-6" />
      
      <div className="flex-1 px-4 md:px-6">
        {children}
      </div>
    </div>
  );
}
