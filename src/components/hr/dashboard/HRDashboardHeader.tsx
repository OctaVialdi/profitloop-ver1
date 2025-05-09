
import React from "react";
import { useOrganization } from "@/hooks/useOrganization";

export function HRDashboardHeader() {
  const { organization } = useOrganization();
  
  // Get time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-8">
      {/* Decorative gradient blur effect */}
      <div className="absolute -top-24 -right-24 h-64 w-64 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 blur-2xl rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 h-48 w-48 bg-gradient-to-tr from-pink-400/20 to-indigo-400/20 blur-2xl rounded-full pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <p className="text-muted-foreground mb-1 font-medium">{getGreeting()}</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          HR Dashboard
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Overview of HR metrics and employee statistics for {organization?.name || "your organization"}. 
          Monitor workforce trends, compensation data, and department performance.
        </p>
      </div>
    </div>
  );
}
