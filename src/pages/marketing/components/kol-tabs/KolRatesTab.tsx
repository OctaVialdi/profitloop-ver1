
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Kol, KolRate } from "@/hooks/useKols";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface KolRatesTabProps {
  selectedKol: Kol;
  rates: KolRate[];
  onAddRate: (rate: Omit<KolRate, 'id' | 'created_at' | 'updated_at'>) => Promise<KolRate[] | null>;
  onUpdateRate: (id: string, updates: Partial<KolRate>) => Promise<KolRate[] | null>;
  onDeleteRate: (id: string, kolId: string) => Promise<boolean>;
}

export const KolRatesTab: React.FC<KolRatesTabProps> = ({ 
  selectedKol,
  rates,
  onAddRate,
  onUpdateRate,
  onDeleteRate
}) => {
  const [newRate, setNewRate] = useState({
    platform: "",
    currency: "USD",
    min_rate: 0,
    max_rate: 0
  });
  const [editRate, setEditRate] = useState<KolRate | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<KolRate>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<KolRate | null>(null);

  const platformOptions = [
    "Instagram", "TikTok", "YouTube", "Facebook", "Twitter", "LinkedIn", "Pinterest", "Snapchat"
  ];
  
  const currencyOptions = [
    { code: "USD", name: "US Dollar" },
    { code: "IDR", name: "Indonesian Rupiah" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "MYR", name: "Malaysian Ringgit" },
    { code: "SGD", name: "Singapore Dollar" },
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setNewRate({
      ...newRate,
      [field]: value
    });
  };
  
  const handleEditInputChange = (field: string, value: string | number) => {
    setEditFormData({
      ...editFormData,
      [field]: value
    });
  };
  
  const handleAddRate = async () => {
    await onAddRate({
      ...newRate,
      kol_id: selectedKol.id
    });
    
    // Reset form
    setNewRate({
      platform: "",
      currency: "USD",
      min_rate: 0,
      max_rate: 0
    });
  };
  
  const handleOpenEdit = (rate: KolRate) => {
    setEditRate(rate);
    setEditFormData({
      platform: rate.platform,
      currency: rate.currency,
      min_rate: rate.min_rate,
      max_rate: rate.max_rate
    });
  };
  
  const handleSaveEdit = async () => {
    if (!editRate) return;
    
    await onUpdateRate(editRate.id, editFormData);
    setEditRate(null);
  };
  
  const handleOpenDelete = (rate: KolRate) => {
    setRateToDelete(rate);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!rateToDelete) return;
    
    await onDeleteRate(rateToDelete.id, rateToDelete.kol_id);
    setIsDeleteDialogOpen(false);
    setRateToDelete(null);
  };
  
  const formatCurrency = (currency: string, value: number) => {
    const formatter = new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(value);
  };
  
  const isFormValid = newRate.platform && newRate.currency && (newRate.min_rate > 0 || newRate.max_rate > 0);
  
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-1">Rate Cards</h4>
        <p className="text-sm text-gray-500 mb-6">Manage the KOL's pricing for different platforms and content types</p>
      </div>
      
      <div className="border rounded-md p-6">
        <h5 className="font-medium mb-4">Add New Rate Card</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <Select 
              value={newRate.platform} 
              onValueChange={(value) => handleInputChange('platform', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map(platform => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <Select 
              value={newRate.currency} 
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map(currency => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Rate</label>
            <Input 
              type="number" 
              placeholder="Minimum rate" 
              value={newRate.min_rate || ''}
              onChange={(e) => handleInputChange('min_rate', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maximum Rate</label>
            <Input 
              type="number" 
              placeholder="Maximum rate" 
              value={newRate.max_rate || ''}
              onChange={(e) => handleInputChange('max_rate', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <Button 
          size="sm" 
          className="bg-purple-100 text-purple-700 hover:bg-purple-200"
          onClick={handleAddRate}
          disabled={!isFormValid}
        >
          Add Rate Card
        </Button>
      </div>
      
      {rates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rates.map(rate => (
            <Card key={rate.id} className="p-4 border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{rate.platform}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatCurrency(rate.currency, rate.min_rate)} - {formatCurrency(rate.currency, rate.max_rate)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-8 w-8">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenEdit(rate)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={() => handleOpenDelete(rate)}
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-6 flex items-center justify-center flex-col py-12">
          <p className="text-gray-500 mb-1">No rate cards defined yet</p>
          <p className="text-xs text-gray-400">Add rates using the form above</p>
        </div>
      )}
      
      {/* Edit Rate Dialog */}
      <Dialog open={!!editRate} onOpenChange={(open) => !open && setEditRate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rate Card</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Platform</label>
              <div className="col-span-3">
                <Select 
                  value={editFormData.platform as string} 
                  onValueChange={(value) => handleEditInputChange('platform', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Currency</label>
              <div className="col-span-3">
                <Select 
                  value={editFormData.currency as string} 
                  onValueChange={(value) => handleEditInputChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Min Rate</label>
              <div className="col-span-3">
                <Input 
                  type="number" 
                  value={editFormData.min_rate || ''} 
                  onChange={(e) => handleEditInputChange('min_rate', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Max Rate</label>
              <div className="col-span-3">
                <Input 
                  type="number" 
                  value={editFormData.max_rate || ''} 
                  onChange={(e) => handleEditInputChange('max_rate', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRate(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rate Card</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rate card? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
