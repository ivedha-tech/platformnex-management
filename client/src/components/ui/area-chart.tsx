import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from 'react';

export type TimeRange = 'daily' | 'weekly' | 'monthly';

interface AreaChartProps {
  title: string;
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  className?: string;
  timeRanges?: TimeRange[];
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number) => string;
  height?: number;
}

export function AreaChart({
  title,
  data,
  dataKey,
  xAxisKey = "name",
  color = "rgba(21, 101, 192, 1)",
  className,
  timeRanges = ["daily", "weekly", "monthly"],
  formatYAxis,
  formatTooltip,
  height = 300,
}: AreaChartProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>(timeRanges[0]);

  const handleRangeChange = (range: TimeRange) => {
    setActiveRange(range);
    // In a real app, this would fetch new data based on the range
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {timeRanges.length > 0 && (
          <div className="flex space-x-1">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={activeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => handleRangeChange(range)}
                className={cn(
                  "text-xs h-7",
                  activeRange === range 
                    ? "bg-primary text-white" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`colorGradient${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={formatYAxis}
                dx={-10}
              />
              <Tooltip 
                formatter={(value: number) => [
                  formatTooltip ? formatTooltip(value) : value,
                  title
                ]}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fillOpacity={1}
                fill={`url(#colorGradient${dataKey})`}
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
