import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { Edit, Plus, Search, Trash, CheckCircle, Clock, Settings, Power, RotateCcw, Save } from "lucide-react";
import { useState } from "react";

// Form schema for creating a new template
const templateFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

export default function GoldenPathPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });
  
  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormValues) => {
      const res = await apiRequest("POST", "/api/templates", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
  });
  
  // Form for new template
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      content: JSON.stringify({ stages: [], parameters: [] }, null, 2),
    },
  });
  
  function onSubmit(data: TemplateFormValues) {
    createTemplateMutation.mutate(data);
  }
  
  const filteredTemplates = templates?.filter((template: any) => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <DashboardLayout title="Golden Path & Templates">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Golden Path & Templates</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage standardized templates and golden paths for your developers
        </p>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search templates..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Define a new golden path template for your developers to use.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Standard CI/CD Pipeline" {...field} />
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
                          placeholder="Describe what this template provides..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CI/CD">CI/CD</SelectItem>
                          <SelectItem value="Orchestration">Orchestration</SelectItem>
                          <SelectItem value="API">API</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="Application">Application</SelectItem>
                          <SelectItem value="Data">Data</SelectItem>
                          <SelectItem value="AI/ML">AI/ML</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Content (JSON)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter template configuration..." 
                          className="font-mono h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Define your template structure in JSON format.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={createTemplateMutation.isPending}>
                    {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="cicd">CI/CD</TabsTrigger>
          <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="aiml">AI/ML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading templates...
              </div>
            ) : filteredTemplates?.length > 0 ? (
              filteredTemplates.map((template: any, index: number) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge className="mb-2">{template.category}</Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Created {format(new Date(template.createdAt), "MMM d, yyyy")}</span>
                      <span>Updated {format(new Date(template.updatedAt), "MMM d, yyyy")}</span>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[900px] w-[90vw]">
                        <DialogHeader>
                          <DialogTitle>{template.name}</DialogTitle>
                          <DialogDescription>
                            {template.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                          <Card className="lg:col-span-2">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle>Configuration Details</CardTitle>
                                  <CardDescription>Current configuration settings and components</CardDescription>
                                </div>
                                <Badge className="bg-green-100 text-green-800 capitalize">
                                  enabled
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6 mb-4">
                                {/* Configuration stages - we'll use similar stages for all templates for now */}
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
                                    <CheckCircle className="h-5 w-5" />
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <p className="font-medium">Code Checkout</p>
                                    <p className="text-sm text-gray-500 capitalize">configured</p>
                                  </div>
                                  <div className="flex-1 mx-4">
                                    <div className="h-0.5 bg-gray-200 relative">
                                      <div 
                                        className="absolute inset-0 bg-green-500"
                                        style={{ width: "100%" }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
                                    <CheckCircle className="h-5 w-5" />
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <p className="font-medium">Build</p>
                                    <p className="text-sm text-gray-500 capitalize">configured</p>
                                  </div>
                                  <div className="flex-1 mx-4">
                                    <div className="h-0.5 bg-gray-200 relative">
                                      <div 
                                        className="absolute inset-0 bg-green-500"
                                        style={{ width: "100%" }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white">
                                    <Settings className="h-5 w-5" />
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <p className="font-medium">Unit Tests</p>
                                    <p className="text-sm text-gray-500 capitalize">active</p>
                                  </div>
                                  <div className="flex-1 mx-4">
                                    <div className="h-0.5 bg-gray-200 relative">
                                      <div 
                                        className="absolute inset-0 bg-gray-200"
                                        style={{ width: "0%" }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700">
                                    <Clock className="h-5 w-5" />
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <p className="font-medium">Integration Tests</p>
                                    <p className="text-sm text-gray-500 capitalize">pending</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-8 flex justify-between">
                                <Button variant="outline" className="flex items-center">
                                  <Power className="h-4 w-4 mr-2" />
                                  Toggle Status
                                </Button>
                                <div className="space-x-2">
                                  <Button variant="outline" className="flex items-center">
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Version History
                                  </Button>
                                  <Button variant="outline" className="flex items-center text-blue-600 border-blue-200 hover:bg-blue-50">
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <div className="space-y-6">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Template Details</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="text-sm text-gray-500">Status</div>
                                    <div className="text-sm font-medium">Enabled</div>
                                    
                                    <div className="text-sm text-gray-500">Created</div>
                                    <div className="text-sm font-medium">{format(new Date(template.createdAt), "MMM d, yyyy")}</div>
                                    
                                    <div className="text-sm text-gray-500">Last Modified</div>
                                    <div className="text-sm font-medium">{format(new Date(template.updatedAt), "MMM d, yyyy")}</div>
                                    
                                    <div className="text-sm text-gray-500">Category</div>
                                    <div className="text-sm font-medium">{template.category}</div>
                                    
                                    <div className="text-sm text-gray-500">Version</div>
                                    <div className="text-sm font-medium">1.2</div>
                                    
                                    <div className="text-sm text-gray-500">Next Review</div>
                                    <div className="text-sm font-medium">Jun 15, 2025</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Modification History</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="border-l-2 border-blue-500 pl-3 py-1">
                                    <div className="text-sm font-medium">Template Updated</div>
                                    <div className="text-xs text-gray-500">Today, 10:23 AM</div>
                                    <div className="text-sm mt-1">Integration Tests settings modified</div>
                                  </div>
                                  <div className="border-l-2 border-green-500 pl-3 py-1">
                                    <div className="text-sm font-medium">Status Change</div>
                                    <div className="text-xs text-gray-500">Yesterday, 2:40 PM</div>
                                    <div className="text-sm mt-1">Template enabled</div>
                                  </div>
                                  <div className="border-l-2 border-blue-500 pl-3 py-1">
                                    <div className="text-sm font-medium">Stage Added</div>
                                    <div className="text-xs text-gray-500">May 8, 2025</div>
                                    <div className="text-sm mt-1">Added Integration Tests stage</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No templates found. Create your first template to get started.
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Other tabs would have similar content but filtered */}
        <TabsContent value="cicd">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading templates...
              </div>
            ) : filteredTemplates?.filter((t: any) => t.category === "CI/CD").length > 0 ? (
              filteredTemplates
                .filter((t: any) => t.category === "CI/CD")
                .map((template: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge className="mb-2">{template.category}</Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Created {format(new Date(template.createdAt), "MMM d, yyyy")}</span>
                        <span>Updated {format(new Date(template.updatedAt), "MMM d, yyyy")}</span>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-4">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No CI/CD templates found.
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Other tab contents would follow the same pattern */}
        <TabsContent value="orchestration">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading templates...
              </div>
            ) : filteredTemplates?.filter((t: any) => t.category === "Orchestration").length > 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Filtered Orchestration templates would appear here
              </div>
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No Orchestration templates found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="api">
          <div className="text-center py-12 text-gray-500">
            API templates would be filtered here
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="text-center py-12 text-gray-500">
            Security templates would be filtered here
          </div>
        </TabsContent>
        
        <TabsContent value="application">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading templates...
              </div>
            ) : filteredTemplates?.filter((t: any) => t.category === "Application").length > 0 ? (
              filteredTemplates
                .filter((t: any) => t.category === "Application")
                .map((template: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge className="mb-2">{template.category}</Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Created {format(new Date(template.createdAt), "MMM d, yyyy")}</span>
                        <span>Updated {format(new Date(template.updatedAt), "MMM d, yyyy")}</span>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-4">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No Application templates found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading templates...
              </div>
            ) : filteredTemplates?.filter((t: any) => t.category === "Data").length > 0 ? (
              filteredTemplates
                .filter((t: any) => t.category === "Data")
                .map((template: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge className="mb-2">{template.category}</Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Created {format(new Date(template.createdAt), "MMM d, yyyy")}</span>
                        <span>Updated {format(new Date(template.updatedAt), "MMM d, yyyy")}</span>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-4">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No Data templates found.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="aiml">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading templates...
              </div>
            ) : filteredTemplates?.filter((t: any) => t.category === "AI/ML").length > 0 ? (
              filteredTemplates
                .filter((t: any) => t.category === "AI/ML")
                .map((template: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge className="mb-2">{template.category}</Badge>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Created {format(new Date(template.createdAt), "MMM d, yyyy")}</span>
                        <span>Updated {format(new Date(template.updatedAt), "MMM d, yyyy")}</span>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-4">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No AI/ML templates found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
