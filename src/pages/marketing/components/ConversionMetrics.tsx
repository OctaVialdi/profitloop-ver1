
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  LineChart,
} from "recharts";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConversionMetricsProps {
  timeFilter: string;
}

export const ConversionMetrics = ({ timeFilter }: ConversionMetricsProps) => {
  // Conversion data
  const conversionByKolData = [
    { name: "Sarah Johnson", value: 310 },
    { name: "Alex Chen", value: 265 },
    { name: "Maria Rodriguez", value: 450 },
    { name: "Emma Wilson", value: 360 },
  ];

  const conversionTrendsData = [
    { name: "Jan", value: 9 },
    { name: "Feb", value: 8.5 },
    { name: "Mar", value: 7 },
    { name: "Apr", value: 3 },
    { name: "May", value: 6.5 },
    { name: "Jun", value: 7.5 },
    { name: "Jul", value: 2.5 },
    { name: "Aug", value: 9.5 },
    { name: "Sep", value: 4.5 },
  ];

  const topPerformersData = [
    { id: 1, name: "Sarah Johnson", score: 78 },
    { id: 2, name: "Alex Chen", score: 72 },
    { id: 3, name: "Maria Rodriguez", score: 86 },
    { id: 4, name: "David Kim", score: 65 },
    { id: 5, name: "Emma Wilson", score: 81 },
  ];

  // KOL data for the table
  const kolData = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      category: "Beauty", 
      followers: 500000, 
      engagement: "3.2%", 
      score: 78, 
      status: "Active",
      platforms: ["Instagram", "TikTok"] 
    },
    { 
      id: 2, 
      name: "Alex Chen", 
      category: "Tech", 
      followers: 350000, 
      engagement: "2.8%", 
      score: 72, 
      status: "Active",
      platforms: ["Instagram", "TikTok"] 
    },
    { 
      id: 3, 
      name: "Maria Rodriguez", 
      category: "Fitness", 
      followers: 620000, 
      engagement: "4.5%", 
      score: 86, 
      status: "Active",
      platforms: ["Instagram", "TikTok"] 
    },
    { 
      id: 4, 
      name: "David Kim", 
      category: "Fashion", 
      followers: 280000, 
      engagement: "2.2%", 
      score: 65, 
      status: "Inactive",
      platforms: ["Instagram"] 
    },
    { 
      id: 5, 
      name: "Emma Wilson", 
      category: "Food", 
      followers: 420000, 
      engagement: "3.8%", 
      score: 81, 
      status: "Active",
      platforms: ["Instagram", "TikTok"] 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Conversion Rate by KOL</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionByKolData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis domain={[0, 600]} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Conversion Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 12]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Top Performers</h3>
            <div className="space-y-3">
              {topPerformersData.map((performer) => (
                <div key={performer.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      {performer.id}
                    </div>
                    <span className="font-medium">{performer.name}</span>
                  </div>
                  <span className="font-semibold">{performer.score} <span className="text-gray-500 text-sm font-normal">score</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* New section with header */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Additional Conversion Insights</h2>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <Input 
                placeholder="Search KOLs by name or category..." 
                className="pl-10 pr-4 py-2 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} />
              <span>Filters</span>
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead>FOLLOWERS</TableHead>
                  <TableHead>ENGAGEMENT</TableHead>
                  <TableHead>SCORE</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kolData.map((kol) => (
                  <TableRow key={kol.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img 
                            src={`https://i.pravatar.cc/32?img=${kol.id}`} 
                            alt={kol.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{kol.name}</div>
                          <div className="text-xs text-gray-500">{kol.platforms.join(", ")}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 font-normal">
                        {kol.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{kol.followers.toLocaleString()}</TableCell>
                    <TableCell>{kol.engagement}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`
                          px-2 py-1 rounded-md text-xs font-medium
                          ${kol.score >= 80 ? 'bg-green-50 text-green-700' : 
                          kol.score >= 70 ? 'bg-yellow-50 text-yellow-700' : 
                          'bg-red-50 text-red-700'}
                        `}
                      >
                        {kol.score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${kol.status === "Active" ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {kol.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};
