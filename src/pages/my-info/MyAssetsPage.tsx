
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EmployeeWithDetails, employeeService } from "@/services/employeeService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Search, Filter, Download, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { QueryProvider } from "@/components/QueryProvider";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { assetService, EmployeeAsset } from "@/services/assetService";
import { AddAssetDialog } from "@/components/hr/employee-detail/assets/AddAssetDialog";
import { EditAssetDialog } from "@/components/hr/employee-detail/assets/EditAssetDialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function MyAssetsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
  });

  // Define asset types and statuses locally
  const assetTypes = [
    'Laptop', 
    'Desktop', 
    'Monitor', 
    'Phone', 
    'Tablet', 
    'Keyboard', 
    'Mouse', 
    'Headset',
    'Docking Station',
    'Printer',
    'Camera',
    'Other'
  ];
  
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
  
  const handleEditAsset = (asset) => {
    setSelectedAsset(asset);
    setIsEditDialogOpen(true);
  };
  
  const confirmDeleteAsset = (assetId: string) => {
    setAssetToDelete(assetId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteAsset = async (assetId: string) => {
    try {
      const success = await assetService.deleteAsset(assetId);
      if (success) {
        refetchAssets();
        toast.success("Asset deleted successfully");
      } else {
        toast.error("Failed to delete asset");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("An error occurred while deleting the asset");
    } finally {
      setIsDeleteDialogOpen(false);
      setAssetToDelete(null);
    }
  };
  
  const handleSaveAsset = () => {
    // After saving the asset, refetch the data
    refetchAssets();
    setIsEditDialogOpen(false);
  };
  
  const statusColors: Record<string, string> = {
    'In Use': 'bg-blue-100 text-blue-700',
    'Available': 'bg-green-100 text-green-700',
    'Maintenance': 'bg-yellow-100 text-yellow-700',
    'Retired': 'bg-gray-100 text-gray-700',
    'Lost': 'bg-red-100 text-red-700',
  };

  const conditionColors: Record<string, string> = {
    'Excellent': 'bg-green-100 text-green-700',
    'Good': 'bg-blue-100 text-blue-700',
    'Fair': 'bg-yellow-100 text-yellow-700',
    'Poor': 'bg-red-100 text-red-700',
  };
  
  const filteredAssets = assets.filter(asset => {
    // Search by name, serial number, or employee name
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (asset.serial_number && asset.serial_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.asset_tag && asset.asset_tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = filters.category === 'all' || asset.asset_type === filters.category;
    
    // Filter by status
    const matchesStatus = filters.status === 'all' || asset.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
            <>
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="w-full md:w-1/2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      className="pl-10"
                      placeholder="Search assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select 
                    value={filters.category} 
                    onValueChange={(value) => setFilters({...filters, category: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {assetTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters({...filters, status: value})}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="In Use">In Use</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b">
                      <TableHead className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Category</TableHead>
                      <TableHead className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Serial Number</TableHead>
                      <TableHead className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Description</TableHead>
                      <TableHead className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Lend Date</TableHead>
                      <TableHead className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Expected Return</TableHead>
                      <TableHead className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Status</TableHead>
                      <TableHead className="py-3 px-4 text-right font-medium text-gray-500 text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id} className="border-b hover:bg-gray-50">
                        <TableCell className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="font-medium">{asset.asset_type}</span>
                            {asset.asset_tag && (
                              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-xs">
                                {asset.asset_tag}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">{asset.serial_number || '-'}</TableCell>
                        <TableCell className="py-3 px-4">
                          <div>{asset.name}</div>
                          <div className="text-xs text-gray-500">{asset.specifications || ''}</div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {asset.assigned_date 
                            ? format(new Date(asset.assigned_date), 'MMM d, yyyy') 
                            : 'Not set'}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {asset.expected_return_date 
                            ? format(new Date(asset.expected_return_date), 'MMM d, yyyy') 
                            : 'Not set'}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div className="flex flex-col space-y-1">
                            <Badge variant="outline" className={`${statusColors[asset.status]} font-normal`}>
                              {asset.status}
                            </Badge>
                            {asset.condition && (
                              <Badge variant="outline" className={`${conditionColors[asset.condition]} font-normal`}>
                                {asset.condition}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-9 w-9"
                              title="Edit Asset" 
                              onClick={() => handleEditAsset(asset)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-9 w-9 text-red-600"
                              title="Delete Asset" 
                              onClick={() => confirmDeleteAsset(asset.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredAssets.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No assets found matching your criteria
                  </div>
                )}
              </div>
            </>
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
        
        {isEditDialogOpen && selectedAsset && (
          <EditAssetDialog
            asset={selectedAsset}
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSaved={handleSaveAsset}
          />
        )}
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this asset. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => assetToDelete && handleDeleteAsset(assetToDelete)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </QueryProvider>
  );
}
