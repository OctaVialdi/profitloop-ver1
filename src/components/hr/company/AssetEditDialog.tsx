
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  asset_tag: string | null;
  status: string;
  condition: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  assigned_date: string | null;
  expected_return_date: string | null;
  notes: string | null;
  specifications: string | null;
  asset_image: string | null;
}

interface AssetEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onSave: (asset: Asset) => void;
}

const AssetEditDialog: React.FC<AssetEditDialogProps> = ({
  isOpen,
  onClose,
  asset,
  onSave,
}) => {
  const [editedAsset, setEditedAsset] = useState<Asset | null>(asset);
  const [activeTab, setActiveTab] = useState('details');
  
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(
    asset?.purchase_date ? new Date(asset.purchase_date) : undefined
  );
  
  const [assignedDate, setAssignedDate] = useState<Date | undefined>(
    asset?.assigned_date ? new Date(asset.assigned_date) : undefined
  );
  
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    asset?.expected_return_date ? new Date(asset.expected_return_date) : undefined
  );

  if (!editedAsset) return null;

  const handleChange = (field: keyof Asset, value: any) => {
    setEditedAsset({ ...editedAsset, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedAsset) {
      onSave(editedAsset);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>Update asset information and details.</DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">
              Basic Details
            </TabsTrigger>
            <TabsTrigger value="technical">
              Technical Info
            </TabsTrigger>
            <TabsTrigger value="assignment">
              Assignment
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Asset Name</Label>
                  <Input 
                    id="name" 
                    value={editedAsset.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="asset_type">Asset Type</Label>
                  <Select 
                    value={editedAsset.asset_type}
                    onValueChange={(value) => handleChange('asset_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Monitor">Monitor</SelectItem>
                      <SelectItem value="Peripheral">Peripheral</SelectItem>
                      <SelectItem value="Software">Software License</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input 
                    id="brand" 
                    value={editedAsset.brand || ''}
                    onChange={(e) => handleChange('brand', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input 
                    id="model" 
                    value={editedAsset.model || ''}
                    onChange={(e) => handleChange('model', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={editedAsset.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Use">In Use</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="In Repair">In Repair</SelectItem>
                      <SelectItem value="Disposed">Disposed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select 
                    value={editedAsset.condition || ''}
                    onValueChange={(value) => handleChange('condition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                      <SelectItem value="Broken">Broken</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={editedAsset.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Add any notes about this asset"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serial_number">Serial Number</Label>
                  <Input 
                    id="serial_number" 
                    value={editedAsset.serial_number || ''}
                    onChange={(e) => handleChange('serial_number', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="asset_tag">Asset Tag</Label>
                  <Input 
                    id="asset_tag" 
                    value={editedAsset.asset_tag || ''}
                    onChange={(e) => handleChange('asset_tag', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea 
                  id="specifications" 
                  value={editedAsset.specifications || ''}
                  onChange={(e) => handleChange('specifications', e.target.value)}
                  placeholder="Enter technical specifications"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchase_date">Purchase Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="purchase_date"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !purchaseDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {purchaseDate ? format(purchaseDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={purchaseDate}
                        onSelect={(date) => {
                          setPurchaseDate(date);
                          handleChange('purchase_date', date ? format(date, 'yyyy-MM-dd') : null);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchase_price">Purchase Price</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input 
                      id="purchase_price" 
                      type="number"
                      className="pl-7"
                      value={editedAsset.purchase_price || ''}
                      onChange={(e) => handleChange('purchase_price', parseFloat(e.target.value) || null)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="assignment" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assigned_date">Assigned Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="assigned_date"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !assignedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {assignedDate ? format(assignedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={assignedDate}
                        onSelect={(date) => {
                          setAssignedDate(date);
                          handleChange('assigned_date', date ? format(date, 'yyyy-MM-dd') : null);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expected_return_date">Expected Return Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="expected_return_date"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !returnDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={(date) => {
                          setReturnDate(date);
                          handleChange('expected_return_date', date ? format(date, 'yyyy-MM-dd') : null);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AssetEditDialog;
