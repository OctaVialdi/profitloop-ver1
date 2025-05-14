
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralTab } from "./tabs/GeneralTab";
import { SocialMediaTab } from "./tabs/SocialMediaTab";
import { RatesTab } from "./tabs/RatesTab";
import { MetricsTab } from "./tabs/MetricsTab";

interface KolFormTabsProps {
  formData: {
    full_name: string;
    category: string;
    total_followers: number;
    engagement_rate: number;
    is_active: boolean;
  };
  handleChange: (field: string, value: any) => void;
  categories: string[];
}

export const KolFormTabs: React.FC<KolFormTabsProps> = ({
  formData,
  handleChange,
  categories
}) => {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="w-full grid grid-cols-4 bg-gray-100/50 rounded-md">
        <TabsTrigger value="general" className="data-[state=active]:bg-white">General</TabsTrigger>
        <TabsTrigger value="social" className="data-[state=active]:bg-white">Social Media</TabsTrigger>
        <TabsTrigger value="rates" className="data-[state=active]:bg-white">Rates</TabsTrigger>
        <TabsTrigger value="metrics" className="data-[state=active]:bg-white">Metrics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="mt-6">
        <GeneralTab 
          formData={formData}
          handleChange={handleChange}
          categories={categories}
        />
      </TabsContent>
      
      <TabsContent value="social" className="mt-6">
        <SocialMediaTab />
      </TabsContent>
      
      <TabsContent value="rates" className="mt-6">
        <RatesTab />
      </TabsContent>
      
      <TabsContent value="metrics" className="mt-6">
        <MetricsTab />
      </TabsContent>
    </Tabs>
  );
};
