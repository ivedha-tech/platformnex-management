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
import { Edit, Plus, Search, Trash } from "lucide-react";
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
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="cicd">CI/CD</TabsTrigger>
          <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
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
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
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
      </Tabs>
    </DashboardLayout>
  );
}
