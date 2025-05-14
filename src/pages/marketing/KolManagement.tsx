import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EngagementAnalysis } from "./components/EngagementAnalysis";
import { RoiAnalysis } from "./components/RoiAnalysis";
import { ConversionMetrics } from "./components/ConversionMetrics";

// Import our new components
import { KolDetailView } from "./components/KolDetailView";
import { KolAddForm } from "./components/KolAddForm";
import { KolList } from "./components/KolList";
import { KolDashboardCards } from "./components/KolDashboardCards";
import { KolAnalyticsHeader } from "./components/KolAnalyticsHeader";

// Import our new hook
import { useKols, Kol } from "@/hooks/useKols";
import { useOrganizationSetup } from "@/hooks/useOrganizationSetup";

const KolManagement = () => {
  const [activeTab, setActiveTab] = useState("engagement");
  const [timeFilter, setTimeFilter] = useState("last-month");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("list"); // "list", "add", or "detail"
  const [selectedKol, setSelectedKol] = useState<Kol | null>(null);
  
  const { organization } = useOrganizationSetup();
  const { 
    kols, 
    loading, 
    createKol, 
    updateKol, 
    deleteKol, 
    fetchKols,
    metrics 
  } = useKols();

  // Filter KOLs based on search query
  const filteredKols = kols.filter(kol => 
    kol.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (kol.category && kol.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle KOL selection
  const handleKolSelect = (kol: Kol) => {
    setSelectedKol(kol);
    setCurrentView("detail");
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get badge color based on score
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  // Get active KOLs count
  const activeKolsCount = kols.filter(kol => kol.status === "Active").length;

  // Render the current view content
  const renderContent = () => {
    switch (currentView) {
      case "detail":
        return (
          <Card className="w-full bg-white shadow-sm border">
            <CardContent className="p-0">
              <KolDetailView 
                selectedKol={selectedKol} 
                setCurrentView={setCurrentView} 
                formatNumber={formatNumber}
                onUpdate={updateKol}
                onDelete={deleteKol}
              />
            </CardContent>
          </Card>
        );
        
      case "add":
        return (
          <Card className="w-full bg-white shadow-sm border">
            <CardContent className="p-6">
              <KolAddForm 
                setCurrentView={setCurrentView} 
                onCreateKol={createKol}
                organizationId={organization?.id}
              />
            </CardContent>
          </Card>
        );
        
      case "list":
      default:
        return (
          <Card className="w-full bg-white shadow-sm border">
            <CardContent className="p-6">
              <KolList 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredKols={filteredKols}
                handleKolSelect={handleKolSelect}
                formatNumber={formatNumber}
                getScoreBadgeColor={getScoreBadgeColor}
                getStatusBadgeColor={getStatusBadgeColor}
                loading={loading}
              />
            </CardContent>
          </Card>
        );
    }
  };

  // Render the analytics component based on active tab
  const renderAnalyticsComponent = () => {
    switch (activeTab) {
      case "engagement":
        return <EngagementAnalysis timeFilter={timeFilter} kols={kols} />;
      case "roi":
        return <RoiAnalysis timeFilter={timeFilter} kols={kols} metrics={metrics} />;
      case "conversion":
        return <ConversionMetrics timeFilter={timeFilter} kols={kols} metrics={metrics} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (organization?.id) {
      fetchKols();
    }
  }, [organization?.id, fetchKols]);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 px-0">
      <KolAnalyticsHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        timeFilter={timeFilter}
      >
        {renderAnalyticsComponent()}
      </KolAnalyticsHeader>
      
      <Separator className="my-8" />
      
      <div className="w-full">
        <div className="px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">KOL Management</h2>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button 
                variant="outline" 
                className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] border-0 gap-2"
                onClick={() => setCurrentView("list")}
              >
                <Users size={16} />
                <span>KOL List</span>
              </Button>
              <Button 
                variant="outline" 
                className="bg-[#1A1F2C] text-white hover:bg-gray-800 border-0 gap-2"
                onClick={() => setCurrentView("add")}
              >
                <Plus size={16} />
                <span>Add KOL</span>
              </Button>
            </div>
          </div>
          
          <KolDashboardCards 
            activeKols={kols.filter(kol => kol.status === "Active").length} 
            totalKols={kols.length}
            metrics={metrics}
          />
          
          <div className="mb-6"></div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default KolManagement;
