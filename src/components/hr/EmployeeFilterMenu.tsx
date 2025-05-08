
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FilterMenuProps {
  onClose?: () => void;
  activeFilters: Record<string, string[]>;
  setActiveFilters: (filters: Record<string, string[]>) => void;
}

type FilterCategory = 'main' | 'status' | 'employmentStatus' | 'branch' | 'organization' | 'jobPosition' | 'jobLevel' | 'sbu';

export const EmployeeFilterMenu: React.FC<FilterMenuProps> = ({ 
  onClose, 
  activeFilters, 
  setActiveFilters 
}) => {
  const [currentMenu, setCurrentMenu] = useState<FilterCategory>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>({
    status: ['Active', 'Resigned'],
    employmentStatus: ['Permanent', 'Contract', 'Probation'],
    branch: ['Pusat'],
    organization: [],
    jobPosition: [],
    jobLevel: ['Junior', 'Middle', 'Senior', 'Lead'],
    sbu: []
  });

  // Fetch organization names from Supabase when component mounts
  useEffect(() => {
    const fetchOrganizationNames = async () => {
      try {
        const { data } = await supabase.rpc('get_unique_organization_names');
        if (data && data.length > 0) {
          setFilterOptions(prev => ({
            ...prev,
            organization: data.map(item => item.organization_name)
          }));
        }
      } catch (error) {
        console.error("Error fetching organization names:", error);
      }
    };

    fetchOrganizationNames();
  }, []);
  
  const handleClose = () => {
    if (onClose) onClose();
  };

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
          {activeFilters.status && activeFilters.status.length > 0 && !activeFilters.status.includes('All') && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">
              {activeFilters.status.length}
            </span>
          )}
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('employmentStatus')}
        >
          Employment status
          {activeFilters.employmentStatus && activeFilters.employmentStatus.length > 0 && !activeFilters.employmentStatus.includes('All') && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">
              {activeFilters.employmentStatus.length}
            </span>
          )}
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('branch')}
        >
          Branch
          {activeFilters.branch && activeFilters.branch.length > 0 && !activeFilters.branch.includes('All') && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">
              {activeFilters.branch.length}
            </span>
          )}
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('organization')}
        >
          Organization
          {activeFilters.organization && activeFilters.organization.length > 0 && !activeFilters.organization.includes('All') && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">
              {activeFilters.organization.length}
            </span>
          )}
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('jobPosition')}
        >
          Job position
          {activeFilters.jobPosition && activeFilters.jobPosition.length > 0 && !activeFilters.jobPosition.includes('All') && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">
              {activeFilters.jobPosition.length}
            </span>
          )}
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('jobLevel')}
        >
          Job level
          {activeFilters.jobLevel && activeFilters.jobLevel.length > 0 && !activeFilters.jobLevel.includes('All') && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">
              {activeFilters.jobLevel.length}
            </span>
          )}
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="ghost" 
          className="flex justify-between items-center w-full text-sm" 
          onClick={() => setCurrentMenu('sbu')}
        >
          SBU
          {activeFilters.sbu && activeFilters.sbu.length > 0 && !activeFilters.sbu.includes('All') && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">
              {activeFilters.sbu.length}
            </span>
          )}
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </Button>
      </div>
    </div>
  );

  const handleFilterSelection = (category: string, value: string, isChecked: boolean) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      
      // Handle the "All" option specially
      if (value === 'All') {
        if (isChecked) {
          return {
            ...prev,
            [category]: ['All']
          };
        } else {
          return {
            ...prev,
            [category]: []
          };
        }
      } else {
        // If "All" was previously selected, remove it
        let newValues = current.filter(v => v !== 'All');
        
        // Add or remove the value based on isChecked
        if (isChecked) {
          newValues = [...newValues, value];
        } else {
          newValues = newValues.filter(v => v !== value);
        }
        
        return {
          ...prev,
          [category]: newValues
        };
      }
    });
  };

  const handleApplyFilter = () => {
    handleClose();
  };

  const renderSubMenu = (title: string, key: FilterCategory) => {
    const options = filterOptions[key] || [];
    const currentFilters = activeFilters[key] || [];
    const allSelected = currentFilters.includes('All');
    
    // Filter options based on search query
    const filteredOptions = searchQuery.trim() 
      ? options.filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
      : options;
    
    return (
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
              <Checkbox 
                id={`${key}-all`} 
                checked={allSelected}
                onCheckedChange={(checked) => {
                  handleFilterSelection(key, 'All', checked === true);
                }}
              />
              <label htmlFor={`${key}-all`} className="text-sm font-medium">All</label>
            </div>
            
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${key}-${index}`} 
                    checked={currentFilters.includes(item)} 
                    onCheckedChange={(checked) => {
                      handleFilterSelection(key, item, checked === true);
                    }}
                    disabled={allSelected}
                  />
                  <label htmlFor={`${key}-${index}`} className="text-sm font-medium">{item}</label>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">No data found</div>
            )}
          </div>
        </div>
        
        <div className="bg-primary p-4 mt-auto">
          <Button className="w-full text-sm" onClick={handleApplyFilter}>Apply Filter</Button>
        </div>
      </div>
    );
  };

  // Switch between different menus based on current selection
  const renderContent = () => {
    switch (currentMenu) {
      case 'status':
        return renderSubMenu('Status', 'status');
      case 'employmentStatus':
        return renderSubMenu('Employment status', 'employmentStatus');
      case 'branch':
        return renderSubMenu('Branch', 'branch');
      case 'organization':
        return renderSubMenu('Organization', 'organization');
      case 'jobPosition':
        return renderSubMenu('Job position', 'jobPosition');
      case 'jobLevel':
        return renderSubMenu('Job level', 'jobLevel');
      case 'sbu':
        return renderSubMenu('SBU', 'sbu');
      default:
        return renderMainMenu();
    }
  };

  return renderContent();
};
