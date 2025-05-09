import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
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
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Cloud,
  Edit,
  EyeOff,
  MoreVertical,
  PlusCircle,
  RotateCw,
  Save,
  Server,
  Settings,
  X
} from "lucide-react";
import { useState } from "react";

// Form schema for orchestrator configuration
const orchestratorFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(["kubernetes", "docker-compose", "aws-ecs", "azure-container-apps"]),
  endpoint: z.string().url("Please enter a valid URL"),
  credentials: z.object({
    authType: z.enum(["service-account", "api-key", "oauth2"]),
    secretKey: z.string().min(1, "Secret key is required"),
  }),
  settings: z.object({
    autoScaling: z.boolean().default(true),
    loadBalancing: z.boolean().default(true),
    monitoring: z.boolean().default(true),
    alerting: z.boolean().default(false),
  }),
});

type OrchestratorFormValues = z.infer<typeof orchestratorFormSchema>;

export default function OrchestratorConfigPage() {
  const [activeEnvironment, setActiveEnvironment] = useState("production");
  
  // Sample orchestrator configurations for display
  const orchestratorConfigs = [
    {
      id: 1,
      name: "Production Kubernetes Cluster",
      description: "Main production Kubernetes cluster for platform services",
      type: "kubernetes",
      status: "active",
      environment: "production",
      lastUpdated: "2023-09-15",
    },
    {
      id: 2,
      name: "Development ECS Cluster",
      description: "AWS ECS cluster for development environments",
      type: "aws-ecs",
      status: "active",
      environment: "development",
      lastUpdated: "2023-09-05",
    },
    {
      id: 3,
      name: "Staging Kubernetes Cluster",
      description: "Kubernetes cluster for pre-production staging",
      type: "kubernetes",
      status: "active",
      environment: "staging",
      lastUpdated: "2023-08-30",
    },
    {
      id: 4,
      name: "Legacy Docker Compose",
      description: "Legacy services running on Docker Compose",
      type: "docker-compose",
      status: "inactive",
      environment: "maintenance",
      lastUpdated: "2023-07-10",
    },
  ];
  
  // Form for new orchestrator configuration
  const form = useForm<OrchestratorFormValues>({
    resolver: zodResolver(orchestratorFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "kubernetes",
      endpoint: "",
      credentials: {
        authType: "service-account",
        secretKey: "",
      },
      settings: {
        autoScaling: true,
        loadBalancing: true,
        monitoring: true,
        alerting: false,
      },
    },
  });
  
  function onSubmit(data: OrchestratorFormValues) {
    // In a real app, this would call a mutation to create the configuration
    console.log(data);
    // Close dialog or show success message
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "kubernetes":
        return <Server className="h-4 w-4 mr-2" />;
      case "aws-ecs":
        return <Cloud className="h-4 w-4 mr-2" />;
      case "docker-compose":
        return <Server className="h-4 w-4 mr-2" />;
      case "azure-container-apps":
        return <Cloud className="h-4 w-4 mr-2" />;
      default:
        return <Server className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <DashboardLayout title="Orchestrator Configuration">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Orchestrator Configuration</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage and configure your infrastructure orchestrators
        </p>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="relative w-full md:w-96">
          <Input placeholder="Search configurations..." className="pl-9" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Orchestrator
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Orchestrator Configuration</DialogTitle>
              <DialogDescription>
                Configure a new infrastructure orchestrator for your platform deployments.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Production Kubernetes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orchestrator Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select orchestrator type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="kubernetes">Kubernetes</SelectItem>
                            <SelectItem value="docker-compose">Docker Compose</SelectItem>
                            <SelectItem value="aws-ecs">AWS ECS</SelectItem>
                            <SelectItem value="azure-container-apps">Azure Container Apps</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of this orchestrator" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Endpoint</FormLabel>
                      <FormControl>
                        <Input placeholder="https://api.orchestrator.example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The endpoint URL for the orchestrator API
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Authentication</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="credentials.authType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authentication Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select auth type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="service-account">Service Account</SelectItem>
                              <SelectItem value="api-key">API Key</SelectItem>
                              <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="credentials.secretKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secret Key</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="password" placeholder="••••••••" {...field} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-1 text-gray-400 hover:text-gray-600"
                              >
                                <EyeOff className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Securely stored and encrypted
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Settings</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="settings.autoScaling"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Auto Scaling</FormLabel>
                            <FormDescription>
                              Automatically scale based on resource utilization
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="settings.loadBalancing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Load Balancing</FormLabel>
                            <FormDescription>
                              Distribute traffic across instances
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="settings.monitoring"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Monitoring</FormLabel>
                            <FormDescription>
                              Enable metrics and health monitoring
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="settings.alerting"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Alerting</FormLabel>
                            <FormDescription>
                              Send notifications for critical events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" className="mr-2">
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Configuration
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Environments</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="staging">Staging</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Orchestrator Configurations</CardTitle>
          <CardDescription>
            Manage your infrastructure orchestration configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left font-medium text-sm px-6 py-3">Name</th>
                  <th className="text-left font-medium text-sm px-6 py-3">Type</th>
                  <th className="text-left font-medium text-sm px-6 py-3">Environment</th>
                  <th className="text-left font-medium text-sm px-6 py-3">Status</th>
                  <th className="text-left font-medium text-sm px-6 py-3">Last Updated</th>
                  <th className="text-right font-medium text-sm px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orchestratorConfigs.map((config) => (
                  <tr key={config.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{config.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{config.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getTypeIcon(config.type)}
                        <span className="capitalize">{config.type.replace("-", " ")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{config.environment}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(config.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {config.lastUpdated}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuItem className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" /> Configure
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <RotateCw className="h-4 w-4 mr-2" /> Sync
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center text-red-600">
                            <X className="h-4 w-4 mr-2" /> Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  <span>Production API Gateway</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  <span>Production Database</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <span>Development Cache</span>
                </div>
                <Badge className="bg-amber-100 text-amber-800">Degraded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  <span>Authentication Service</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">Healthy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">CPU</span>
                  <span className="text-sm text-gray-500">65%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Memory</span>
                  <span className="text-sm text-gray-500">45%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-sm text-gray-500">78%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Network</span>
                  <span className="text-sm text-gray-500">32%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: "32%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-emerald-500 pl-3 py-1">
                <div className="text-sm font-medium">Scaling Event</div>
                <div className="text-xs text-gray-500">Today, 10:23 AM</div>
                <div className="text-sm mt-1">Production cluster scaled up to 5 instances</div>
              </div>
              <div className="border-l-2 border-blue-500 pl-3 py-1">
                <div className="text-sm font-medium">Configuration Updated</div>
                <div className="text-xs text-gray-500">Yesterday, 2:45 PM</div>
                <div className="text-sm mt-1">Load balancer configuration updated</div>
              </div>
              <div className="border-l-2 border-amber-500 pl-3 py-1">
                <div className="text-sm font-medium">Warning</div>
                <div className="text-xs text-gray-500">Yesterday, 11:30 AM</div>
                <div className="text-sm mt-1">Development cache showing high latency</div>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3 py-1">
                <div className="text-sm font-medium">Maintenance Completed</div>
                <div className="text-xs text-gray-500">Sep 15, 2023</div>
                <div className="text-sm mt-1">System update applied successfully</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// These components are needed but were not explicitly imported in the file
function Search(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// Import missing components that weren't included earlier
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
