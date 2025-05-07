
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecruitmentDashboard from "@/components/hr/recruitment/RecruitmentDashboard";
import CandidateList from "@/components/hr/recruitment/CandidateList";
import JobPositionsList from "@/components/hr/recruitment/JobPositionsList";
import InvitationLinks from "@/components/hr/recruitment/InvitationLinks";
import EvaluationSettingsTab from "@/components/hr/recruitment/EvaluationSettingsTab";
import { useSearchParams } from "react-router-dom";

export default function HRRecruitment() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchParams] = useSearchParams();
  
  // If there's a tab parameter in the URL or jobId parameter (which means we want the invitations tab)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const jobIdParam = searchParams.get("jobId");
    
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (jobIdParam) {
      setActiveTab("invitations");
    }
  }, [searchParams]);

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
            defaultValue="dashboard" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="positions">Job Positions</TabsTrigger>
              <TabsTrigger value="invitations">Invitation Links</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <RecruitmentDashboard />
            </TabsContent>
            
            <TabsContent value="candidates">
              <CandidateList />
            </TabsContent>
            
            <TabsContent value="positions">
              <JobPositionsList />
            </TabsContent>
            
            <TabsContent value="invitations">
              <InvitationLinks />
            </TabsContent>
            
            <TabsContent value="evaluation">
              <EvaluationSettingsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
