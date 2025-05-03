
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { ContractType } from "./types";

interface ContractTemplate {
  id: string;
  title: string;
  description: string;
  type: ContractType;
  updatedDate: string;
  version: string;
}

interface KontrakTemplateSectionProps {
  templates: ContractTemplate[];
}

export const KontrakTemplateSection: React.FC<KontrakTemplateSectionProps> = ({ 
  templates 
}) => {
  const getTypeColor = (type: ContractType) => {
    const colors = {
      [ContractType.PERMANENT]: "purple",
      [ContractType.CONTRACT]: "info",
      [ContractType.PROBATION]: "warning",
      [ContractType.INTERNSHIP]: "success",
      [ContractType.TEMPORARY]: "purple",
    };
    
    return colors[type] || "default";
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Template Kontrak</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <Card key={template.id} className="p-4 border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`text-${getTypeColor(template.type)}-600`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <Badge variant={getTypeColor(template.type) as any}>{template.type}</Badge>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-1">{template.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{template.description}</p>
            
            <div className="text-xs text-gray-500 mb-3 flex flex-col space-y-1">
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                Updated: {template.updatedDate}
              </div>
              <div>Version {template.version}</div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 text-sm" 
              size="sm"
            >
              <FileDown className="h-4 w-4" />
              Download Template
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
