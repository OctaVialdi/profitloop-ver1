import React from "react";
import { BSCDashboard } from "@/components/dashboard/BSCDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/hooks/useOrganization";
import { ArrowUpRight, BarChart3, ClipboardCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
const Dashboard = () => {
  const {
    organization
  } = useOrganization();
  const stats = [{
    title: "Active Users",
    value: "237",
    trend: "+12%",
    trendType: "up",
    description: "Daily active users (DAU)",
    icon: <Users className="h-5 w-5" />
  }, {
    title: "System Uptime",
    value: "99.9%",
    trend: "+0.2%",
    trendType: "up",
    description: "Last 30 days",
    icon: <BarChart3 className="h-5 w-5" />
  }, {
    title: "Response Time",
    value: "124ms",
    trend: "-5%",
    trendType: "down",
    description: "Average API response",
    icon: <ClipboardCheck className="h-5 w-5" />
  }];
  return <div className="space-y-8 animate-fade-in">
      {/* Header section with gradient */}
      

      {/* Stats Overview */}
      

      {/* Quick Actions Section */}
      

      {/* BSC Dashboard Section with modern styling */}
      <div className="rounded-xl border bg-card overflow-hidden shadow transition-shadow hover:shadow-md">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-1">
          <BSCDashboard />
        </div>
      </div>
    </div>;
};
export default Dashboard;