
import React from "react";
import { BSCDashboard } from "@/components/dashboard/BSCDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrganization } from "@/hooks/useOrganization";
import { ArrowUpRight, BarChart3, ClipboardCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const Dashboard = () => {
  const { organization } = useOrganization();

  const stats = [
    { 
      title: "Active Users", 
      value: "237", 
      trend: "+12%", 
      trendType: "up", 
      description: "Daily active users (DAU)",
      icon: <Users className="h-5 w-5" />
    },
    { 
      title: "System Uptime", 
      value: "99.9%", 
      trend: "+0.2%", 
      trendType: "up", 
      description: "Last 30 days",
      icon: <BarChart3 className="h-5 w-5" />
    },
    { 
      title: "Response Time", 
      value: "124ms", 
      trend: "-5%", 
      trendType: "down", 
      description: "Average API response",
      icon: <ClipboardCheck className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section with gradient */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 rounded-xl border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-muted-foreground max-w-3xl">
              {organization?.name ? `${organization.name}'s` : "Your"} performance metrics and key indicators at a glance. Use this overview to make data-driven decisions.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="hover:bg-muted/50 transition-colors">
              Refresh Data
            </Button>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card 
            key={i} 
            className="hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-sm overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">{stat.title}</CardTitle>
              <span className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {stat.icon}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  stat.trendType === "up" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                }`}>
                  {stat.trendType === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : null}
                  {stat.trend}
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span className="ml-2 text-sm text-muted-foreground cursor-help">
                      {stat.description}
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="w-80">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{stat.title} Details</h4>
                      <p className="text-sm text-muted-foreground">
                        This metric shows {stat.description.toLowerCase()} for your organization's performance.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Section */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400">
            Quick Actions
          </CardTitle>
          <CardDescription>Streamline your workflow with these shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Reports', 'Analytics', 'Settings', 'Help'].map((action, i) => (
              <Button 
                key={i}
                variant="ghost" 
                className="flex flex-col h-20 gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 shadow-sm hover:shadow transition-all"
              >
                <span className="text-sm font-medium">{action}</span>
                <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* BSC Dashboard Section with modern styling */}
      <div className="rounded-xl border bg-card overflow-hidden shadow transition-shadow hover:shadow-md">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-1">
          <BSCDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
