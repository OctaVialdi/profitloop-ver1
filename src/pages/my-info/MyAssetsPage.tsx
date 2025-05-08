
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EmployeeWithDetails, employeeService } from "@/services/employeeService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { Card } from "@/components/ui/card";
import { AssetsList } from "@/components/hr/employee-detail/assets/AssetsList";
import { useQuery } from "@tanstack/react-query";
import { assetService } from "@/services/assetService";
import { AddAssetDialog } from "@/components/hr/employee-detail/assets/AddAssetDialog";

export default function MyAssetsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Extract the employee ID from the query parameters
  const employeeId = searchParams.get("id");
  
  const [employee, setEmployee] = useState<EmployeeWithDetails | null>(null);
  const [loadingEmployee, setLoadingEmployee] = useState<boolean>(true);
  
  const fetchEmployee = async () => {
    if (!employeeId) return;
    
    setLoadingEmployee(true);
    try {
      const data = await employeeService.fetchEmployeeById(employeeId);
      setEmployee(data);
      if (!data) {
        toast.error("Employee not found");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      toast.error("Failed to load employee data");
    } finally {
      setLoadingEmployee(false);
    }
  };
  
  // Fetch assets data
  const { 
    data: assets = [], 
    isLoading: loadingAssets,
    error,
    refetch: refetchAssets
  } = useQuery({
    queryKey: ['employeeAssets', employeeId],
    queryFn: () => assetService.getEmployeeAssets(employeeId || ''),
    enabled: !!employeeId
  });
  
  useEffect(() => {
    if (error) {
      console.error("Error fetching employee assets:", error);
      toast.error("Failed to load assets");
    }
  }, [error]);
  
  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  const handleAssetsUpdated = () => {
    refetchAssets();
  };
  
  const handleAddAssetClick = () => {
    setIsAddDialogOpen(true);
  };

  if (!employeeId) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No employee ID provided</h2>
          <Button onClick={() => navigate("/hr/data")}>Back to Employee List</Button>
        </div>
      </div>
    );
  }
  
  const isLoading = loadingEmployee || loadingAssets;
  
  if (isLoading && !employee) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Employee not found</h2>
          <Button onClick={() => navigate("/hr/data")}>Back to Employee List</Button>
        </div>
      </div>
    );
  }

  return (
    <QueryProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 mr-4" 
              onClick={() => navigate("/hr/data")}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold">Assets - {employee.name}</h1>
          </div>
          <Button onClick={handleAddAssetClick} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Asset
          </Button>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AssetsList
              assets={assets}
              employeeId={employeeId}
              onAssetsUpdated={handleAssetsUpdated}
            />
          )}
        </Card>
        
        {isAddDialogOpen && (
          <AddAssetDialog
            employeeId={employeeId}
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onSaved={handleAssetsUpdated}
          />
        )}
      </div>
    </QueryProvider>
  );
}
