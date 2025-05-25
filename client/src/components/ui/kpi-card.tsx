import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: string | number;
    label: string;
    isPositive?: boolean;
    isNegative?: boolean;
  };
  className?: string;
  valueClassName?: string;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-500",
  trend,
  className,
  valueClassName,
}: KpiCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          <div className="text-sm text-gray-500">{title}</div>
          
          <div className="flex justify-between items-center">
            <div className={cn("text-3xl font-bold text-gray-900", valueClassName)}>
              {value}
            </div>
            
            {Icon && (
              <div className={cn("p-3 rounded-full", iconBgColor)}>
                <Icon className={cn("h-5 w-5", iconColor)} />
              </div>
            )}
          </div>
          
          {trend && (
            <div className="flex items-center">
              {trend.isPositive && (
                <ArrowUp className="h-4 w-4 mr-1 text-red-500" />
              )}
              {trend.isNegative && (
                <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
              )}
              <span 
                className={cn(
                  "text-sm",
                  trend.isPositive ? "text-red-500" : 
                  trend.isNegative ? "text-green-500" : "text-gray-500"
                )}
              >
                {trend.value} {trend.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}