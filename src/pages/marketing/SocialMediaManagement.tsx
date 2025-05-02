
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Calendar } from "lucide-react";

interface ContentManager {
  name: string;
  dailyTarget: number;
  monthlyTarget: number;
  monthlyTargetAdjusted: number;
  progress: number;
  onTimeRate: number;
  effectiveRate: number;
  score: number;
}

interface TabData {
  id: string;
  label: string;
}

const SocialMediaManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("content-planner");
  const [activeSubTab, setActiveSubTab] = useState<string>("dashboard");
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')} May 2025`;
  
  const primaryTabs: TabData[] = [
    { id: "content-planner", label: "Content Planner" },
    { id: "production", label: "Production" },
    { id: "content-post", label: "Content Post" }
  ];

  const secondaryTabs: TabData[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "create-content", label: "Create Content" },
    { id: "content-bank", label: "Content Bank" },
    { id: "content-qc", label: "Content QC" }
  ];

  const contentManagers: ContentManager[] = [
    {
      name: "John Doe",
      dailyTarget: 20,
      monthlyTarget: 20,
      monthlyTargetAdjusted: 20,
      progress: 75,
      onTimeRate: 80,
      effectiveRate: 90,
      score: 82
    },
    {
      name: "Jane Smith",
      dailyTarget: 20,
      monthlyTarget: 20,
      monthlyTargetAdjusted: 15,
      progress: 80,
      onTimeRate: 70,
      effectiveRate: 85,
      score: 78
    },
    {
      name: "Mike Johnson",
      dailyTarget: 15,
      monthlyTarget: 15,
      monthlyTargetAdjusted: 18,
      progress: 65,
      onTimeRate: 75,
      effectiveRate: 80,
      score: 76
    },
    {
      name: "Sara Williams",
      dailyTarget: 18,
      monthlyTarget: 18,
      monthlyTargetAdjusted: 20,
      progress: 85,
      onTimeRate: 85,
      effectiveRate: 88,
      score: 86
    }
  ];

  const getTabTitle = () => {
    switch (activeTab) {
      case "content-planner":
        return "Target Quantity Content Planner";
      case "production":
        return "Target Quantity Production Team";
      case "content-post":
        return "Target Quantity Post Content";
      default:
        return "Social Media Management";
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      {/* Primary Tab Navigation */}
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 w-full">
          {primaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 text-center transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? "bg-white text-gray-800 font-medium" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <Card className="w-full border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{getTabTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">PIC</TableHead>
                  <TableHead className="text-center w-[150px]">
                    <div className="flex items-center justify-center gap-1">
                      <span>{formattedDate}</span>
                      <Calendar className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center w-[150px]">
                    <div className="flex items-center justify-center gap-1">
                      <span>May 2025</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 9l-7 7-7-7" 
                        />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="text-center w-[150px]">
                    Target May 2025
                  </TableHead>
                  <TableHead className="w-[200px]">Progress</TableHead>
                  <TableHead className="text-center">On Time Rate</TableHead>
                  <TableHead className="text-center">Effective Rate</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentManagers.map((manager) => (
                  <TableRow key={manager.name}>
                    <TableCell className="font-medium">{manager.name}</TableCell>
                    <TableCell className="text-center">{manager.dailyTarget}</TableCell>
                    <TableCell className="text-center">{manager.monthlyTarget}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>{manager.monthlyTargetAdjusted}</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                            />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={manager.progress} className="h-2" />
                        <span className="text-sm">{manager.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{manager.onTimeRate}%</TableCell>
                    <TableCell className="text-center">{manager.effectiveRate}%</TableCell>
                    <TableCell className="text-center">{manager.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Secondary Tab Navigation */}
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 w-full">
          {secondaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`p-4 text-center transition-all duration-200 flex items-center justify-center gap-2 ${
                activeSubTab === tab.id 
                  ? "bg-white text-gray-800 font-medium" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {tab.id === "dashboard" ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                  />
                ) : tab.id === "create-content" ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M12 4v16m8-8H4" 
                  />
                ) : tab.id === "content-bank" ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                )}
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Content */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dashboard Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will display dashboard content for the selected tabs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaManagement;
