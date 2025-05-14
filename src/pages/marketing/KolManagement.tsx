
import { useState } from "react";
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

const KolManagement = () => {
  const [activeTab, setActiveTab] = useState("engagement");
  const [timeFilter, setTimeFilter] = useState("last-month");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("list"); // "list", "add", or "detail"
  const [selectedKol, setSelectedKol] = useState(null);

  // KOL data
  const kolData = [{
    id: 1,
    name: "Sarah Johnson",
    platforms: ["Instagram", "TikTok"],
    category: "Beauty",
    followers: 500000,
    engagement: 3.2,
    score: 78,
    status: "Active",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }, {
    id: 2,
    name: "Alex Chen",
    platforms: ["Instagram", "TikTok"],
    category: "Tech",
    followers: 350000,
    engagement: 2.8,
    score: 72,
    status: "Active",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }, {
    id: 3,
    name: "Maria Rodriguez",
    platforms: ["Instagram", "TikTok"],
    category: "Fitness",
    followers: 620000,
    engagement: 4.5,
    score: 86,
    status: "Active",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }, {
    id: 4,
    name: "David Kim",
    platforms: ["Instagram"],
    category: "Fashion",
    followers: 280000,
    engagement: 2.2,
    score: 65,
    status: "Inactive",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }, {
    id: 5,
    name: "Emma Wilson",
    platforms: ["Instagram", "TikTok"],
    category: "Food",
    followers: 420000,
    engagement: 3.8,
    score: 81,
    status: "Active",
    avatar: "/lovable-uploads/3159d9d9-d6f0-49d7-8c4a-fdf295581e99.png"
  }];

  // Handle KOL selection
  const handleKolSelect = (kol) => {
    setSelectedKol(kol);
    setCurrentView("detail");
  };

  // Filter KOLs based on search query
  const filteredKols = kolData.filter(kol => 
    kol.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    kol.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format number with commas
  const formatNumber = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get badge color based on score
  const getScoreBadgeColor = score => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  // Get status badge color
  const getStatusBadgeColor = status => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  // Get active KOLs count
  const activeKolsCount = kolData.filter(kol => kol.status === "Active").length;

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
                handleKolSelect={handleKolSelect}
                formatNumber={formatNumber}
                getScoreBadgeColor={getScoreBadgeColor}
                getStatusBadgeColor={getStatusBadgeColor}
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
            totalKols={kolData.length}
          />
          
          <div className="mb-6"></div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default KolManagement;
