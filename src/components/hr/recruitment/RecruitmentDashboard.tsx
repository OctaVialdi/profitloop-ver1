
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseIcon, UserPlusIcon, ClipboardCheckIcon, UserIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, description, icon }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-md bg-primary/10 p-1.5 text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function RecruitmentDashboard() {
  // This would be replaced with actual data from your backend
  const stats = [
    {
      title: "Open Positions",
      value: 8,
      description: "Active job openings",
      icon: <BriefcaseIcon className="h-5 w-5" />
    },
    {
      title: "New Candidates",
      value: 24,
      description: "Applied this week",
      icon: <UserPlusIcon className="h-5 w-5" />
    },
    {
      title: "Interviews Scheduled",
      value: 12,
      description: "For the next 7 days",
      icon: <ClipboardCheckIcon className="h-5 w-5" />
    },
    {
      title: "Hired",
      value: 3,
      description: "This month",
      icon: <UserIcon className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Recruitment Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No data available. Connect to your database to see recent applications.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No interviews scheduled. Add candidates to schedule interviews.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
