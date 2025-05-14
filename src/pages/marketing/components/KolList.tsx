
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Kol } from "@/hooks/useKols";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface KolListProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredKols: Kol[];
  handleKolSelect: (kol: Kol) => void;
  formatNumber: (num: number) => string;
  getScoreBadgeColor: (score: number) => string;
  getStatusBadgeColor: (status: string) => string;
  isLoading?: boolean;
}

export const KolList: React.FC<KolListProps> = ({
  searchQuery,
  setSearchQuery,
  filteredKols,
  handleKolSelect,
  formatNumber,
  getScoreBadgeColor,
  getStatusBadgeColor,
  isLoading = false
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
              <TableHead>STATUS</TableHead>
              <TableHead className="w-[80px] text-right pr-4">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mb-2"></div>
                    <p className="text-sm text-gray-500">Loading KOLs...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredKols.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-gray-500">No KOLs found</p>
                  {searchQuery && (
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredKols.map(kol => (
                <TableRow key={kol.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer" 
                      onClick={() => handleKolSelect(kol)}
                    >
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        {kol.photo_url ? (
                          <img src={kol.photo_url} alt={kol.full_name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-purple-100 text-purple-800 font-medium">
                            {kol.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-blue-600 hover:underline">{kol.full_name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                      {kol.category}
                    </span>
                  </TableCell>
                  <TableCell>{formatNumber(kol.total_followers)}</TableCell>
                  <TableCell>{kol.engagement_rate}%</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeColor(kol.is_active ? "Active" : "Inactive")}`}>
                      {kol.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleKolSelect(kol)}>
                          View/Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredKols.length > 0 && (
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
      )}
    </div>
  );
};
