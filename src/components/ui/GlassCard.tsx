
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

const glassCardVariants = cva(
  "relative overflow-hidden transition-all duration-300 backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "bg-[#0D1424]/80 border border-[#1E375F]/50 shadow-lg hover:shadow-xl",
        premium: "bg-gradient-to-b from-[#0D1424]/90 to-[#0D1424]/70 border border-[#1E375F]/60 shadow-lg hover:shadow-xl",
        blue: "bg-gradient-to-b from-[#162A54]/80 to-[#162A54]/60 border border-[#3676FF]/30 shadow-[0_0_15px_rgba(54,118,255,0.15)] hover:shadow-[0_0_25px_rgba(54,118,255,0.25)]",
        dark: "bg-[#080B14]/90 border border-[#1E375F]/40 text-white shadow-lg hover:shadow-xl",
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
