
import React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface EmployeePaginationProps {
  totalCount: number;
}

export const EmployeePagination: React.FC<EmployeePaginationProps> = ({ totalCount }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium">1</span> from <span className="font-medium">{totalCount}</span> row
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink>
              <ChevronsLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>
              <ChevronLeft className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>
              <ChevronRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>
              <ChevronsRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
