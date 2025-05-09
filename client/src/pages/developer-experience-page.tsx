import { DashboardLayout } from "@/layouts/dashboard-layout";
import { MetricCard } from "@/components/ui/metric-card";
import { AreaChart } from "@/components/ui/area-chart";
import { DonutChart } from "@/components/ui/donut-chart";
import { FeedbackItem } from "@/components/ui/feedback-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Feedback, DeveloperMetric } from "@shared/schema";

// Sample data for the platform usage chart
const platformUsageData = [
  { name: "Mon", developers: 120 },
  { name: "Tue", developers: 150 },
  { name: "Wed", developers: 170 },
  { name: "Thu", developers: 140 },
  { name: "Fri", developers: 130 },
  { name: "Sat", developers: 80 },
  { name: "Sun", developers: 60 },
];

// Sample data for task distribution
const taskDistributionData = [
  { name: "CI/CD Pipeline", value: 65, color: "#1565C0" },
  { name: "API Creation", value: 15, color: "#0097A7" },
  { name: "Other Tasks", value: 20, color: "#FFA000" },
];

export default function DeveloperExperiencePage() {
  const [timeRange, setTimeRange] = useState("7days");
  
  // Fetch metrics data
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery<DeveloperMetric[]>({
    queryKey: ["/api/metrics/developer"],
  });
  
  // Fetch feedback data
  const { data: feedbackItems, isLoading: isLoadingFeedback } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
  });
  
  return (
    <DashboardLayout title="Developer Experience">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Developer Experience</h2>
          <p className="text-sm text-gray-500 mt-1">Tracking platform engagement and developer satisfaction</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Select 
            value={timeRange} 
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last quarter</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Key metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6 mb-6">
        <MetricCard
          title="Developer Satisfaction"
          value={89}
          previousValue="85/100"
          percentageChange={4}
          progress={89}
          suffix="/100"
          className="xl:col-span-1"
        />
        
        <MetricCard
          title="Daily Active Developers"
          value={124}
          percentageChange={12}
          progress={83}
          target={150}
          className="xl:col-span-1"
        />
        
        <MetricCard
          title="Task Completion Rate"
          value="92%"
          previousValue="94%"
          percentageChange={-2}
          progress={92}
          className="xl:col-span-1"
        />
        
        <MetricCard
          title="Avg. Response Time"
          value={1.8}
          suffix="seconds"
          percentageChange={8}
          progress={95}
          progressColor="bg-emerald-500"
          target="2 Secs"
          className="xl:col-span-1"
        />
        
        <MetricCard
          title="Platform Adoption Rate"
          value="78%"
          percentageChange={6}
          progress={78}
          className="xl:col-span-1"
        />
        
        <MetricCard
          title="Golden Path Usage Rate"
          value="65%"
          percentageChange={12}
          progress={65}
          className="xl:col-span-1"
        />
        
        <MetricCard
          title="Developer Retention on Platform"
          value="94%"
          previousValue="91%"
          percentageChange={3}
          progress={94}
          progressColor="bg-emerald-500"
          className="xl:col-span-1"
        />
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AreaChart
          title="Platform Usage Trends"
          data={platformUsageData}
          dataKey="developers"
          className="col-span-2"
          timeRanges={["daily", "weekly", "monthly"]}
        />
        
        <DonutChart
          title="Task Distribution"
          data={taskDistributionData}
        />
      </div>
      
      {/* Recent Feedback */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium text-gray-900">Recent Feedback</CardTitle>
            <Button variant="link" className="text-sm font-medium text-primary-600 hover:text-primary-700 p-0">
              View all
            </Button>
          </div>
        </CardHeader>
        
        <div className="divide-y divide-gray-100">
          {isLoadingFeedback ? (
            <div className="p-8 text-center text-gray-500">Loading feedback...</div>
          ) : feedbackItems && feedbackItems.length > 0 ? (
            feedbackItems.map((item, index) => (
              <FeedbackItem
                key={index}
                name={`User ${item.userId}`}
                initials={`U${item.userId}`}
                rating={item.rating}
                time={new Date(item.date).toLocaleString()}
                comment={item.comment}
                category={item.category}
                categoryColor={
                  item.category === "CI/CD Pipeline" 
                    ? "bg-primary-100 text-primary-800" 
                    : item.category === "API Creation"
                      ? "bg-cyan-100 text-cyan-800"
                      : "bg-amber-100 text-amber-800"
                }
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No feedback available</div>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}
