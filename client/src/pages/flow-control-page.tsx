import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  AlertCircle, 
  ArrowDownUp, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Edit, 
  GitBranch, 
  GitMerge, 
  Plus, 
  Save, 
  Settings, 
  StopCircle, 
  XCircle
} from "lucide-react";
import { useState } from "react";

// FlowStage component for individual stages in the workflow
interface FlowStageProps {
  name: string;
  status: "completed" | "active" | "pending" | "failed";
  index: number;
  isLast?: boolean;
}

function FlowStage({ name, status, index, isLast = false }: FlowStageProps) {
  const getStatusColor = () => {
    switch (status) {
      case "completed": return "bg-green-500 text-white";
      case "active": return "bg-blue-500 text-white";
      case "pending": return "bg-gray-300 text-gray-700";
      case "failed": return "bg-red-500 text-white";
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5" />;
      case "active": return <Clock className="h-5 w-5 animate-pulse" />;
      case "pending": return <Clock className="h-5 w-5" />;
      case "failed": return <XCircle className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getStatusColor()}`}>
        {getStatusIcon()}
      </div>
      <div className="ml-4 flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500 capitalize">{status}</p>
      </div>
      {!isLast && (
        <div className="flex-1 mx-4">
          <div className="h-0.5 bg-gray-200 relative">
            <div 
              className={`absolute inset-0 ${status === "completed" ? "bg-green-500" : "bg-gray-200"}`}
              style={{ width: status === "completed" ? "100%" : "0%" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

// FlowCard component for workflow cards
interface FlowCardProps {
  title: string;
  description: string;
  status: "active" | "paused" | "completed" | "failed";
  lastRun: string;
  type: string;
}

function FlowCard({ title, description, status, lastRun, type }: FlowCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "active": 
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused": 
        return <Badge className="bg-amber-100 text-amber-800">Paused</Badge>;
      case "completed": 
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "failed": 
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="outline">{type}</Badge>
          {getStatusBadge()}
        </div>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-sm text-gray-500">
          Last run: {lastRun}
        </div>
      </CardContent>
      <div className="bg-gray-50 px-6 py-3 flex justify-between">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          Configure
        </Button>
        <Button size="sm" className="flex items-center gap-1">
          <ArrowRight className="h-4 w-4" />
          View Details
        </Button>
      </div>
    </Card>
  );
}

export default function FlowControlPage() {
  const [activeTab, setActiveTab] = useState("active");
  
  // Sample flow execution data
  const flowExecutions = [
    {
      id: 1,
      title: "CI/CD Pipeline for Frontend",
      description: "Automated build, test and deployment pipeline for the frontend application",
      status: "active" as const,
      lastRun: "Today, 10:23 AM",
      type: "CI/CD",
    },
    {
      id: 2,
      title: "API Gateway Deployment",
      description: "Flow for deploying updates to the API gateway including configuration validation",
      status: "completed" as const,
      lastRun: "Yesterday, 3:45 PM",
      type: "Deployment",
    },
    {
      id: 3,
      title: "Database Migration",
      description: "Controlled process for applying database schema updates with rollback capability",
      status: "paused" as const,
      lastRun: "Sep 15, 2023",
      type: "Migration",
    },
    {
      id: 4,
      title: "Security Scanning",
      description: "Automated security vulnerability scanning for container images",
      status: "failed" as const,
      lastRun: "Sep 12, 2023",
      type: "Security",
    },
    {
      id: 5,
      title: "Microservice Deployment",
      description: "Coordinated deployment of microservices with dependency management",
      status: "active" as const,
      lastRun: "Today, 9:10 AM",
      type: "Deployment",
    },
    {
      id: 6,
      title: "Data Backup Process",
      description: "Scheduled backup process for all production databases",
      status: "completed" as const,
      lastRun: "Today, 2:00 AM",
      type: "Backup",
    },
  ];
  
  // Selected flow details (would typically come from an API based on selection)
  const selectedFlow = {
    id: 1,
    title: "CI/CD Pipeline for Frontend",
    description: "Automated build, test and deployment pipeline for the frontend application",
    status: "active" as const,
    lastRun: "Today, 10:23 AM",
    stages: [
      { name: "Code Checkout", status: "completed" as const },
      { name: "Build", status: "completed" as const },
      { name: "Unit Tests", status: "completed" as const },
      { name: "Integration Tests", status: "active" as const },
      { name: "Security Scan", status: "pending" as const },
      { name: "Deploy to Staging", status: "pending" as const },
      { name: "UI Tests", status: "pending" as const },
      { name: "Deploy to Production", status: "pending" as const },
    ],
    executionTime: "10:23",
    executionBy: "CI System",
    nextStage: "Integration Tests",
  };
  
  // Filter flows based on active tab
  const filteredFlows = activeTab === "all" 
    ? flowExecutions 
    : flowExecutions.filter(flow => flow.status === activeTab);
  
  return (
    <DashboardLayout title="Execution Flow Control">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Execution Flow Control</h2>
        <p className="text-sm text-gray-500 mt-1">
          Monitor and manage workflow executions across your platform
        </p>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start gap-4">
        <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Flows</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              New Flow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Execution Flow</DialogTitle>
              <DialogDescription>
                Define a new workflow for automated processes in your platform.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Flow Name</label>
                  <input
                    id="name"
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    placeholder="e.g., Database Migration Flow"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea
                    id="description"
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    placeholder="Describe the purpose and behavior of this flow"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Flow Type</label>
                  <select
                    id="type"
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  >
                    <option value="">Select a type</option>
                    <option value="CI/CD">CI/CD</option>
                    <option value="Deployment">Deployment</option>
                    <option value="Migration">Migration</option>
                    <option value="Security">Security</option>
                    <option value="Backup">Backup</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Stages Configuration</h3>
                <div className="border rounded-md p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mr-2">
                          1
                        </div>
                        <span>Code Checkout</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mr-2">
                          2
                        </div>
                        <span>Build & Test</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 mr-2">
                          3
                        </div>
                        <span>Deploy</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stage
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" className="mr-2">
                Cancel
              </Button>
              <Button type="submit">
                Create Flow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredFlows.map((flow) => (
          <FlowCard 
            key={flow.id}
            title={flow.title}
            description={flow.description}
            status={flow.status}
            lastRun={flow.lastRun}
            type={flow.type}
          />
        ))}
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Active Flow Execution</h3>
        <p className="text-sm text-gray-500">
          Monitor and control the currently executing flow
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedFlow.title}</CardTitle>
                <CardDescription>{selectedFlow.description}</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 capitalize">
                {selectedFlow.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mb-4">
              {selectedFlow.stages.map((stage, i) => (
                <FlowStage 
                  key={i}
                  name={stage.name}
                  status={stage.status}
                  index={i}
                  isLast={i === selectedFlow.stages.length - 1}
                />
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button variant="outline" className="flex items-center">
                <StopCircle className="h-4 w-4 mr-2" />
                Pause Execution
              </Button>
              <div className="space-x-2">
                <Button variant="outline" className="flex items-center" disabled>
                  <ArrowDownUp className="h-4 w-4 mr-2" />
                  Skip Stage
                </Button>
                <Button variant="outline" className="flex items-center text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-2" />
                  Abort Flow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Execution Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="text-sm font-medium">Active</div>
                  
                  <div className="text-sm text-gray-500">Started</div>
                  <div className="text-sm font-medium">Today, 10:23 AM</div>
                  
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="text-sm font-medium">45m 12s</div>
                  
                  <div className="text-sm text-gray-500">Initiated by</div>
                  <div className="text-sm font-medium">CI System</div>
                  
                  <div className="text-sm text-gray-500">Current Stage</div>
                  <div className="text-sm font-medium">Integration Tests</div>
                  
                  <div className="text-sm text-gray-500">Next Stage</div>
                  <div className="text-sm font-medium">Security Scan</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Action History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-blue-500 pl-3 py-1">
                  <div className="text-sm font-medium">Stage Started</div>
                  <div className="text-xs text-gray-500">10:45 AM</div>
                  <div className="text-sm mt-1">Integration Tests started</div>
                </div>
                <div className="border-l-2 border-green-500 pl-3 py-1">
                  <div className="text-sm font-medium">Stage Completed</div>
                  <div className="text-xs text-gray-500">10:40 AM</div>
                  <div className="text-sm mt-1">Unit Tests completed successfully</div>
                </div>
                <div className="border-l-2 border-blue-500 pl-3 py-1">
                  <div className="text-sm font-medium">Stage Started</div>
                  <div className="text-xs text-gray-500">10:35 AM</div>
                  <div className="text-sm mt-1">Unit Tests started</div>
                </div>
                <div className="border-l-2 border-green-500 pl-3 py-1">
                  <div className="text-sm font-medium">Stage Completed</div>
                  <div className="text-xs text-gray-500">10:30 AM</div>
                  <div className="text-sm mt-1">Build completed successfully</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
