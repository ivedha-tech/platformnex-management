import { useEffect } from "react";
import { useLocation } from "wouter";

export default function DashboardPage() {
  const [, navigate] = useLocation();
  
  // Redirect to the Developer Experience page by default
  useEffect(() => {
    navigate("/developer-experience");
  }, [navigate]);
  
  // This page just redirects to the default page
  return null;
}
