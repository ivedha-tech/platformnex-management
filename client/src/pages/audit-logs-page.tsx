import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Download, 
  Eye, 
  Filter, 
  Info, 
  RefreshCw, 
  Search, 
  Shield, 
  Trash, 
  User, 
  X
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Event type definition
interface AuditEvent {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: "success" | "failure" | "warning";
  ipAddress: string;
  details?: string;
  resourceType: string;
}

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<number[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("24h");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Sample audit log data
  const auditLogs: AuditEvent[] = [
    {
      id: 1,
      timestamp: "2023-09-20T10:23:15Z",
      user: "admin",
      action: "login",
      resource: "web-portal",
      status: "success",
      ipAddress: "192.168.1.100",
      resourceType: "auth",
    },
    {
      id: 2,
      timestamp: "2023-09-20T09:45:22Z",
      user: "john.smith",
      action: "create",
      resource: "template:ci-cd-pipeline",
      status: "success",
      ipAddress: "192.168.1.101",
      details: "Created new CI/CD pipeline template for microservices",
      resourceType: "template",
    },
    {
      id: 3,
      timestamp: "2023-09-20T08:30:10Z",
      user: "jane.doe",
      action: "update",
      resource: "policy:password-complexity",
      status: "success",
      ipAddress: "192.168.1.102",
      details: "Updated password complexity requirements to include special characters",
      resourceType: "policy",
    },
    {
      id: 4,
      timestamp: "2023-09-19T16:45:33Z",
      user: "system",
      action: "backup",
      resource: "database:production",
      status: "success",
      ipAddress: "10.0.0.5",
      resourceType: "system",
    },
    {
      id: 5,
      timestamp: "2023-09-19T14:22:18Z",
      user: "admin",
      action: "delete",
      resource: "user:test-account",
      status: "success",
      ipAddress: "192.168.1.100",
      details: "Removed test user account after testing phase",
      resourceType: "user",
    },
    {
      id: 6,
      timestamp: "2023-09-19T11:05:40Z",
      user: "john.smith",
      action: "deploy",
      resource: "service:api-gateway",
      status: "failure",
      ipAddress: "192.168.1.101",
      details: "Deployment failed due to insufficient resources in the cluster",
      resourceType: "deployment",
    },
    {
      id: 7,
      timestamp: "2023-09-18T17:30:12Z",
      user: "security-scanner",
      action: "scan",
      resource: "container:frontend-app",
      status: "warning",
      ipAddress: "10.0.0.10",
      details: "Security scan detected 3 medium severity vulnerabilities in dependencies",
      resourceType: "security",
    },
    {
      id: 8,
      timestamp: "2023-09-18T15:10:05Z",
      user: "admin",
      action: "update",
      resource: "orchestrator:production-k8s",
      status: "success",
      ipAddress: "192.168.1.100",
      details: "Updated Kubernetes orchestrator configuration for autoscaling",
      resourceType: "config",
    },
    {
      id: 9,
      timestamp: "2023-09-18T10:45:30Z",
      user: "jane.doe",
      action: "access",
      resource: "data:customer-records",
      status: "success",
      ipAddress: "192.168.1.102",
      resourceType: "data",
    },
    {
      id: 10,
      timestamp: "2023-09-17T14:20:15Z",
      user: "john.smith",
      action: "login",
      resource: "web-portal",
      status: "failure",
      ipAddress: "203.0.113.42",
      details: "Failed login attempt - incorrect password (3rd attempt)",
      resourceType: "auth",
    },
  ];
  
  // Filter logs based on search query and selected category
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchQuery
      ? log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    const matchesCategory = selectedCategory === "all" || log.resourceType === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const toggleEventExpansion = (eventId: number) => {
    setExpandedEvents(prevExpanded => {
      if (prevExpanded.includes(eventId)) {
        return prevExpanded.filter(id => id !== eventId);
      } else {
        return [...prevExpanded, eventId];
      }
    });
  };
  
  const viewEventDetails = (event: AuditEvent) => {
    setSelectedEvent(event);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="h-5 w-5 text-emerald-500" />;
      case "failure":
        return <X className="h-5 w-5 text-red-500" />;
      case "warning":
        return <Info className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-100 text-emerald-800">Success</Badge>;
      case "failure":
        return <Badge className="bg-red-100 text-red-800">Failure</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "login":
        return <User className="h-4 w-4 mr-2" />;
      case "create":
        return <Plus className="h-4 w-4 mr-2" />;
      case "update":
        return <RefreshCw className="h-4 w-4 mr-2" />;
      case "delete":
        return <Trash className="h-4 w-4 mr-2" />;
      case "access":
        return <Eye className="h-4 w-4 mr-2" />;
      case "scan":
        return <Shield className="h-4 w-4 mr-2" />;
      default:
        return <Clock className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <DashboardLayout title="Audit Logs">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Audit Logs</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review system and user activity logs for security and compliance
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{auditLogs.length}</div>
            <p className="text-sm text-gray-500 mt-1">Past 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {auditLogs.filter(log => log.resourceType === "security").length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Past 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {auditLogs.filter(log => log.action === "login").length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Login attempts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Failed Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {auditLogs.filter(log => log.status === "failure").length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search audit logs..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            defaultValue={selectedPeriod}
            onValueChange={setSelectedPeriod}
          >
            <SelectTrigger className="w-[120px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            defaultValue={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="user">User Management</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
              <SelectItem value="policy">Policies</SelectItem>
              <SelectItem value="config">Configuration</SelectItem>
              <SelectItem value="deployment">Deployments</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="changes">Changes</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={cn("lg:col-span-2", selectedEvent ? "" : "lg:col-span-3")}>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Recent actions performed by users and systems
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left font-medium text-sm px-6 py-3">Timestamp</th>
                    <th className="text-left font-medium text-sm px-6 py-3">User</th>
                    <th className="text-left font-medium text-sm px-6 py-3">Action</th>
                    <th className="text-left font-medium text-sm px-6 py-3">Resource</th>
                    <th className="text-left font-medium text-sm px-6 py-3">Status</th>
                    <th className="text-right font-medium text-sm px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr 
                        key={log.id} 
                        className={cn(
                          "hover:bg-gray-50",
                          expandedEvents.includes(log.id) && "bg-gray-50"
                        )}
                      >
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{log.user}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getActionIcon(log.action)}
                            <span className="capitalize">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {log.resource}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(log.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => toggleEventExpansion(log.id)}
                            >
                              {expandedEvents.includes(log.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => viewEventDetails(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No audit logs found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {selectedEvent && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Event Details</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {selectedEvent.action.charAt(0).toUpperCase() + selectedEvent.action.slice(1)}
                  </h3>
                  {getStatusIcon(selectedEvent.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-gray-500">Timestamp</div>
                  <div className="font-medium">
                    {format(new Date(selectedEvent.timestamp), "MMM d, yyyy HH:mm:ss")}
                  </div>
                  
                  <div className="text-gray-500">User</div>
                  <div className="font-medium">{selectedEvent.user}</div>
                  
                  <div className="text-gray-500">IP Address</div>
                  <div className="font-medium">{selectedEvent.ipAddress}</div>
                  
                  <div className="text-gray-500">Resource</div>
                  <div className="font-medium">{selectedEvent.resource}</div>
                  
                  <div className="text-gray-500">Status</div>
                  <div className="font-medium capitalize">{selectedEvent.status}</div>
                  
                  <div className="text-gray-500">Resource Type</div>
                  <div className="font-medium capitalize">{selectedEvent.resourceType}</div>
                </div>
                
                {selectedEvent.details && (
                  <div className="pt-2">
                    <div className="text-gray-500 mb-1 text-sm">Details</div>
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                      {selectedEvent.details}
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Related Events
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

// Extra component for Plus icon that wasn't explicitly imported
function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
