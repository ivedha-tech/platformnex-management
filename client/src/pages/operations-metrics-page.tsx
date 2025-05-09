import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { KpiCard } from "@/components/ui/kpi-card";
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Activity,
  RefreshCw,
  BadgeCheck,
  Timer,
  RotateCcw,
  PlugZap,
  GitPullRequest,
  Link,
  Users
} from "lucide-react";

// Sample data for deployments over time
const deploymentData = [
  { name: "Jan", successful: 65, failed: 4 },
  { name: "Feb", successful: 59, failed: 2 },
  { name: "Mar", successful: 80, failed: 3 },
  { name: "Apr", successful: 81, failed: 1 },
  { name: "May", successful: 56, failed: 5 },
  { name: "Jun", successful: 55, failed: 2 },
  { name: "Jul", successful: 40, failed: 1 },
];

// Sample data for resource utilization
const resourceData = [
  { name: "Week 1", cpu: 40, memory: 60, storage: 30 },
  { name: "Week 2", cpu: 45, memory: 55, storage: 35 },
  { name: "Week 3", cpu: 60, memory: 70, storage: 40 },
  { name: "Week 4", cpu: 75, memory: 85, storage: 45 },
  { name: "Week 5", cpu: 65, memory: 75, storage: 50 },
  { name: "Week 6", cpu: 70, memory: 80, storage: 55 },
  { name: "Week 7", cpu: 55, memory: 65, storage: 60 },
];

// Sample data for response times
const responseTimeData = [
  { name: "00:00", value: 1.2 },
  { name: "04:00", value: 0.9 },
  { name: "08:00", value: 2.3 },
  { name: "12:00", value: 1.7 },
  { name: "16:00", value: 2.1 },
  { name: "20:00", value: 1.4 },
];

export default function OperationsMetricsPage() {
  return (
    <DashboardLayout title="Operations Metrics">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Operations Metrics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Monitor the health and performance of your platform infrastructure
        </p>
      </div>
      
      {/* Governance & Compliance KPIs */}
      <div className="mb-8">
        <h3 className="text-lg font-medium flex items-center text-blue-700 mb-4">
          <Shield className="h-5 w-5 mr-2" />
          Governance & Compliance KPIs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Policy Violation Count"
            value="14"
            icon={Shield}
            iconBgColor="bg-red-50"
            iconColor="text-red-500"
            trend={{ value: "3", label: "since last month", isPositive: true }}
          />
          
          <KpiCard
            title="Drift Detection Events"
            value="27"
            icon={AlertTriangle}
            iconBgColor="bg-green-50"
            iconColor="text-green-500"
            trend={{ value: "8", label: "this month", isPositive: true }}
          />
          
          <KpiCard
            title="Unapproved Deployments"
            value="5"
            icon={Clock}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-500"
            trend={{ value: "2", label: "past 30 days", isPositive: true }}
          />
          
          <KpiCard
            title="Secrets Misconfiguration"
            value="3"
            icon={Activity}
            iconBgColor="bg-green-50"
            iconColor="text-red-500"
            trend={{ value: "5", label: "since last quarter", isPositive: true }}
          />
        </div>
      </div>
      
      {/* Operational Efficiency KPIs */}
      <div className="mb-8">
        <h3 className="text-lg font-medium flex items-center text-blue-700 mb-4">
          <RefreshCw className="h-5 w-5 mr-2" />
          Operational Efficiency KPIs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Time to Update Golden Path"
            value="3.5 days"
            icon={RefreshCw}
            iconBgColor="bg-yellow-50"
            iconColor="text-yellow-500"
            trend={{ value: "12%", label: "since last quarter", isNegative: true }}
          />
          
          <KpiCard
            title="Platform Incident MTTR"
            value="47 min"
            icon={Timer}
            iconBgColor="bg-red-50"
            iconColor="text-red-500"
            trend={{ value: "15%", label: "since last month", isPositive: true }}
          />
          
          <KpiCard
            title="Deployment Success Rate"
            value="94.2%"
            icon={BadgeCheck}
            iconBgColor="bg-green-50"
            iconColor="text-green-500"
            trend={{ value: "3.1%", label: "since last month", isPositive: true }}
          />
          
          <KpiCard
            title="Rollback Frequency"
            value="8"
            icon={RotateCcw}
            iconBgColor="bg-red-50"
            iconColor="text-red-500"
            trend={{ value: "2", label: "monthly average", isPositive: true }}
          />
        </div>
      </div>
      
      {/* Plugin & Ecosystem KPIs */}
      <div className="mb-8">
        <h3 className="text-lg font-medium flex items-center text-blue-700 mb-4">
          <PlugZap className="h-5 w-5 mr-2" />
          Plugin & Ecosystem KPIs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Plugins"
            value="48"
            icon={PlugZap}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-500"
            trend={{ value: "5", label: "since last quarter", isPositive: true }}
          />
          
          <KpiCard
            title="Top 3 Tools Consumed via Platform"
            value="GitHub, Pager Duty, Sonar Q"
            valueClassName="text-base"
            icon={GitPullRequest}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-500"
          />
          
          <KpiCard
            title="Time to Integrate New Plugin"
            value="8 Days"
            icon={Link}
            iconBgColor="bg-yellow-50"
            iconColor="text-yellow-500"
            trend={{ value: "-10%", label: "since last quarter", isNegative: true }}
          />
          
          <KpiCard
            title="Community Contributions"
            value="23"
            icon={Users}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-500"
            trend={{ value: "24%", label: "year-to-date", isPositive: true }}
          />
        </div>
      </div>
      
      {/* Main metrics dashboard */}
      <Tabs defaultValue="deployments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="resources">Resource Utilization</TabsTrigger>
          <TabsTrigger value="performance">Platform Performance</TabsTrigger>
        </TabsList>
        
        {/* Deployments Tab */}
        <TabsContent value="deployments">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Deployments Over Time</CardTitle>
                <CardDescription>Track successful and failed deployments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={deploymentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="successful" stackId="a" fill="#1565C0" name="Successful" />
                      <Bar dataKey="failed" stackId="a" fill="#F44336" name="Failed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Deployments</p>
                      <p className="text-2xl font-bold">458</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg. Deploy Time</p>
                      <p className="text-2xl font-bold">8.5 mins</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rollbacks</p>
                      <p className="text-2xl font-bold">12 (2.6%)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Failures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 rounded-md">
                      <p className="text-sm font-medium text-red-800">Resource Limit Exceeded</p>
                      <p className="text-xs text-red-600 mt-1">2 days ago • Database Service</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-md">
                      <p className="text-sm font-medium text-amber-800">Configuration Error</p>
                      <p className="text-xs text-amber-600 mt-1">5 days ago • Auth Service</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Resource Utilization Tab */}
        <TabsContent value="resources">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage Trends</CardTitle>
                <CardDescription>CPU, Memory, and Storage utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={resourceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="cpu" 
                        stackId="1" 
                        stroke="#1565C0" 
                        fill="#1565C0" 
                        fillOpacity={0.5} 
                        name="CPU Usage" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="memory" 
                        stackId="2" 
                        stroke="#0097A7" 
                        fill="#0097A7" 
                        fillOpacity={0.5} 
                        name="Memory Usage" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="storage" 
                        stackId="3" 
                        stroke="#FFA000" 
                        fill="#FFA000" 
                        fillOpacity={0.5} 
                        name="Storage Usage" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">65%</span>
                    <span className="text-sm text-emerald-600">+5% from avg</span>
                  </div>
                  <div className="mt-4 h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">75%</span>
                    <span className="text-sm text-amber-600">+15% from avg</span>
                  </div>
                  <div className="mt-4 h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-cyan-600 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Storage Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">55%</span>
                    <span className="text-sm text-emerald-600">-5% from avg</span>
                  </div>
                  <div className="mt-4 h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "55%" }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Platform Performance Tab */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average response time throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={responseTimeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}s`} />
                      <Tooltip formatter={(value) => [`${value}s`, "Response Time"]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#1565C0"
                        name="Response Time"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg. Page Load</p>
                      <p className="text-2xl font-bold">2.3s</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Error Rate</p>
                      <p className="text-2xl font-bold">0.05%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Throughput</p>
                      <p className="text-2xl font-bold">2.5k req/min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-md">
                      <p className="text-sm font-medium text-green-800">All Systems Normal</p>
                      <p className="text-xs text-green-600 mt-1">Performance within expected thresholds</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-800">Database Optimization</p>
                      <p className="text-xs text-gray-600 mt-1">Recommended for query performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
