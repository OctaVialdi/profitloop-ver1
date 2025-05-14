
import React from "react";
import { SocialMediaTab } from "./tabs/SocialMediaTab";
import { RatesTab } from "./tabs/RatesTab";
import { MetricsTab } from "./tabs/MetricsTab";
import { GeneralTab } from "./tabs/GeneralTab";

// Define a more specific interface for the formData
interface KolFormData {
  full_name: string;
  category: string;
  total_followers: number;
  engagement_rate: number;
  is_active: boolean;
  tempSocialMedia?: any[];
  tempRates?: any[];
  // Add any other fields that might be needed
}

interface KolFormTabsProps {
  formData: KolFormData;
  handleChange: (field: string, value: any) => void;
  categories: string[];
  activeTab?: string;
}

export const KolFormTabs: React.FC<KolFormTabsProps> = ({ 
  formData, 
  handleChange, 
  categories, 
  activeTab = "social" 
}) => {
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
      {activeTab === "metrics" && (
        <MetricsTab formData={formData} handleChange={handleChange} />
      )}
    </div>
  );
};
