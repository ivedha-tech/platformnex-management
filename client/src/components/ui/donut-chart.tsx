import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DonutChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  height?: number;
  tooltipFormatter?: (value: number) => string;
}

export function DonutChart({
  title,
  data,
  className,
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  height = 300,
  tooltipFormatter,
}: DonutChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const renderLegendContent = () => {
    return (
      <div className="space-y-2 mt-4">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">{entry.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {tooltipFormatter ? tooltipFormatter(entry.value) : entry.value}
              </span>
              <Badge variant="secondary" className="text-xs">
                {Math.round((entry.value / total) * 100)}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          <div style={{ height, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    tooltipFormatter ? tooltipFormatter(value) : value,
                    "Value",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {showLegend && renderLegendContent()}
        </div>
      </CardContent>
    </Card>
  );
}
