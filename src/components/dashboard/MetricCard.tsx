
import React from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconBackground?: string;
  iconColor?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  iconBackground = "bg-axium-blue/10",
  iconColor = "text-axium-blue"
}: MetricCardProps) => {
  return (
    <GlassCard className="sm:col-span-1">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-full ${iconBackground}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-axium-gray-600 text-sm">{subtitle}</p>
    </GlassCard>
  );
};
