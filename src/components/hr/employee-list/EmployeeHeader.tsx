
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileSpreadsheet,
  FileText,
  FileJson,
  Upload,
  Settings
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const EmployeeHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-2">
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Import
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Import employees from CSV or Excel</p>
            </TooltipContent>
          </Tooltip>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>Excel (.xlsx)</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>CSV (.csv)</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>PDF (.pdf)</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileJson className="mr-2 h-4 w-4" />
                <span>JSON (.json)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8">
          <Settings className="h-3.5 w-3.5 mr-1.5" />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
};
