
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

const glassCardVariants = cva(
  "relative overflow-hidden transition-all duration-300 backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "glass-card hover:shadow-glass-strong",
        premium: "premium-card hover:shadow-glass-strong",
        blue: "bg-gradient-to-b from-axium-blue/5 to-axium-blue/10 border border-axium-blue/20 shadow-glass-blue hover:shadow-glass-strong text-axium-blue-dark",
        dark: "glass-card-dark text-white",
      },
      size: {
        sm: "p-3 rounded-md",
        md: "p-4 rounded-lg", 
        lg: "p-6 rounded-lg",
        xl: "p-8 rounded-xl",
      },
      interactive: {
        true: "hover:translate-y-[-2px] cursor-pointer",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
    },
  }
);

export interface GlassCardProps 
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassCardVariants({ variant, size, interactive }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard, glassCardVariants };
