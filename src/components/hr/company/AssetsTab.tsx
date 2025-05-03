
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
  RotateCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AssetEditDialog from './AssetEditDialog';
import AddAssetDialog from './AddAssetDialog';

interface Asset {
  id: string;
  category: string;
  serialNumber: string;
  qrCode: string;
  employee: string;
  description: string;
  specifications: string;
  lendDate: string;
  expectedReturn: string;
  status: string;
  condition: string;
}

interface FilterState {
  category: string;
  status: string;
  assetType: 'employee' | 'company';
}

const AssetsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    status: 'all',
    assetType: 'employee'
  });
  
  // Mock data
  const [assets] = useState<Asset[]>([
    {
      id: '1',
      category: 'Laptop',
      serialNumber: 'LP-2023-001',
      qrCode: 'QR-LP-2023-001',
      employee: 'John Doe',
      description: 'MacBook Pro 16"',
      specifications: 'M1 Max, 32GB RAM, 1TB SSD',
      lendDate: '06/15/2023',
      expectedReturn: '06/15/2024',
      status: 'Borrowed',
      condition: 'Excellent'
    },
    {
      id: '2',
      category: 'Monitor',
      serialNumber: 'MN-2023-001',
      qrCode: 'QR-MN-2023-001',
      employee: 'Jane Smith',
      description: 'Dell UltraSharp 27"',
      specifications: '4K, USB-C, IPS Panel',
      lendDate: '07/20/2023',
      expectedReturn: '07/20/2024',
      status: 'Borrowed',
      condition: 'Good'
    },
    {
      id: '3',
      category: 'Tablet',
      serialNumber: 'TB-2023-001',
      qrCode: 'QR-TB-2023-001',
      employee: 'Unassigned',
      description: 'iPad Pro 12.9"',
      specifications: 'M2, 512GB, WiFi+Cellular',
      lendDate: '',
      expectedReturn: '',
      status: 'Available',
      condition: 'Excellent'
    },
    {
      id: '4',
      category: 'Phone',
      serialNumber: 'PH-2023-001',
      qrCode: 'QR-PH-2023-001',
      employee: 'James Johnson',
      description: 'iPhone 14 Pro',
      specifications: '256GB, Deep Purple',
      lendDate: '05/10/2023',
      expectedReturn: '11/10/2023',
      status: 'Overdue',
      condition: 'Good'
    },
    {
      id: '5',
      category: 'Laptop',
      serialNumber: 'LP-2023-002',
      qrCode: 'QR-LP-2023-002',
      employee: 'Emily Davis',
      description: 'Dell XPS 15',
      specifications: 'i7, 16GB RAM, 512GB SSD',
      lendDate: '08/05/2023',
      expectedReturn: '08/05/2024',
      status: 'Borrowed',
      condition: 'Excellent'
    },
  ]);

  const statusColors: Record<string, string> = {
    'Borrowed': 'bg-blue-100 text-blue-700',
    'Available': 'bg-green-100 text-green-700',
    'Overdue': 'bg-red-100 text-red-700',
    'Maintenance': 'bg-yellow-100 text-yellow-700',
    'Retired': 'bg-gray-100 text-gray-700',
  };

  const conditionColors: Record<string, string> = {
    'Excellent': 'bg-green-100 text-green-700',
    'Good': 'bg-blue-100 text-blue-700',
    'Fair': 'bg-yellow-100 text-yellow-700',
    'Poor': 'bg-red-100 text-red-700',
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAsset = (assetId: string) => {
    // In a real app, you'd delete from your database
    toast({
      title: "Asset Deleted",
      description: `Asset ${assetId} has been deleted`,
    });
  };

  const handleSaveAsset = (updatedAsset: Asset) => {
    // In a real app, you'd update your database
    toast({
      title: "Asset Updated",
      description: "Asset details have been updated successfully",
    });
    setIsEditDialogOpen(false);
  };

  const handleAddAsset = (newAsset: Partial<Asset>) => {
    // In a real app, you'd add to your database
    toast({
      title: "Asset Added",
      description: "New asset has been added successfully",
    });
    setIsAddDialogOpen(false);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        asset.employee.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || asset.category === filters.category;
    const matchesStatus = filters.status === 'all' || asset.status === filters.status;
    
    // Additional filter for employee/company assets could be implemented here
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {filters.assetType === 'employee' ? 'Employee Assets' : 'Company Assets'}
        </h2>
        <div className="flex items-center gap-2">
          <Select 
            value={filters.assetType} 
            onValueChange={(value: 'employee' | 'company') => setFilters({...filters, assetType: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Employee Assets</SelectItem>
              <SelectItem value="company">Company Assets</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600">
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
              <SelectItem value="Laptop">Laptop</SelectItem>
              <SelectItem value="Monitor">Monitor</SelectItem>
              <SelectItem value="Tablet">Tablet</SelectItem>
              <SelectItem value="Phone">Phone</SelectItem>
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
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Borrowed">Borrowed</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <ArrowUpDown className="mr-2 h-4 w-4" /> Export
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
                    <span className="font-medium">{asset.category}</span>
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-xs">
                      IT Linked
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{asset.qrCode}</div>
                </td>
                <td className="py-3 px-4">{asset.serialNumber}</td>
                <td className="py-3 px-4">{asset.employee}</td>
                <td className="py-3 px-4">
                  <div>{asset.description}</div>
                  <div className="text-xs text-gray-500">{asset.specifications}</div>
                </td>
                <td className="py-3 px-4">{asset.lendDate || 'Not set'}</td>
                <td className="py-3 px-4">{asset.expectedReturn || 'Not set'}</td>
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
                    {asset.status === 'Borrowed' && (
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleEditAsset(asset)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleDeleteAsset(asset.id)}>
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
      
      {isEditDialogOpen && selectedAsset && (
        <AssetEditDialog
          asset={selectedAsset}
          onSave={handleSaveAsset}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      )}
      
      {isAddDialogOpen && (
        <AddAssetDialog
          onAdd={handleAddAsset}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default AssetsTab;
