import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Calendar, Download, Filter, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface ActivityLogItemProps {
  action: string;
  resource: string;
  user: string;
  timestamp: string;
  status: "Success" | "Failed" | "In Progress";
  details?: string;
}

function ActivityLogItem({ action, resource, user, timestamp, status, details }: ActivityLogItemProps) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div>
            <Badge
              variant="outline"
              className={cn(
                "font-normal",
                status === "Success" && "bg-green-50 text-green-700 hover:bg-green-50",
                status === "Failed" && "bg-red-50 text-red-700 hover:bg-red-50",
                status === "In Progress" && "bg-amber-50 text-amber-700 hover:bg-amber-50"
              )}
            >
              {status}
            </Badge>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              <span className="text-primary-700">{action}</span> {resource}
            </p>
            <p className="text-sm text-gray-500">
              By {user} • {timestamp}
            </p>
          </div>
        </div>
        {details && (
          <p className="text-sm text-gray-600 pl-12">{details}</p>
        )}
      </div>
    </div>
  );
}

export default function ActivityHistoryPage() {
  // Fetch activity logs
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: ["/api/activity"],
  });
  
  return (
    <DashboardLayout title="Activity History">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Activity History</h2>
        <p className="text-sm text-gray-500 mt-1">
          Track all platform activity and user interactions
        </p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search activity logs..." 
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Date Range</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-details" />
                  <label htmlFor="show-details" className="text-sm cursor-pointer">
                    Show Details
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-0 divide-y divide-gray-100">
              {isLoading ? (
                <div className="py-12 text-center text-gray-500">Loading activity logs...</div>
              ) : activityLogs?.length > 0 ? (
                activityLogs.map((log: any, index: number) => (
                  <ActivityLogItem
                    key={index}
                    action={log.action}
                    resource={log.resource}
                    user="Admin User"
                    timestamp={format(new Date(log.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    status={log.status as "Success" | "Failed" | "In Progress"}
                    details={log.details}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-gray-500">No activity logs found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tabs would have similar content but filtered */}
        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Template Activity</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox id="show-details-templates" />
                  <label htmlFor="show-details-templates" className="text-sm cursor-pointer">
                    Show Details
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-0 divide-y divide-gray-100">
              {isLoading ? (
                <div className="py-12 text-center text-gray-500">Loading activity logs...</div>
              ) : activityLogs?.filter((log: any) => log.resource === "Template").length > 0 ? (
                activityLogs
                  .filter((log: any) => log.resource === "Template")
                  .map((log: any, index: number) => (
                    <ActivityLogItem
                      key={index}
                      action={log.action}
                      resource={log.resource}
                      user="Admin User"
                      timestamp={format(new Date(log.timestamp), "MMM d, yyyy 'at' h:mm a")}
                      status={log.status as "Success" | "Failed" | "In Progress"}
                      details={log.details}
                    />
                  ))
              ) : (
                <div className="py-12 text-center text-gray-500">No template activity logs found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tab contents would be similar */}
        <TabsContent value="configuration" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <CardTitle className="text-lg">Configuration Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center text-gray-500">
              Configuration logs would be filtered here
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deployment" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <CardTitle className="text-lg">Deployment Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center text-gray-500">
              Deployment logs would be filtered here
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-gray-100">
              <CardTitle className="text-lg">User Management Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center text-gray-500">
              User management logs would be filtered here
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
