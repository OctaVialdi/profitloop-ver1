
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Import our tab components
import { KolGeneralTab } from "./kol-tabs/KolGeneralTab";
import { KolSocialMediaTab } from "./kol-tabs/KolSocialMediaTab";
import { KolRatesTab } from "./kol-tabs/KolRatesTab";
import { KolMetricsTab } from "./kol-tabs/KolMetricsTab";

interface KolDetailViewProps {
  selectedKol: any;
  setCurrentView: (view: string) => void;
  formatNumber: (num: number) => string;
}

export const KolDetailView: React.FC<KolDetailViewProps> = ({ 
  selectedKol, 
  setCurrentView, 
  formatNumber 
}) => {
  if (!selectedKol) return null;
  
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-transparent p-0"
              onClick={() => setCurrentView("list")}
            >
              <ArrowLeftCircle size={20} className="mr-2 text-gray-500" />
            </Button>
            Edit KOL: {selectedKol.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Manage KOL details, social media platforms, and rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            Cancel
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Update KOL
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 bg-gray-100/50 rounded-md">
          <TabsTrigger value="general" className="data-[state=active]:bg-white">General</TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-white">Social Media</TabsTrigger>
          <TabsTrigger value="rates" className="data-[state=active]:bg-white">Rates</TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-white">Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <KolGeneralTab selectedKol={selectedKol} formatNumber={formatNumber} />
        </TabsContent>
        
        <TabsContent value="social" className="mt-6">
          <KolSocialMediaTab selectedKol={selectedKol} formatNumber={formatNumber} />
        </TabsContent>
        
        <TabsContent value="rates" className="mt-6">
          <KolRatesTab selectedKol={selectedKol} />
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <KolMetricsTab selectedKol={selectedKol} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
