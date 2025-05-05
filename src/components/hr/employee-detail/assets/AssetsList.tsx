
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  Edit,
  Trash2, 
  Search, 
  ChevronDown,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Keyboard,
  MousePointer,
  Printer,
  Camera,
  Package,
  ImageOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { EmployeeAsset, assetService, assetTypes } from "@/services/assetService";
import { format } from "date-fns";
import { EmptyDataDisplay } from "../EmptyDataDisplay";
import { AddAssetDialog } from "./AddAssetDialog";
import { EditAssetDialog } from "./EditAssetDialog";
import { DeleteAssetDialog } from "./DeleteAssetDialog";

interface AssetsListProps {
  assets: EmployeeAsset[];
  employeeId: string;
  onAssetsUpdated: () => void;
  isLoading?: boolean;
}

export const AssetsList = ({ 
  assets, 
  employeeId, 
  onAssetsUpdated,
  isLoading = false
}: AssetsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<EmployeeAsset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<EmployeeAsset | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.serial_number && asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset.specifications && asset.specifications.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = assetTypeFilter ? asset.asset_type === assetTypeFilter : true;
    
    return matchesSearch && matchesType;
  });

  const getAssetIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'laptop': return <Laptop className="h-4 w-4 text-blue-500" />;
      case 'monitor': return <Monitor className="h-4 w-4 text-green-500" />;
      case 'phone': return <Smartphone className="h-4 w-4 text-purple-500" />;
      case 'tablet': return <Tablet className="h-4 w-4 text-orange-500" />;
      case 'keyboard': return <Keyboard className="h-4 w-4 text-indigo-500" />;
      case 'mouse': return <MousePointer className="h-4 w-4 text-pink-500" />;
      case 'printer': return <Printer className="h-4 w-4 text-cyan-500" />;
      case 'camera': return <Camera className="h-4 w-4 text-amber-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleEditClick = (asset: EmployeeAsset) => {
    setEditingAsset(asset);
  };
  
  const handleDeleteClick = (asset: EmployeeAsset) => {
    setDeletingAsset(asset);
  };

  const handleEditComplete = () => {
    setEditingAsset(null);
    onAssetsUpdated();
  };

  const handleDeleteComplete = () => {
    setDeletingAsset(null);
    onAssetsUpdated();
  };

  const handleEditButtonClick = () => {
    setIsAddDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 my-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <>
        <EmptyDataDisplay
          title="No assets assigned yet"
          description="Assign assets to this employee using the 'Add Asset' button above."
          section="assets"
          handleEdit={handleEditButtonClick}
          buttonText="Add Asset"
          onClick={handleEditButtonClick}
        />
        
        <AddAssetDialog
          employeeId={employeeId}
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdded={onAssetsUpdated}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search assets..."
            className="pl-10 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {assetTypeFilter || "All Asset Types"} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setAssetTypeFilter(null)}>
              All Asset Types
            </DropdownMenuItem>
            {assetTypes.map(type => (
              <DropdownMenuItem 
                key={type} 
                onClick={() => setAssetTypeFilter(type)}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Asset Name</TableHead>
              <TableHead className="w-[15%]">Type</TableHead>
              <TableHead className="w-[15%]">Serial Number</TableHead>
              <TableHead className="w-[15%]">Assigned Date</TableHead>
              <TableHead className="w-[15%]">Return Date</TableHead>
              <TableHead className="w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map(asset => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {asset.asset_image ? (
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100 border">
                        <img 
                          src={asset.asset_image} 
                          alt={asset.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded flex-shrink-0 bg-gray-100 border flex items-center justify-center">
                        <ImageOff className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-3">
                      <div>{asset.name}</div>
                      {asset.specifications && (
                        <div className="text-xs text-gray-500">{asset.specifications}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{asset.asset_type}</TableCell>
                <TableCell>{asset.serial_number || "-"}</TableCell>
                <TableCell>
                  {asset.assigned_date ? format(new Date(asset.assigned_date), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell>
                  {asset.expected_return_date ? format(new Date(asset.expected_return_date), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditClick(asset)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteClick(asset)}
                      title="Delete"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog components */}
      {editingAsset && (
        <EditAssetDialog
          asset={editingAsset}
          isOpen={!!editingAsset}
          onClose={() => setEditingAsset(null)}
          onSaved={handleEditComplete}
        />
      )}

      {deletingAsset && (
        <DeleteAssetDialog
          asset={deletingAsset}
          isOpen={!!deletingAsset}
          onClose={() => setDeletingAsset(null)}
          onDeleted={handleDeleteComplete}
        />
      )}
      
      <AddAssetDialog
        employeeId={employeeId}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdded={onAssetsUpdated}
      />
    </div>
  );
};
