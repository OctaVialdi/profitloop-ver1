
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KolList from "./KolList";
import KolDetailView from "./KolDetailView";
import KolDashboardCards from "./KolDashboardCards";

const KolManagement: React.FC = () => {
  const [selectedKolId, setSelectedKolId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const handleKolSelect = (kolId: string) => {
    setSelectedKolId(kolId);
    setActiveTab("detail");
  };

  const handleBackToList = () => {
    setSelectedKolId(null);
    setActiveTab("dashboard");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">KOL Management</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="kols">KOL List</TabsTrigger>
          <TabsTrigger 
            value="detail" 
            disabled={!selectedKolId}
          >
            KOL Detail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <KolDashboardCards />
        </TabsContent>

        <TabsContent value="kols" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Opinion Leaders</CardTitle>
            </CardHeader>
            <CardContent>
              <KolList onKolSelect={handleKolSelect} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detail" className="mt-6">
          {selectedKolId ? (
            <KolDetailView 
              kolId={selectedKolId} 
              onBack={handleBackToList} 
            />
          ) : (
            <Card>
              <CardContent className="p-6">
                <p>Please select a KOL to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KolManagement;
