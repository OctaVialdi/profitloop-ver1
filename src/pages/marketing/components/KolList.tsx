
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface KolListProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredKols: any[];
  handleKolSelect: (kol: any) => void;
  formatNumber: (num: number) => string;
  getScoreBadgeColor: (score: number) => string;
  getStatusBadgeColor: (status: string) => string;
}

export const KolList: React.FC<KolListProps> = ({
  searchQuery,
  setSearchQuery,
  filteredKols,
  handleKolSelect,
  formatNumber,
  getScoreBadgeColor,
  getStatusBadgeColor
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search KOLs by name or category..." 
            className="pl-10" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[250px]">NAME</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>FOLLOWERS</TableHead>
              <TableHead>ENGAGEMENT</TableHead>
              <TableHead>SCORE</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKols.map(kol => (
              <TableRow key={kol.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer" 
                    onClick={() => handleKolSelect(kol)}
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      <img src={kol.avatar} alt={kol.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="text-blue-600 hover:underline">{kol.name}</div>
                      <div className="text-xs text-gray-500">
                        {kol.platforms.join(", ")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                    {kol.category}
                  </span>
                </TableCell>
                <TableCell>{formatNumber(kol.followers)}</TableCell>
                <TableCell>{kol.engagement}%</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getScoreBadgeColor(kol.score)}`}>
                    {kol.score}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeColor(kol.status)}`}>
                    {kol.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
