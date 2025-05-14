
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Kol } from "@/hooks/useKols";
import { Skeleton } from "@/components/ui/skeleton";

interface KolListProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredKols: Kol[];
  handleKolSelect: (kol: Kol) => void;
  formatNumber: (num: number) => string;
  getScoreBadgeColor: (score: number) => string;
  getStatusBadgeColor: (status: string) => string;
  loading: boolean;
}

export const KolList: React.FC<KolListProps> = ({
  searchQuery,
  setSearchQuery,
  filteredKols,
  handleKolSelect,
  formatNumber,
  getScoreBadgeColor,
  getStatusBadgeColor,
  loading
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
            {loading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredKols.length > 0 ? (
              filteredKols.map(kol => (
                <TableRow key={kol.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer" 
                      onClick={() => handleKolSelect(kol)}
                    >
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        {kol.avatar ? (
                          <img src={kol.avatar} alt={kol.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-200">
                            {kol.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-blue-600 hover:underline">{kol.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {kol.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                        {kol.category}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatNumber(kol.followers || 0)}</TableCell>
                  <TableCell>{kol.engagement || 0}%</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getScoreBadgeColor(kol.score || 0)}`}>
                      {kol.score || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeColor(kol.status || 'Inactive')}`}>
                      {kol.status || 'Inactive'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No KOLs found. {searchQuery ? "Try different search terms." : "Add your first KOL."}
                </TableCell>
              </TableRow>
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
