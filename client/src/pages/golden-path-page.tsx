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
import { Edit, Plus, Search, Trash, CheckCircle, Clock, Settings, Power, RotateCcw, Save, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const BACKSTAGE_API_URL = "https://platformnex-backend-pyzx2jrmda-uc.a.run.app";

// Form schema for creating a new template
const templateFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

interface BackstageTemplate {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    description: string;
    tags: string[];
    title: string;
    type: string;
    namespace: string;
    annotations?: Record<string, string>;
  };
  spec: {
    type: string;
    parameters: any[];
    steps: any[];
    owner?: string;
    lifecycle?: string;
  };
}

export default function GoldenPathPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch templates from Backstage catalog
  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/catalog/entities"],
    queryFn: async () => {
      const response = await fetch(
        `/api/catalog/entities?filter=kind=template`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
          }
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      return data as BackstageTemplate[];
    },
  });
  
  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormValues) => {
      const res = await apiRequest("POST", "/api/templates", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scaffolder/templates"] });
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
  
  const filteredTemplates = templates?.filter((template) => 
    template.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.metadata.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];
  
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
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-6">
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
                
                <AddParametersStepsTabs form={form} />
                
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
            ) : filteredTemplates.length > 0 ? (
              filteredTemplates.map((template, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge className="mb-2">{template.metadata.type}</Badge>
                      <div className="flex space-x-1">
                        <EditTemplateDialog template={template} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle>{template.metadata.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.metadata.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(template.metadata.tags) ? template.metadata.tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      )) : null}
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[900px] w-[90vw] max-h-[80vh] overflow-y-auto p-6">
                        <DialogHeader>
                          <DialogTitle>{template.metadata.title}</DialogTitle>
                          <DialogDescription>
                            {template.metadata.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
                          <Card className="lg:col-span-2">
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle>Configuration Details</CardTitle>
                                  <CardDescription>Template parameters and workflow steps</CardDescription>
                                </div>
                                <Badge className="bg-green-100 text-green-800 capitalize">
                                  {template.spec.type}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6">
                                <ParametersStepper parameters={template.spec.parameters} />
                                <WorkflowStepper steps={template.spec.steps} />
                              </div>
                            </CardContent>
                          </Card>
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
        
        {/* Other tabs would filter templates based on their type */}
        <TabsContent value="cicd">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading templates...
              </div>
            ) : filteredTemplates?.filter((t) => t.metadata.type === "CI/CD").length > 0 ? (
              filteredTemplates
                .filter((t) => t.metadata.type === "CI/CD")
                .map((template, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge className="mb-2">{template.metadata.type}</Badge>
                        <div className="flex space-x-1">
                          <EditTemplateDialog template={template} />
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle>{template.metadata.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.metadata.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(template.metadata.tags) ? template.metadata.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary">{tag}</Badge>
                        )) : null}
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
          <div className="text-center py-12 text-gray-500">
            Orchestration templates would be filtered here
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
          <div className="text-center py-12 text-gray-500">
            Application templates would be filtered here
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          <div className="text-center py-12 text-gray-500">
            Data templates would be filtered here
          </div>
        </TabsContent>
        
        <TabsContent value="aiml">
          <div className="text-center py-12 text-gray-500">
            AI/ML templates would be filtered here
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

function EditTemplateDialog({ template }: { template: any }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(template.metadata.title || "");
  const [description, setDescription] = useState(template.metadata.description || "");

  // UI/JSON mode toggles
  const [paramMode, setParamMode] = useState<'ui' | 'json'>('ui');
  const [stepMode, setStepMode] = useState<'ui' | 'json'>('ui');

  // Interactive parameters state
  const [parameters, setParameters] = useState<any[]>(
    Array.isArray(template.spec.parameters) ? template.spec.parameters.map((p: any) => ({
      ...p,
      required: Array.isArray(p.required) ? p.required.join(", ") : "",
      properties: p.properties ? Object.entries(p.properties).map(([k, v]) => ({ key: k, value: v })) : [],
    })) : []
  );
  const [parametersJson, setParametersJson] = useState(
    JSON.stringify(template.spec.parameters, null, 2)
  );

  // Interactive steps state
  const [steps, setSteps] = useState<any[]>(
    Array.isArray(template.spec.steps) ? template.spec.steps.map((s: any) => ({
      ...s,
      input: s.input ? Object.entries(s.input).map(([k, v]) => ({ key: k, value: v })) : [],
    })) : []
  );
  const [stepsJson, setStepsJson] = useState(
    JSON.stringify(template.spec.steps, null, 2)
  );

  const [saving, setSaving] = useState(false);

  // Sync UI <-> JSON for parameters
  useEffect(() => {
    if (paramMode === 'ui') {
      setParametersJson(JSON.stringify(
        parameters.map(p => ({
          ...p,
          required: p.required ? p.required.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          properties: p.properties.reduce((acc: any, cur: any) => {
            if (cur.key) acc[cur.key] = cur.value;
            return acc;
          }, {})
        })),
        null, 2
      ));
    }
    // eslint-disable-next-line
  }, [parameters, paramMode]);
  useEffect(() => {
    if (paramMode === 'json') {
      try {
        const arr = JSON.parse(parametersJson);
        setParameters(Array.isArray(arr) ? arr.map((p: any) => ({
          ...p,
          required: Array.isArray(p.required) ? p.required.join(", ") : "",
          properties: p.properties ? Object.entries(p.properties).map(([k, v]) => ({ key: k, value: v })) : [],
        })) : []);
      } catch {}
    }
    // eslint-disable-next-line
  }, [parametersJson, paramMode]);

  // Sync UI <-> JSON for steps
  useEffect(() => {
    if (stepMode === 'ui') {
      setStepsJson(JSON.stringify(
        steps.map(s => ({
          ...s,
          input: s.input.reduce((acc: any, cur: any) => {
            if (cur.key) acc[cur.key] = cur.value;
            return acc;
          }, {})
        })),
        null, 2
      ));
    }
    // eslint-disable-next-line
  }, [steps, stepMode]);
  useEffect(() => {
    if (stepMode === 'json') {
      try {
        const arr = JSON.parse(stepsJson);
        setSteps(Array.isArray(arr) ? arr.map((s: any) => ({
          ...s,
          input: s.input ? Object.entries(s.input).map(([k, v]) => ({ key: k, value: v })) : [],
        })) : []);
      } catch {}
    }
    // eslint-disable-next-line
  }, [stepsJson, stepMode]);

  // Parameter handlers
  const handleParamChange = (idx: number, field: string, value: any) => {
    setParameters(params => params.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const handleParamPropertyChange = (pIdx: number, propIdx: number, field: string, value: any) => {
    setParameters(params => params.map((p, i) => i === pIdx ? {
      ...p,
      properties: p.properties.map((prop: any, j: number) => j === propIdx ? { ...prop, [field]: value } : prop)
    } : p));
  };
  const addParamProperty = (pIdx: number) => {
    setParameters(params => params.map((p, i) => i === pIdx ? {
      ...p,
      properties: [...p.properties, { key: "", value: "" }]
    } : p));
  };
  const removeParamProperty = (pIdx: number, propIdx: number) => {
    setParameters(params => params.map((p, i) => i === pIdx ? {
      ...p,
      properties: p.properties.filter((_: any, j: number) => j !== propIdx)
    } : p));
  };
  const addParameter = () => {
    setParameters(params => [...params, { title: "", required: "", properties: [] }]);
  };
  const removeParameter = (idx: number) => {
    setParameters(params => params.filter((_, i) => i !== idx));
  };

  // Step handlers
  const handleStepChange = (idx: number, field: string, value: any) => {
    setSteps(steps => steps.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const handleStepInputChange = (sIdx: number, inputIdx: number, field: string, value: any) => {
    setSteps(steps => steps.map((s, i) => i === sIdx ? {
      ...s,
      input: s.input.map((inp: any, j: number) => j === inputIdx ? { ...inp, [field]: value } : inp)
    } : s));
  };
  const addStepInput = (sIdx: number) => {
    setSteps(steps => steps.map((s, i) => i === sIdx ? {
      ...s,
      input: [...(s.input || []), { key: "", value: "" }]
    } : s));
  };
  const removeStepInput = (sIdx: number, inputIdx: number) => {
    setSteps(steps => steps.map((s, i) => i === sIdx ? {
      ...s,
      input: s.input.filter((_: any, j: number) => j !== inputIdx)
    } : s));
  };
  const addStep = () => {
    setSteps(steps => [...steps, { name: "", action: "", id: "", input: [] }]);
  };
  const removeStep = (idx: number) => {
    setSteps(steps => steps.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      toast.success("Template updated (mock)");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Update the template details below. (This is a mock UI, no backend update yet.)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          {/* Parameters interactive form */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Parameters</label>
            </div>
            <Tabs value={paramMode} onValueChange={v => setParamMode(v as 'ui' | 'json') } className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="ui">Configure via UI</TabsTrigger>
                <TabsTrigger value="json">Paste/Edit JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="ui">
                <div className="mb-2 text-right">
                  <Button size="sm" variant="outline" onClick={addParameter}>Add Parameter</Button>
                </div>
                <div className="space-y-4">
                  {parameters.map((param, pIdx) => (
                    <div key={pIdx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium mb-1">Title</label>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeParameter(pIdx)}><Trash className="h-4 w-4" /></Button>
                      </div>
                      <div className="mb-2">
                        <Input value={param.title} onChange={e => handleParamChange(pIdx, "title", e.target.value)} />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-medium mb-1">Required (comma separated)</label>
                        <Input value={param.required} onChange={e => handleParamChange(pIdx, "required", e.target.value)} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium">Properties</label>
                          <Button size="sm" variant="outline" onClick={() => addParamProperty(pIdx)}>Add Property</Button>
                        </div>
                        <div className="space-y-2">
                          {param.properties.map((prop: any, propIdx: number) => (
                            <div key={propIdx} className="flex gap-2 items-center">
                              <Input className="w-1/3" placeholder="Key" value={prop.key} onChange={e => handleParamPropertyChange(pIdx, propIdx, "key", e.target.value)} />
                              <Input className="w-2/3" placeholder="Value" value={prop.value} onChange={e => handleParamPropertyChange(pIdx, propIdx, "value", e.target.value)} />
                              <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeParamProperty(pIdx, propIdx)}><Trash className="h-4 w-4" /></Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="json">
                <Textarea className="font-mono h-40" value={parametersJson} onChange={e => setParametersJson(e.target.value)} />
              </TabsContent>
            </Tabs>
          </div>
          {/* Steps interactive form */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Steps</label>
            </div>
            <Tabs value={stepMode} onValueChange={v => setStepMode(v as 'ui' | 'json') } className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="ui">Configure via UI</TabsTrigger>
                <TabsTrigger value="json">Paste/Edit JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="ui">
                <div className="mb-2 text-right">
                  <Button size="sm" variant="outline" onClick={addStep}>Add Step</Button>
                </div>
                <div className="space-y-4">
                  {steps.map((step, sIdx) => (
                    <div key={sIdx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium mb-1">Name</label>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeStep(sIdx)}><Trash className="h-4 w-4" /></Button>
                      </div>
                      <div className="mb-2">
                        <Input value={step.name} onChange={e => handleStepChange(sIdx, "name", e.target.value)} />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-medium mb-1">Action</label>
                        <Input value={step.action} onChange={e => handleStepChange(sIdx, "action", e.target.value)} />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-medium mb-1">ID</label>
                        <Input value={step.id} onChange={e => handleStepChange(sIdx, "id", e.target.value)} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium">Input</label>
                          <Button size="sm" variant="outline" onClick={() => addStepInput(sIdx)}>Add Input</Button>
                        </div>
                        <div className="space-y-2">
                          {Array.isArray(step.input) && step.input.map((inp: any, inpIdx: number) => (
                            <div key={inpIdx} className="flex gap-2 items-center">
                              <Input className="w-1/3" placeholder="Key" value={inp.key} onChange={e => handleStepInputChange(sIdx, inpIdx, "key", e.target.value)} />
                              <Input className="w-2/3" placeholder="Value" value={inp.value} onChange={e => handleStepInputChange(sIdx, inpIdx, "value", e.target.value)} />
                              <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeStepInput(sIdx, inpIdx)}><Trash className="h-4 w-4" /></Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="json">
                <Textarea className="font-mono h-40" value={stepsJson} onChange={e => setStepsJson(e.target.value)} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WorkflowStepper({ steps }: { steps: any[] }) {
  const [openStep, setOpenStep] = useState<number | null>(null);
  return (
    <div className="w-full">
      <h4 className="font-medium mb-4">Workflow Steps</h4>
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {Array.isArray(steps) && steps.length > 0 ? (
          steps.map((step, idx) => (
            <li className="mb-8 ml-6 group" key={idx}>
              <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <FileText className="h-4 w-4 text-blue-600" />
              </span>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenStep(openStep === idx ? null : idx)}>
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">{step.name || `Step ${idx + 1}`}</span>
                  <span className="text-xs text-gray-500">Action: <span className="font-mono">{step.action}</span></span>
                  {step.id && (
                    <span className="text-xs text-gray-400">ID: {step.id}</span>
                  )}
                </div>
                <span className="ml-2">
                  {openStep === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </div>
              {openStep === idx && (
                <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-xs overflow-x-auto">
                  <pre>{JSON.stringify(step, null, 2)}</pre>
                </div>
              )}
            </li>
          ))
        ) : (
          <li className="ml-6 text-gray-500">No steps defined.</li>
        )}
      </ol>
    </div>
  );
}

function ParametersStepper({ parameters }: { parameters: any[] }) {
  const [openParam, setOpenParam] = useState<number | null>(null);
  return (
    <div className="w-full">
      <h4 className="font-medium mb-4">Parameters</h4>
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {Array.isArray(parameters) && parameters.length > 0 ? (
          parameters.map((param, idx) => (
            <li className="mb-8 ml-6 group" key={idx}>
              <span className="flex absolute -left-3 justify-center items-center w-6 h-6 bg-green-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-green-900">
                <FileText className="h-4 w-4 text-green-600" />
              </span>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpenParam(openParam === idx ? null : idx)}>
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">{param.title || `Parameter ${idx + 1}`}</span>
                  {param.required && param.required.length > 0 && (
                    <span className="text-xs text-gray-500">Required: {param.required.join(", ")}</span>
                  )}
                  {param.properties && (
                    <span className="text-xs text-gray-400">Properties: {Object.keys(param.properties).join(", ")}</span>
                  )}
                </div>
                <span className="ml-2">
                  {openParam === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </div>
              {openParam === idx && (
                <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-xs overflow-x-auto">
                  <pre>{JSON.stringify(param, null, 2)}</pre>
                </div>
              )}
            </li>
          ))
        ) : (
          <li className="ml-6 text-gray-500">No parameters defined.</li>
        )}
      </ol>
    </div>
  );
}

function AddParametersStepsTabs({ form }: { form: any }) {
  const [paramMode, setParamMode] = useState<'ui' | 'json'>('ui');
  const [stepMode, setStepMode] = useState<'ui' | 'json'>('ui');

  // Parameters state
  const [parameters, setParameters] = useState<any[]>([
    { title: '', required: '', properties: [] }
  ]);
  const [parametersJson, setParametersJson] = useState('[]');

  // Steps state
  const [steps, setSteps] = useState<any[]>([
    { name: '', action: '', id: '', input: [] }
  ]);
  const [stepsJson, setStepsJson] = useState('[]');

  // Sync UI <-> JSON for parameters
  useEffect(() => {
    if (paramMode === 'ui') {
      setParametersJson(JSON.stringify(
        parameters.map(p => ({
          ...p,
          required: p.required ? p.required.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          properties: p.properties.reduce((acc: any, cur: any) => {
            if (cur.key) acc[cur.key] = cur.value;
            return acc;
          }, {})
        })),
        null, 2
      ));
    }
  }, [parameters, paramMode]);
  useEffect(() => {
    if (paramMode === 'json') {
      try {
        const arr = JSON.parse(parametersJson);
        setParameters(Array.isArray(arr) ? arr.map((p: any) => ({
          ...p,
          required: Array.isArray(p.required) ? p.required.join(", ") : "",
          properties: p.properties ? Object.entries(p.properties).map(([k, v]) => ({ key: k, value: v })) : [],
        })) : []);
      } catch {}
    }
  }, [parametersJson, paramMode]);

  // Sync UI <-> JSON for steps
  useEffect(() => {
    if (stepMode === 'ui') {
      setStepsJson(JSON.stringify(
        steps.map(s => ({
          ...s,
          input: s.input.reduce((acc: any, cur: any) => {
            if (cur.key) acc[cur.key] = cur.value;
            return acc;
          }, {})
        })),
        null, 2
      ));
    }
  }, [steps, stepMode]);
  useEffect(() => {
    if (stepMode === 'json') {
      try {
        const arr = JSON.parse(stepsJson);
        setSteps(Array.isArray(arr) ? arr.map((s: any) => ({
          ...s,
          input: s.input ? Object.entries(s.input).map(([k, v]) => ({ key: k, value: v })) : [],
        })) : []);
      } catch {}
    }
  }, [stepsJson, stepMode]);

  // Parameter handlers (same as Edit dialog)
  const handleParamChange = (idx: number, field: string, value: any) => {
    setParameters(params => params.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };
  const handleParamPropertyChange = (pIdx: number, propIdx: number, field: string, value: any) => {
    setParameters(params => params.map((p, i) => i === pIdx ? {
      ...p,
      properties: p.properties.map((prop: any, j: number) => j === propIdx ? { ...prop, [field]: value } : prop)
    } : p));
  };
  const addParamProperty = (pIdx: number) => {
    setParameters(params => params.map((p, i) => i === pIdx ? {
      ...p,
      properties: [...p.properties, { key: '', value: '' }]
    } : p));
  };
  const removeParamProperty = (pIdx: number, propIdx: number) => {
    setParameters(params => params.map((p, i) => i === pIdx ? {
      ...p,
      properties: p.properties.filter((_: any, j: number) => j !== propIdx)
    } : p));
  };
  const addParameter = () => {
    setParameters(params => [...params, { title: '', required: '', properties: [] }]);
  };
  const removeParameter = (idx: number) => {
    setParameters(params => params.filter((_, i) => i !== idx));
  };

  // Step handlers (same as Edit dialog)
  const handleStepChange = (idx: number, field: string, value: any) => {
    setSteps(steps => steps.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const handleStepInputChange = (sIdx: number, inputIdx: number, field: string, value: any) => {
    setSteps(steps => steps.map((s, i) => i === sIdx ? {
      ...s,
      input: s.input.map((inp: any, j: number) => j === inputIdx ? { ...inp, [field]: value } : inp)
    } : s));
  };
  const addStepInput = (sIdx: number) => {
    setSteps(steps => steps.map((s, i) => i === sIdx ? {
      ...s,
      input: [...(s.input || []), { key: '', value: '' }]
    } : s));
  };
  const removeStepInput = (sIdx: number, inputIdx: number) => {
    setSteps(steps => steps.map((s, i) => i === sIdx ? {
      ...s,
      input: s.input.filter((_: any, j: number) => j !== inputIdx)
    } : s));
  };
  const addStep = () => {
    setSteps(steps => [...steps, { name: '', action: '', id: '', input: [] }]);
  };
  const removeStep = (idx: number) => {
    setSteps(steps => steps.filter((_, i) => i !== idx));
  };

  // On submit, set the form values for parameters and steps
  useEffect(() => {
    if (paramMode === 'ui') {
      form.setValue('parameters', parameters.map(p => ({
        ...p,
        required: p.required ? p.required.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        properties: p.properties.reduce((acc: any, cur: any) => {
          if (cur.key) acc[cur.key] = cur.value;
          return acc;
        }, {})
      })));
    } else {
      try {
        form.setValue('parameters', JSON.parse(parametersJson));
      } catch {}
    }
  }, [parameters, parametersJson, paramMode, form]);
  useEffect(() => {
    if (stepMode === 'ui') {
      form.setValue('steps', steps.map(s => ({
        ...s,
        input: s.input.reduce((acc: any, cur: any) => {
          if (cur.key) acc[cur.key] = cur.value;
          return acc;
        }, {})
      })));
    } else {
      try {
        form.setValue('steps', JSON.parse(stepsJson));
      } catch {}
    }
  }, [steps, stepsJson, stepMode, form]);

  return (
    <div className="space-y-6">
      {/* Parameters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Parameters</label>
        </div>
        <Tabs value={paramMode} onValueChange={v => setParamMode(v as 'ui' | 'json') } className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="ui">Configure via UI</TabsTrigger>
            <TabsTrigger value="json">Paste/Edit JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="ui">
            <div className="mb-2 text-right">
              <Button size="sm" variant="outline" onClick={addParameter}>Add Parameter</Button>
            </div>
            <div className="space-y-4">
              {parameters.map((param, pIdx) => (
                <div key={pIdx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium mb-1">Title</label>
                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeParameter(pIdx)}><Trash className="h-4 w-4" /></Button>
                  </div>
                  <div className="mb-2">
                    <Input value={param.title} onChange={e => handleParamChange(pIdx, "title", e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">Required (comma separated)</label>
                    <Input value={param.required} onChange={e => handleParamChange(pIdx, "required", e.target.value)} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium">Properties</label>
                      <Button size="sm" variant="outline" onClick={() => addParamProperty(pIdx)}>Add Property</Button>
                    </div>
                    <div className="space-y-2">
                      {param.properties.map((prop: any, propIdx: number) => (
                        <div key={propIdx} className="flex gap-2 items-center">
                          <Input className="w-1/3" placeholder="Key" value={prop.key} onChange={e => handleParamPropertyChange(pIdx, propIdx, "key", e.target.value)} />
                          <Input className="w-2/3" placeholder="Value" value={prop.value} onChange={e => handleParamPropertyChange(pIdx, propIdx, "value", e.target.value)} />
                          <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeParamProperty(pIdx, propIdx)}><Trash className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="json">
            <Textarea className="font-mono h-40" value={parametersJson} onChange={e => setParametersJson(e.target.value)} />
          </TabsContent>
        </Tabs>
      </div>
      {/* Steps */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Steps</label>
        </div>
        <Tabs value={stepMode} onValueChange={v => setStepMode(v as 'ui' | 'json') } className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="ui">Configure via UI</TabsTrigger>
            <TabsTrigger value="json">Paste/Edit JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="ui">
            <div className="mb-2 text-right">
              <Button size="sm" variant="outline" onClick={addStep}>Add Step</Button>
            </div>
            <div className="space-y-4">
              {steps.map((step, sIdx) => (
                <div key={sIdx} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium mb-1">Name</label>
                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeStep(sIdx)}><Trash className="h-4 w-4" /></Button>
                  </div>
                  <div className="mb-2">
                    <Input value={step.name} onChange={e => handleStepChange(sIdx, "name", e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">Action</label>
                    <Input value={step.action} onChange={e => handleStepChange(sIdx, "action", e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">ID</label>
                    <Input value={step.id} onChange={e => handleStepChange(sIdx, "id", e.target.value)} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium">Input</label>
                      <Button size="sm" variant="outline" onClick={() => addStepInput(sIdx)}>Add Input</Button>
                    </div>
                    <div className="space-y-2">
                      {Array.isArray(step.input) && step.input.map((inp: any, inpIdx: number) => (
                        <div key={inpIdx} className="flex gap-2 items-center">
                          <Input className="w-1/3" placeholder="Key" value={inp.key} onChange={e => handleStepInputChange(sIdx, inpIdx, "key", e.target.value)} />
                          <Input className="w-2/3" placeholder="Value" value={inp.value} onChange={e => handleStepInputChange(sIdx, inpIdx, "value", e.target.value)} />
                          <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeStepInput(sIdx, inpIdx)}><Trash className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="json">
            <Textarea className="font-mono h-40" value={stepsJson} onChange={e => setStepsJson(e.target.value)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
