import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  suffix?: string;
  percentageChange?: number;
  progress?: number;
  target?: string | number;
  progressColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  previousValue,
  suffix,
  percentageChange,
  progress,
  target,
  progressColor = "bg-primary",
  className,
}: MetricCardProps) {
  const isPositiveChange = percentageChange && percentageChange > 0;
  
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          {percentageChange !== undefined && (
            <span className={cn(
              "flex items-center text-xs",
              isPositiveChange ? "text-emerald-600" : "text-red-600"
            )}>
              {isPositiveChange ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              <span>{Math.abs(percentageChange)}%</span>
            </span>
          )}
        </div>
        
        <div className="flex items-end">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {suffix && (
            <div className="ml-1 text-sm text-gray-500 mb-1">{suffix}</div>
          )}
        </div>
        
        {(previousValue || progress !== undefined) && (
          <div className="mt-4">
            {previousValue && (
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">
                  Previous: {previousValue}
                  {suffix && suffix}
                </span>
              </div>
            )}
            
            {target !== undefined && (
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">
                  Target: {target}
                </span>
                {progress !== undefined && (
                  <span className="text-xs font-medium text-gray-700">
                    {progress}%
                  </span>
                )}
              </div>
            )}
            
            {progress !== undefined && (
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full", progressColor)}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
