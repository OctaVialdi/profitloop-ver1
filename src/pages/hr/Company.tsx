
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CompanyTabs from "@/components/hr/company/CompanyTabs";
import CompanyProfile from "@/components/hr/company/CompanyProfile";
import AssetsTab from "@/components/hr/company/AssetsTab";
import ReprimandTab from "@/components/hr/company/ReprimandTab";
import FilesTab from "@/components/hr/company/FilesTab";
import ChangeHistoryTab from "@/components/hr/company/ChangeHistoryTab";
import OrganizationalStructureTab from "@/components/hr/company/OrganizationalStructureTab";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

export default function HRCompany() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-4">
      <BreadcrumbNav 
        customLabels={{
          "company": "Company Profile",
          [activeTab]: activeTab === "profile" ? "Overview" : 
                      activeTab === "org-structure" ? "Organizational Structure" : 
                      activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        }}
      />
      
      <Card>
        <CardContent className="pt-6">
          <CompanyTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {activeTab === "profile" && <CompanyProfile />}
          {activeTab === "assets" && <AssetsTab />}
          {activeTab === "reprimand" && <ReprimandTab />}
          {activeTab === "files" && <FilesTab />}
          {activeTab === "history" && <ChangeHistoryTab />}
          {activeTab === "org-structure" && <OrganizationalStructureTab />}
        </CardContent>
      </Card>
    </div>
  );
}
