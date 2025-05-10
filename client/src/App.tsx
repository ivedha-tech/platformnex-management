import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import DashboardPage from "@/pages/dashboard-page";
import DeveloperExperiencePage from "@/pages/developer-experience-page";
import OperationsMetricsPage from "@/pages/operations-metrics-page";
import ActivityHistoryPage from "@/pages/activity-history-page";
import GoldenPathPage from "@/pages/golden-path-page";
import OrchestratorConfigPage from "@/pages/orchestrator-config-page";
// Flow Control Page has been merged into Golden Path page
import UserManagementPage from "@/pages/user-management-page";
import SecurityPoliciesPage from "@/pages/security-policies-page";
import AuditLogsPage from "@/pages/audit-logs-page";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/developer-experience" component={DeveloperExperiencePage} />
      <ProtectedRoute path="/operations-metrics" component={OperationsMetricsPage} />
      <ProtectedRoute path="/activity-history" component={ActivityHistoryPage} />
      <ProtectedRoute path="/golden-path" component={GoldenPathPage} />
      <ProtectedRoute path="/orchestrator-config" component={OrchestratorConfigPage} />
      {/* Flow Control has been merged into Golden Path page */}
      <ProtectedRoute path="/user-management" component={UserManagementPage} />
      <ProtectedRoute path="/security-policies" component={SecurityPoliciesPage} />
      <ProtectedRoute path="/audit-logs" component={AuditLogsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
