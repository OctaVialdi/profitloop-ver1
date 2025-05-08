
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Employee } from "@/hooks/useEmployees";
import { EmptyDataDisplay } from "./EmptyDataDisplay";
import { fetchEmployeeReprimands, Reprimand } from "@/services/reprimandService";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ReprimandHistorySectionProps {
  reprimands: Reprimand[];
  onViewReprimand: (reprimand: Reprimand) => void;
  onAppeal: (reprimandId: string) => void;
}

const ReprimandHistorySection: React.FC<ReprimandHistorySectionProps> = ({ 
  reprimands, 
  onViewReprimand,
  onAppeal
}) => {
  return reprimands.length === 0 ? (
    <div className="text-center p-4">
      <p className="text-muted-foreground">No reprimand history found.</p>
    </div>
  ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reprimands.map((reprimand) => (
          <TableRow key={reprimand.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <Badge 
                  variant={
                    reprimand.reprimand_type === 'Verbal' ? 'outline' :
                    reprimand.reprimand_type === 'Written' ? 'secondary' :
                    reprimand.reprimand_type === 'PIP' ? 'default' : 'destructive'
                  }
                >
                  {reprimand.reprimand_type}
                </Badge>
              </div>
            </TableCell>
            <TableCell>{format(new Date(reprimand.date), 'MMM d, yyyy')}</TableCell>
            <TableCell>
              <Badge 
                variant={
                  reprimand.status === 'Active' ? 'outline' : 
                  reprimand.status === 'Resolved' ? 'secondary' : 'default'
                }
                className={
                  reprimand.status === 'Active' ? 'bg-red-100 text-red-800 border-red-200' : 
                  reprimand.status === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' : 
                  'bg-blue-100 text-blue-800 border-blue-200'
                }
              >
                {reprimand.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewReprimand(reprimand)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                {reprimand.status === 'Active' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAppeal(reprimand.id)}
                  >
                    Appeal
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface HistorySectionProps {
  employee: Employee;
  activeTab: string;
  handleEdit: (section: string) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  employee,
  activeTab,
  handleEdit
}) => {
  const [reprimands, setReprimands] = useState<Reprimand[]>([]);
  const [selectedReprimand, setSelectedReprimand] = useState<Reprimand | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadReprimands = async () => {
      if (activeTab === 'reprimand' && employee.id) {
        setIsLoading(true);
        try {
          const data = await fetchEmployeeReprimands(employee.id);
          setReprimands(data);
        } catch (error) {
          console.error("Error loading reprimands:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadReprimands();
  }, [activeTab, employee.id]);

  const handleViewReprimand = (reprimand: Reprimand) => {
    setSelectedReprimand(reprimand);
    // Implementation for viewing reprimand details would go here
  };

  const handleAppealReprimand = async (reprimandId: string) => {
    // Implementation for appealing a reprimand would go here
    console.log("Appeal reprimand:", reprimandId);
  };

  const historyTitle = activeTab === 'adjustment' ? 'Adjustment' : 
                  activeTab === 'transfer' ? 'Transfer' : 
                  activeTab === 'npp' ? 'NPP' : 'Reprimand';
  
  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{historyTitle}</h2>
        </div>

        {activeTab === 'reprimand' ? (
          isLoading ? (
            <div className="text-center py-8">Loading reprimand history...</div>
          ) : (
            <ReprimandHistorySection 
              reprimands={reprimands} 
              onViewReprimand={handleViewReprimand}
              onAppeal={handleAppealReprimand}
            />
          )
        ) : (
          <EmptyDataDisplay 
            title="There is no data to display"
            description={`Your ${historyTitle.toLowerCase()} history data will be displayed here.`}
            section={activeTab}
            handleEdit={handleEdit}
          />
        )}
      </div>
    </Card>
  );
};
