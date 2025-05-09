import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Edit, 
  Eye, 
  FileText, 
  Key, 
  Lock, 
  MoreHorizontal, 
  Plus, 
  RefreshCw, 
  Settings, 
  ShieldAlert, 
  Unlock, 
  Upload
} from "lucide-react";
import { useState } from "react";

// SecurityPolicyCard component
interface SecurityPolicyCardProps {
  title: string;
  description: string;
  status: "enabled" | "disabled" | "partial";
  lastUpdated: string;
  category: string;
  onToggle: () => void;
}

function SecurityPolicyCard({
  title,
  description,
  status,
  lastUpdated,
  category,
  onToggle
}: SecurityPolicyCardProps) {
  const isEnabled = status === "enabled";
  
  const getStatusBadge = () => {
    switch (status) {
      case "enabled":
        return <Badge className="bg-emerald-100 text-emerald-800">Enabled</Badge>;
      case "disabled":
        return <Badge variant="outline" className="text-gray-500">Disabled</Badge>;
      case "partial":
        return <Badge className="bg-amber-100 text-amber-800">Partial</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="outline">{category}</Badge>
          {getStatusBadge()}
        </div>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor={`toggle-${title}`} className="text-sm mr-2">
              {isEnabled ? "Enabled" : "Disabled"}
            </Label>
            <Switch
              id={`toggle-${title}`}
              checked={isEnabled}
              onCheckedChange={onToggle}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SecurityPoliciesPage() {
  const [activeTab, setActiveTab] = useState("authentication");
  
  // Sample security policies
  const [securityPolicies, setSecurityPolicies] = useState([
    {
      id: 1,
      title: "Multi-Factor Authentication",
      description: "Require two-factor authentication for all administrative users",
      status: "enabled" as const,
      lastUpdated: "Sep 15, 2023",
      category: "Authentication",
    },
    {
      id: 2,
      title: "Password Complexity",
      description: "Enforce strong password requirements including minimum length and character types",
      status: "enabled" as const,
      lastUpdated: "Sep 10, 2023",
      category: "Authentication",
    },
    {
      id: 3,
      title: "Session Timeout",
      description: "Automatically log out inactive users after 30 minutes",
      status: "enabled" as const,
      lastUpdated: "Sep 5, 2023",
      category: "Authentication",
    },
    {
      id: 4,
      title: "API Rate Limiting",
      description: "Limit API requests to prevent abuse and ensure fair usage",
      status: "enabled" as const,
      lastUpdated: "Aug 28, 2023",
      category: "Access Control",
    },
    {
      id: 5,
      title: "IP Allowlisting",
      description: "Restrict access to specific IP addresses or ranges",
      status: "disabled" as const,
      lastUpdated: "Aug 20, 2023",
      category: "Access Control",
    },
    {
      id: 6,
      title: "Data Encryption",
      description: "Encrypt sensitive data at rest and in transit",
      status: "enabled" as const,
      lastUpdated: "Aug 15, 2023",
      category: "Data Protection",
    },
    {
      id: 7,
      title: "Vulnerability Scanning",
      description: "Regular scanning of infrastructure for security vulnerabilities",
      status: "partial" as const,
      lastUpdated: "Aug 10, 2023",
      category: "Compliance",
    },
    {
      id: 8,
      title: "Audit Logging",
      description: "Log all security-relevant events for auditing purposes",
      status: "enabled" as const,
      lastUpdated: "Aug 5, 2023",
      category: "Compliance",
    },
  ]);
  
  const togglePolicyStatus = (policyId: number) => {
    setSecurityPolicies(policies => 
      policies.map(policy => {
        if (policy.id === policyId) {
          const newStatus = policy.status === "enabled" ? "disabled" : "enabled";
          return { ...policy, status: newStatus };
        }
        return policy;
      })
    );
  };
  
  // Filter policies based on active tab
  const filteredPolicies = activeTab === "all" 
    ? securityPolicies 
    : securityPolicies.filter(policy => policy.category.toLowerCase() === activeTab);
  
  // Calculate security score
  const enabledPolicies = securityPolicies.filter(policy => policy.status === "enabled").length;
  const totalPolicies = securityPolicies.length;
  const securityScore = Math.round((enabledPolicies / totalPolicies) * 100);
  
  return (
    <DashboardLayout title="Security Policies">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Security Policies</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage security and compliance policies for your platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-gray-900">{securityScore}%</div>
              <div className={`p-2 rounded-full ${securityScore >= 75 ? 'bg-emerald-100' : securityScore >= 50 ? 'bg-amber-100' : 'bg-red-100'}`}>
                {securityScore >= 75 ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                ) : securityScore >= 50 ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full">
              <div 
                className={`h-full rounded-full ${
                  securityScore >= 75 ? 'bg-emerald-500' : securityScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${securityScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {enabledPolicies} of {totalPolicies} policies enabled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-sm">MFA Enabled</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-sm">Password Policy</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-sm">Session Management</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Access Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-sm">Rate Limiting</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm">IP Restrictions</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-sm">Role-Based Access</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm">Vulnerability Scanning</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-sm">Audit Logging</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-sm">Data Encryption</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start gap-4">
        <Tabs 
          defaultValue="authentication"
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All Policies</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="access control">Access Control</TabsTrigger>
            <TabsTrigger value="data protection">Data Protection</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Security Policy</DialogTitle>
              <DialogDescription>
                Define a new security policy for your platform
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="policy-name">Policy Name</Label>
                <Input id="policy-name" placeholder="e.g., API Access Control" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="policy-description">Description</Label>
                <Input id="policy-description" placeholder="Brief description of this policy" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="policy-category">Category</Label>
                <select
                  id="policy-category"
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Authentication">Authentication</option>
                  <option value="Access Control">Access Control</option>
                  <option value="Data Protection">Data Protection</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="policy-enabled" className="flex-1">Enable Policy</Label>
                  <Switch id="policy-enabled" defaultChecked />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Policy Configuration</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2 rounded-md border p-3">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-gray-500">
                        Send email alerts on policy violations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2 rounded-md border p-3">
                    <div className="space-y-0.5">
                      <Label>Automatic Remediation</Label>
                      <p className="text-xs text-gray-500">
                        Automatically attempt to fix policy violations
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2 rounded-md border p-3">
                    <div className="space-y-0.5">
                      <Label>Log All Events</Label>
                      <p className="text-xs text-gray-500">
                        Create audit logs for all policy-related events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" className="mr-2">
                Cancel
              </Button>
              <Button type="submit">
                Create Policy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPolicies.map((policy) => (
          <SecurityPolicyCard
            key={policy.id}
            title={policy.title}
            description={policy.description}
            status={policy.status}
            lastUpdated={policy.lastUpdated}
            category={policy.category}
            onToggle={() => togglePolicyStatus(policy.id)}
          />
        ))}
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Security Compliance Report</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
          <CardDescription>
            Overview of platform security compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Authentication & Access Control</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Multi-factor authentication</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Password complexity requirements</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>IP access restrictions</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Needs Attention</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Data Protection</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Data encryption at rest</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Data encryption in transit</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Data backup and recovery</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">Compliant</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Compliance & Monitoring</h3>
              <div className="bg-gray-50 rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" />
                    <span>Security audit logging</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>Vulnerability scanning</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">Partial</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span>Penetration testing</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Not Compliant</Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Last compliance check: September 15, 2023
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Compliance Check
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
