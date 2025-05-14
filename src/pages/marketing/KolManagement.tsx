
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EngagementAnalysis } from "./components/EngagementAnalysis";
import { RoiAnalysis } from "./components/RoiAnalysis";
import { ConversionMetrics } from "./components/ConversionMetrics";

// Import our components
import { KolDetailView } from "./components/KolDetailView";
import { KolAddForm } from "./components/kol-form"; 
import { KolList } from "./components/KolList";
import { KolDashboardCards } from "./components/KolDashboardCards";
import { KolAnalyticsHeader } from "./components/KolAnalyticsHeader";
import { useKols, Kol } from "@/hooks/useKols";

const KolManagement = () => {
  const [activeTab, setActiveTab] = useState("engagement");
  const [timeFilter, setTimeFilter] = useState("last-month");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("list"); // "list", "add", or "detail"
  const [selectedKol, setSelectedKol] = useState<Kol | null>(null);

  const { kols, isLoading, fetchKols } = useKols();

  useEffect(() => {
    fetchKols();
  }, [fetchKols]);

  // Filter KOLs based on search query
  const filteredKols = kols.filter(kol => 
    kol.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    kol.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  const activeKolsCount = kols.filter(kol => kol.is_active).length;

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
              />
            </CardContent>
          </Card>
        );
        
      case "add":
        return (
          <Card className="w-full bg-white shadow-sm border">
            <CardContent className="p-6">
              <KolAddForm setCurrentView={setCurrentView} />
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
                handleKolSelect={setSelectedKol}
                formatNumber={formatNumber}
                getScoreBadgeColor={getScoreBadgeColor}
                getStatusBadgeColor={getStatusBadgeColor}
                isLoading={isLoading}
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
        return <EngagementAnalysis timeFilter={timeFilter} />;
      case "roi":
        return <RoiAnalysis timeFilter={timeFilter} />;
      case "conversion":
        return <ConversionMetrics timeFilter={timeFilter} />;
      default:
        return null;
    }
  };

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
            activeKols={activeKolsCount} 
            totalKols={kols.length}
          />
          
          <div className="mb-6"></div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default KolManagement;
