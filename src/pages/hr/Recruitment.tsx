
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export default function HRRecruitment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine the active tab based on the current URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/hr/recruitment/dashboard")) return "dashboard";
    if (path.includes("/hr/recruitment/candidates")) return "candidates";
    if (path.includes("/hr/recruitment/positions")) return "positions";
    if (path.includes("/hr/recruitment/invitations")) return "invitations";
    if (path.includes("/hr/recruitment/evaluation")) return "evaluation";
    return "dashboard"; // Default tab
  };
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    navigate(`/hr/recruitment/${value}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Management</CardTitle>
          <CardDescription>
            Manage job openings and candidate applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={getActiveTab()}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="positions">Job Positions</TabsTrigger>
              <TabsTrigger value="invitations">Invitation Links</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation Settings</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Render the nested routes */}
      <Outlet />
    </div>
  );
}
