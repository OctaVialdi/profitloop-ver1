import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

interface FilterMenuProps {
  onClose?: () => void; // Make the prop optional
}

type FilterCategory = 'main' | 'status' | 'employmentStatus' | 'branch' | 'organization' | 'jobPosition' | 'jobLevel' | 'sbu';

export const EmployeeFilterMenu: React.FC<FilterMenuProps> = ({ onClose = () => {} }) => {
  const [currentMenu, setCurrentMenu] = useState<FilterCategory>('main');
  const [searchQuery, setSearchQuery] = useState('');
  
  const renderMainMenu = () => (
    <div className="space-y-4 p-4">
      <h4 className="font-medium text-lg mb-2">Filter</h4>
      <div className="flex flex-col space-y-1">
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('status')}
        >
          Status
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('employmentStatus')}
        >
          Employment status
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('branch')}
        >
          Branch
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('organization')}
        >
          Organization
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('jobPosition')}
        >
          Job position
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('jobLevel')}
        >
          Job level
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('sbu')}
        >
          SBU
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
      </div>
    </div>
  );

  const renderSubMenu = (title: string, items: string[] = []) => (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMenu('main')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h4 className="font-medium text-sm ml-2">{title}</h4>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-auto">
        <div className="relative">
          <Input 
            placeholder="Search..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id={`${title.toLowerCase()}-all`} />
            <label htmlFor={`${title.toLowerCase()}-all`} className="text-sm font-medium">All</label>
          </div>
          
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${title.toLowerCase()}-${index}`} />
                <label htmlFor={`${title.toLowerCase()}-${index}`} className="text-sm font-medium">{item}</label>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">No data found</div>
          )}
        </div>
      </div>
      
      <div className="bg-primary p-4 mt-auto">
        <Button className="w-full text-sm" onClick={onClose}>Filter</Button>
      </div>
    </div>
  );

  // Switch between different menus based on current selection
  const renderContent = () => {
    switch (currentMenu) {
      case 'status':
        return renderSubMenu('Status', ['Active', 'Resign']);
      case 'employmentStatus':
        return renderSubMenu('Employment status', ['Permanent', 'Contract', 'Probation']);
      case 'branch':
        return renderSubMenu('Branch', ['Pusat']);
      case 'organization':
        return renderSubMenu('Organization', []);
      case 'jobPosition':
        return renderSubMenu('Job position', []);
      case 'jobLevel':
        return renderSubMenu('Job level', []);
      case 'sbu':
        return renderSubMenu('SBU', []);
      default:
        return renderMainMenu();
    }
  };

  return renderContent();
};
