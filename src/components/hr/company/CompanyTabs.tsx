
import React from 'react';
import { Laptop, FileWarning, FileText, History, Network } from "lucide-react";

interface CompanyTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CompanyTabs: React.FC<CompanyTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", label: "Company Profile", icon: null },
    { id: "assets", label: "Assets", icon: <Laptop className="w-4 h-4" /> },
    { id: "reprimand", label: "Reprimand", icon: <FileWarning className="w-4 h-4" /> },
    { id: "files", label: "Files", icon: <FileText className="w-4 h-4" /> },
    { id: "history", label: "Change History", icon: <History className="w-4 h-4" /> },
    { id: "org-structure", label: "Organizational Structure", icon: <Network className="w-4 h-4" /> },
  ];

  return (
    <div className="flex space-x-1 border-b overflow-x-auto pb-px mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors rounded-t-lg ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground border-b-2 border-primary font-medium"
              : "hover:bg-muted"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CompanyTabs;
