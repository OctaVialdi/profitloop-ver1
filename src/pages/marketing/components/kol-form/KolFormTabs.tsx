
import React from "react";
import { SocialMediaTab } from "./tabs/SocialMediaTab";
import { RatesTab } from "./tabs/RatesTab";
import { MetricsTab } from "./tabs/MetricsTab";
import { GeneralTab } from "./tabs/GeneralTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KolFormTabsProps {
  formData: Record<string, any>;
  handleChange: (field: string, value: any) => void;
  categories: string[];
}

export const KolFormTabs: React.FC<KolFormTabsProps> = ({ formData, handleChange, categories }) => {
  const [activeTab, setActiveTab] = React.useState("social");

  return (
    <div>
      {activeTab === "social" && (
        <SocialMediaTab formData={formData} handleChange={handleChange} />
      )}
      {activeTab === "rates" && (
        <RatesTab formData={formData} handleChange={handleChange} />  
      )}
      {activeTab === "general" && (
        <GeneralTab formData={formData} handleChange={handleChange} categories={categories} />
      )}
    </div>
  );
};
