import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  Check,
  Clock,
  Download,
  Edit,
  Eye,
  FileCode,
  FileText,
  MoreVertical,
  Package,
  PlusCircle,
  RefreshCcw,
  Rocket,
  Settings,
  Shield,
  Tag,
  Trash,
  Zap
} from "lucide-react";

// Plugin schema for form validation
const pluginFormSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be in the format X.Y.Z"),
  releaseDate: z.string().min(1, "Release date is required"),
  status: z.string().min(1, "Status is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  changeLog: z.string().min(10, "Change log must be at least 10 characters"),
});

type PluginFormValues = z.infer<typeof pluginFormSchema>;
type PluginUpdate = {
  id: number;
  domain: string;
  name: string;
  version: string;
  releaseDate: string;
  status: string;
  description: string;
  changeLog: string;
  updatedBy: number;
  updatedAt: string;
};

export default function PluginUpdatePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [selectedPlugin, setSelectedPlugin] = useState<PluginUpdate | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const isAdmin = user?.role === "admin";
  
  // Get all plugin updates
  const { data: plugins, isLoading } = useQuery<PluginUpdate[]>({
    queryKey: ["/api/plugins"],
    queryFn: async () => {
      const response = await fetch("/api/plugins");
      if (!response.ok) {
        throw new Error("Failed to fetch plugin updates");
      }
      return response.json();
    }
  });

  // Get unique domains from plugins
  const domains = plugins ? Array.from(new Set(plugins.map(plugin => plugin.domain))) : [];
  
  // Set first domain as active if none is selected and domains are available
  useEffect(() => {
    if (!activeDomain && domains.length > 0) {
      setActiveDomain(domains[0]);
    }
  }, [domains, activeDomain]);
  
  // Filter plugins by domain
  const domainPlugins = plugins?.filter(plugin => 
    activeDomain ? plugin.domain === activeDomain : true
  ) || [];
  
  // Mutation for updating plugin status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const response = await apiRequest("PATCH", `/api/plugins/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Plugin status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/plugins"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation for creating a new plugin
  const createPluginMutation = useMutation({
    mutationFn: async (data: PluginFormValues) => {
      const formattedData = {
        ...data,
        releaseDate: new Date(data.releaseDate),
      };
      const response = await apiRequest("POST", "/api/plugins", formattedData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Plugin created",
        description: "New plugin has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/plugins"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Setup form for create plugin
  const form = useForm<PluginFormValues>({
    resolver: zodResolver(pluginFormSchema),
    defaultValues: {
      domain: "",
      name: "",
      version: "",
      releaseDate: format(new Date(), "yyyy-MM-dd"),
      status: "beta",
      description: "",
      changeLog: "",
    },
  });
  
  // Handle form submission
  function onSubmit(data: PluginFormValues) {
    createPluginMutation.mutate(data);
  }
  
  // Get icon for domain
  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "Build & Deploy":
        return <Rocket className="h-5 w-5" />;
      case "Application Reliability":
        return <Shield className="h-5 w-5" />;
      case "TestOps":
        return <FileCode className="h-5 w-5" />;
      case "Cloud Operations":
        return <Zap className="h-5 w-5" />;
      case "FinOps":
        return <Tag className="h-5 w-5" />;
      case "Security":
        return <Shield className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stable":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Stable</Badge>;
      case "beta":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Beta</Badge>;
      case "deprecated":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Deprecated</Badge>;
      case "development":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Development</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Handle status change
  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };
  
  // View plugin details
  const viewPluginDetails = (plugin: PluginUpdate) => {
    setSelectedPlugin(plugin);
    setShowDetailsDialog(true);
  };
  
  return (
    <DashboardLayout title="Plugin Updates">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Plugin Updates</h2>
        <p className="text-sm text-muted-foreground">
          Manage plugin SDKs and updates across platform domains
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Input placeholder="Search plugins..." className="pl-9" />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
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
        </div>
        
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Plugin Update
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Plugin Update</DialogTitle>
                <DialogDescription>
                  Add a new plugin update to the catalog
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domain</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select domain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Build & Deploy">Build & Deploy</SelectItem>
                              <SelectItem value="Application Reliability">Application Reliability</SelectItem>
                              <SelectItem value="TestOps">TestOps</SelectItem>
                              <SelectItem value="Cloud Operations">Cloud Operations</SelectItem>
                              <SelectItem value="FinOps">FinOps</SelectItem>
                              <SelectItem value="Security">Security</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="beta">Beta</SelectItem>
                              <SelectItem value="stable">Stable</SelectItem>
                              <SelectItem value="deprecated">Deprecated</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., CI Pipeline SDK" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Version</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1.0.0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Use semantic versioning (X.Y.Z)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the plugin"
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="changeLog"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Change Log</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List changes in this version"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Use bullet points (- item) for better readability
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={createPluginMutation.isPending}
                    >
                      {createPluginMutation.isPending && (
                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Add Plugin
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs defaultValue={domains[0]} value={activeDomain || undefined} onValueChange={setActiveDomain}>
        <TabsList className="mb-4 w-full flex flex-wrap">
          {domains.map(domain => (
            <TabsTrigger key={domain} value={domain} className="flex items-center gap-2">
              {getDomainIcon(domain)}
              <span>{domain}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {domains.map(domain => (
          <TabsContent key={domain} value={domain} className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domainPlugins.map(plugin => (
                <Card key={plugin.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <CardTitle className="text-lg">{plugin.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            v{plugin.version}
                          </span>
                          {getStatusBadge(plugin.status)}
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => viewPluginDetails(plugin)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleStatusChange(plugin.id, "development")}>
                              <Clock className="mr-2 h-4 w-4" />
                              Set as Development
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(plugin.id, "beta")}>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Set as Beta
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(plugin.id, "stable")}>
                              <Check className="mr-2 h-4 w-4" />
                              Set as Stable
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(plugin.id, "deprecated")}>
                              <Trash className="mr-2 h-4 w-4" />
                              Set as Deprecated
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
                      {plugin.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Released: {format(new Date(plugin.releaseDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => viewPluginDetails(plugin)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Details
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-xs"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download SDK
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Plugin Details Dialog */}
      {selectedPlugin && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedPlugin.name} <span className="text-sm font-normal">v{selectedPlugin.version}</span>
                {getStatusBadge(selectedPlugin.status)}
              </DialogTitle>
              <DialogDescription>
                {selectedPlugin.domain} - Released {format(new Date(selectedPlugin.releaseDate), 'MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Description</h4>
                <p className="text-sm">{selectedPlugin.description}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-semibold mb-1">Change Log</h4>
                <div className="text-sm whitespace-pre-line bg-gray-50 p-3 rounded border">
                  {selectedPlugin.changeLog}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Last updated: {format(new Date(selectedPlugin.updatedAt), 'MMM d, yyyy')}</span>
                <span>ID: {selectedPlugin.id}</span>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
              {isAdmin && (
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}