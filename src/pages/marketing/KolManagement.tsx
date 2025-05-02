
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import KolOverviewCards from "./components/KolOverviewCards";
import KolAnalyticsCharts from "./components/KolAnalyticsCharts";
import KolAddDialog from "./components/KolAddDialog";
import KolEditDialog from "./components/KolEditDialog";

// Mock data for KOL influencers
const influencers = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    category: "Beauty",
    platforms: ["Instagram", "TikTok"],
    followers: 500000,
    engagement: "3.2%",
    score: 78,
    status: "Active"
  },
  {
    id: 2,
    name: "Alex Chen",
    avatar: "https://i.pravatar.cc/150?img=2",
    category: "Tech",
    platforms: ["Instagram", "TikTok"],
    followers: 350000,
    engagement: "2.8%",
    score: 72,
    status: "Active"
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=3",
    category: "Fitness",
    platforms: ["Instagram", "TikTok"],
    followers: 620000,
    engagement: "4.5%",
    score: 86,
    status: "Active"
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "https://i.pravatar.cc/150?img=4",
    category: "Fashion",
    platforms: ["Instagram"],
    followers: 280000,
    engagement: "2.2%",
    score: 65,
    status: "Inactive"
  },
  {
    id: 5,
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=5",
    category: "Food",
    platforms: ["Instagram", "TikTok"],
    followers: 420000,
    engagement: "3.8%",
    score: 81,
    status: "Active"
  }
];

// Time periods for filtering
const timePeriods = ["Last Week", "Last Month", "Last Quarter", "Last Year"];

const KolManagement = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("Last Month");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddKolDialog, setShowAddKolDialog] = useState(false);
  const [editingKol, setEditingKol] = useState<any>(null);

  // Filter influencers based on search query
  const filteredInfluencers = influencers.filter(influencer => 
    influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    influencer.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditKol = (kol: any) => {
    setEditingKol(kol);
  };

  const handleCloseEditDialog = () => {
    setEditingKol(null);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">KOL Management</h1>
        
        <div className="flex space-x-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3M21 7L15.5657 12.4343C15.3677 12.6323 15.2687 12.7313 15.1545 12.7684C15.0541 12.8011 14.9459 12.8011 14.8455 12.7684C14.7313 12.7313 14.6323 12.6323 14.4343 12.4343L12.5657 10.5657C12.3677 10.3677 12.2687 10.2687 12.1545 10.2316C12.0541 10.1989 11.9459 10.1989 11.8455 10.2316C11.7313 10.2687 11.6323 10.3677 11.4343 10.5657L7 15M21 7H17M21 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="kolList" className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12H19M12 12C12 13.6569 10.6569 15 9 15C7.34315 15 6 13.6569 6 12C6 10.3431 7.34315 9 9 9C10.6569 9 12 10.3431 12 12ZM21 18H12M12 18C12 19.6569 10.6569 21 9 21C7.34315 21 6 19.6569 6 18C6 16.3431 7.34315 15 9 15C10.6569 15 12 16.3431 12 18ZM21 6H12M12 6C12 7.65685 10.6569 9 9 9C7.34315 9 6 7.65685 6 6C6 4.34315 7.34315 3 9 3C10.6569 3 12 4.34315 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                KOL List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button className="bg-[#0D1117] hover:bg-black" onClick={() => setShowAddKolDialog(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add KOL
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Popover open={timeDropdownOpen} onOpenChange={setTimeDropdownOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              {selectedTimePeriod}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-0" align="end">
            <div className="rounded-md border border-input bg-background">
              {timePeriods.map((period) => (
                <div
                  key={period}
                  className={`px-4 py-2 cursor-pointer hover:bg-muted ${
                    selectedTimePeriod === period ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    setSelectedTimePeriod(period);
                    setTimeDropdownOpen(false);
                  }}
                >
                  {selectedTimePeriod === period && (
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline mr-2"
                    >
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {period}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <KolOverviewCards />

      <TabsContent value="analytics" className="mt-0 p-0">
        <KolAnalyticsCharts />
      </TabsContent>

      <TabsContent value="kolList" className="mt-0 p-0">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Input 
                placeholder="Search KOLs by name or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              <Button variant="outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M3 5H21M3 12H21M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Filters
              </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>NAME</TableHead>
                    <TableHead>CATEGORY</TableHead>
                    <TableHead>FOLLOWERS</TableHead>
                    <TableHead>ENGAGEMENT</TableHead>
                    <TableHead>SCORE</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInfluencers.map((influencer) => (
                    <TableRow 
                      key={influencer.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleEditKol(influencer)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src={influencer.avatar} 
                              alt={influencer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div>{influencer.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {influencer.platforms.join(", ")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-xs">
                          {influencer.category}
                        </span>
                      </TableCell>
                      <TableCell>{influencer.followers.toLocaleString()}</TableCell>
                      <TableCell>{influencer.engagement}</TableCell>
                      <TableCell>
                        <span 
                          className={`px-3 py-1 rounded-full ${
                            influencer.score >= 80 ? "bg-green-100 text-green-800" : 
                            influencer.score >= 70 ? "bg-yellow-100 text-yellow-800" : 
                            "bg-red-100 text-red-800"
                          }`}
                        >
                          {influencer.score}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            influencer.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {influencer.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationPrevious href="#" />
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationNext href="#" />
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </TabsContent>

      {showAddKolDialog && (
        <KolAddDialog onClose={() => setShowAddKolDialog(false)} />
      )}

      {editingKol && (
        <KolEditDialog kol={editingKol} onClose={handleCloseEditDialog} />
      )}
    </div>
  );
};

export default KolManagement;
