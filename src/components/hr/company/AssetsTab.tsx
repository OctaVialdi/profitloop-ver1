
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  Edit, 
  Trash2, 
  RotateCw,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { AddAssetDialog } from '../employee-detail/assets/AddAssetDialog';
import { EditAssetDialog } from '../employee-detail/assets/EditAssetDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useQuery } from '@tanstack/react-query';
import { EmployeeAsset, assetService, assetTypes } from '@/services/assetService';
import { format } from 'date-fns';
import AssetEditDialog from './AssetEditDialog';

const AssetsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditDialogWithTabsOpen, setIsEditDialogWithTabsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<EmployeeAsset | null>(null);
  const [selectedMockAsset, setSelectedMockAsset] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    assetType: 'employee'
  });

  // Fetch all assets from the organization
  const { 
    data: assets = [], 
    isLoading, 
    error,
    refetch: refetchAssets 
  } = useQuery({
    queryKey: ['organizationAssets'],
    queryFn: () => assetService.getAllOrganizationAssets()
  });
  
  // Handle errors
  React.useEffect(() => {
    if (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to load organization assets");
    }
  }, [error]);
  
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

  const handleEditAsset = (asset: EmployeeAsset) => {
    setSelectedAsset(asset);
    
    // Use the existing compact edit dialog
    setIsEditDialogOpen(true);
  };
  
  const handleEditAssetWithTabs = (asset: EmployeeAsset) => {
    // Convert to the format expected by the tabbed edit dialog
    const mockAsset = {
      id: asset.id,
      category: asset.asset_type,
      serialNumber: asset.serial_number || '',
      qrCode: asset.asset_tag || `QR-${asset.asset_type}-${asset.id.substring(0, 8)}`,
      employee: asset.employeeName || 'Unassigned',
      description: asset.name,
      specifications: asset.specifications || '',
      lendDate: asset.assigned_date || '',
      expectedReturn: asset.expected_return_date || '',
      status: asset.status,
      condition: asset.condition || 'Good'
    };
    
    setSelectedMockAsset(mockAsset);
    
    // Use the existing tabbed edit dialog
    setIsEditDialogWithTabsOpen(true);
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

  const confirmDeleteAsset = (assetId: string) => {
    setAssetToDelete(assetId);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveAsset = () => {
    // After saving the asset, refetch the data
    refetchAssets();
    setIsEditDialogOpen(false);
  };
  
  const handleSaveAssetWithTabs = () => {
    // In a real implementation, we would sync changes from the tabbed dialog
    // back to the database. For now, we'll just refresh the data.
    refetchAssets();
    setIsEditDialogWithTabsOpen(false);
  };

  const handleAddAsset = () => {
    // We'll handle this in the dialog
    setIsAddDialogOpen(true);
  };

  const handleAssetsUpdated = () => {
    refetchAssets();
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    assets.forEach(asset => {
      if (asset.asset_type) {
        categories.add(asset.asset_type);
      }
    });
    return Array.from(categories);
  };

  const filteredAssets = assets.filter(asset => {
    // Search by name, serial number, or employee name
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (asset.serial_number && asset.serial_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.asset_tag && asset.asset_tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.employeeName && asset.employeeName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = filters.category === 'all' || asset.asset_type === filters.category;
    
    // Filter by status
    const matchesStatus = filters.status === 'all' || asset.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Company Assets</h2>
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
        <div className="border rounded-lg p-12 flex justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading assets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Company Assets</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handleAddAsset} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Add Asset
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
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
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Category</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Serial Number</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Employee</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Description</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Lend Date</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Expected Return</th>
              <th className="py-3 px-4 text-left font-medium text-gray-500 text-sm">Status</th>
              <th className="py-3 px-4 text-right font-medium text-gray-500 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <span className="font-medium">{asset.asset_type}</span>
                    {asset.asset_tag && (
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-xs">
                        {asset.asset_tag}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">{asset.serial_number || '-'}</td>
                <td className="py-3 px-4">{asset.employeeName || 'Unassigned'}</td>
                <td className="py-3 px-4">
                  <div>{asset.name}</div>
                  <div className="text-xs text-gray-500">{asset.specifications || ''}</div>
                </td>
                <td className="py-3 px-4">
                  {asset.assigned_date 
                    ? format(new Date(asset.assigned_date), 'MMM d, yyyy') 
                    : 'Not set'}
                </td>
                <td className="py-3 px-4">
                  {asset.expected_return_date 
                    ? format(new Date(asset.expected_return_date), 'MMM d, yyyy') 
                    : 'Not set'}
                </td>
                <td className="py-3 px-4">
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
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9"
                      title="Edit Asset (Simple)" 
                      onClick={() => handleEditAsset(asset)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9 text-red-600"
                      title="Delete Asset" 
                      onClick={() => confirmDeleteAsset(asset.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAssets.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No assets found matching your criteria
          </div>
        )}
      </div>
      
      {/* Simple Edit Dialog (from employee assets) */}
      {isEditDialogOpen && selectedAsset && (
        <EditAssetDialog
          asset={selectedAsset}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSaved={handleSaveAsset}
        />
      )}
      
      {/* Complex Edit Dialog with tabs (existing one) */}
      {isEditDialogWithTabsOpen && selectedMockAsset && (
        <AssetEditDialog
          asset={selectedMockAsset}
          isOpen={isEditDialogWithTabsOpen}
          onClose={() => setIsEditDialogWithTabsOpen(false)}
          onSave={handleSaveAssetWithTabs}
          onCancel={() => setIsEditDialogWithTabsOpen(false)}
        />
      )}
      
      {/* Add Asset Dialog */}
      {isAddDialogOpen && (
        <AddAssetDialog
          employeeId={null} // null means company asset not assigned to anyone
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSaved={handleAssetsUpdated}
        />
      )}
      
      {/* Delete Confirmation */}
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
  );
};

export default AssetsTab;
