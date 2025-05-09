import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Activity,
  Clock,
  FileText,
  Settings,
  Users,
  Shield,
  ClipboardList,
  FileCog,
  Network,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  currentPath: string;
  onClick?: () => void;
}

function SidebarLink({ href, icon, children, currentPath, onClick }: SidebarLinkProps) {
  const isActive = currentPath === href;
  
  return (
    <div onClick={onClick}>
      <Link href={href}>
        <div
          className={cn(
            "flex items-center px-4 py-2 text-sm rounded-md group transition-colors cursor-pointer text-sidebar-foreground hover:bg-white/10",
            isActive
              ? "bg-white/20 border-l-2 border-sidebar-foreground font-medium"
              : ""
          )}
        >
          <div className={cn(
            "mr-3 h-5 w-5 text-sidebar-foreground",
            isActive
              ? "opacity-100" 
              : "opacity-80 group-hover:opacity-100"
          )}>
            {icon}
          </div>
          {children}
        </div>
      </Link>
    </div>
  );
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Close sidebar on mobile when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed z-50 top-0 left-0 p-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center h-10 w-10 rounded-md bg-sidebar shadow-md text-sidebar-foreground focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-sidebar shadow-md fixed md:sticky top-0 bottom-0 left-0 z-40 flex flex-col h-screen transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-lg font-semibold text-sidebar-foreground">PlatformNEX</h1>
          <p className="text-sm text-sidebar-foreground opacity-80">Management Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {/* Overview Section */}
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider mb-2">
              Overview
            </p>
            <ul className="space-y-1">
              <li>
                <SidebarLink
                  href="/developer-experience"
                  icon={<BarChart3 />}
                  currentPath={location}
                  onClick={() => setIsOpen(false)}
                >
                  Developer Experience
                </SidebarLink>
              </li>
              <li>
                <SidebarLink
                  href="/operations-metrics"
                  icon={<Activity />}
                  currentPath={location}
                  onClick={() => setIsOpen(false)}
                >
                  Operations Metrics
                </SidebarLink>
              </li>
              <li>
                <SidebarLink
                  href="/activity-history"
                  icon={<Clock />}
                  currentPath={location}
                  onClick={() => setIsOpen(false)}
                >
                  Activity History
                </SidebarLink>
              </li>
            </ul>
          </div>

          {/* Management Section */}
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider mb-2">
              Management
            </p>
            <ul className="space-y-1">
              <li>
                <SidebarLink
                  href="/golden-path"
                  icon={<FileText />}
                  currentPath={location}
                  onClick={() => setIsOpen(false)}
                >
                  Golden Path & Templates
                </SidebarLink>
              </li>
              <li>
                <SidebarLink
                  href="/orchestrator-config"
                  icon={<FileCog />}
                  currentPath={location}
                  onClick={() => setIsOpen(false)}
                >
                  Orchestrator Config
                </SidebarLink>
              </li>
              <li>
                <SidebarLink
                  href="/flow-control"
                  icon={<Network />}
                  currentPath={location}
                  onClick={() => setIsOpen(false)}
                >
                  Execution Flow Control
                </SidebarLink>
              </li>
            </ul>
          </div>

          {/* Administration Section */}
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider mb-2">
              Administration
            </p>
            <ul className="space-y-1">
              <li>
                <SidebarLink
                  href="/user-management"
                  icon={<Users />}
                  currentPath={location}
                  onClick={() => setIsOpen(false)}
                >
                  User Management
                </SidebarLink>
              </li>
              <li>
                <SidebarLink
                  href="/security-policies"
                  icon={<Shield />}
                  currentPath={location}
                  onClick={() => setIsOpen(false)}
                >
                  Security Policies
                </SidebarLink>
              </li>
              <li>
                <SidebarLink
                  href="/audit-logs"
                  icon={<ClipboardList />}
                  currentPath={location}
                  onClick={() => setIsOpen(false)}
                >
                  Audit Logs
                </SidebarLink>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sidebar-foreground">
              <span className="text-xs font-medium">
                {user?.firstName?.[0] || user?.username?.[0] || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground opacity-80">
                {user?.role === 'admin' ? 'Platform Administrator' : 'Platform Engineer'}
              </p>
            </div>
          </div>
          
          <Separator className="my-4 bg-sidebar-border" />
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground hover:bg-white/10"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {logoutMutation.isPending ? "Logging out..." : "Sign out"}
          </Button>
        </div>
      </aside>
    </>
  );
}
