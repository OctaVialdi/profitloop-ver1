
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReprimandTab from "@/components/hr/company/ReprimandTab";

export default function HRKinerja() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "reprimand", label: "Reprimand" },
    { id: "settings", label: "Pengaturan" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          {/* KPI Tabs */}
          <div className="flex space-x-1 border-b overflow-x-auto pb-px mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm transition-colors rounded-t-lg ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground border-b-2 border-primary font-medium"
                    : "hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {activeTab === "dashboard" && (
            <div className="p-4 border rounded-md">
              <h2 className="text-lg font-medium mb-4">KPI Dashboard</h2>
              <p className="text-muted-foreground">Performance metrics and evaluations will be displayed here.</p>
            </div>
          )}
          
          {activeTab === "reprimand" && <ReprimandTab />}
          
          {activeTab === "settings" && (
            <div className="p-4 border rounded-md">
              <h2 className="text-lg font-medium mb-4">Pengaturan</h2>
              <p className="text-muted-foreground">KPI settings and configuration options will be displayed here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
