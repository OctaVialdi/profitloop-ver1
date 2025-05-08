
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, QrCode, Save, X, File } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

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

interface AssetEditDialogProps {
  asset: Asset;
  onSave: (asset: Asset) => void;
  onCancel: () => void;
}

const AssetEditDialog: React.FC<AssetEditDialogProps> = ({ asset, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...asset });
  const [activeTab, setActiveTab] = useState('general');
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(undefined);
  const [updateDate, setUpdateDate] = useState<Date | undefined>(
    formData.lendDate ? new Date(formData.lendDate) : undefined
  );
  const [cost, setCost] = useState("2499.99");
  const [currentValue, setCurrentValue] = useState("1330.995");
  const [depreciation, setDepreciation] = useState("1168.995");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
    
    // In a real app, we'd save to the database
    toast({
      title: "Asset Updated",
      description: "Asset has been updated successfully",
    });
  };

  const handleGenerateQR = () => {
    // In a real app, this would generate a QR code
    toast({
      title: "QR Code Generated",
      description: "QR code has been generated successfully",
    });
  };

  const handleCalculateDepreciation = () => {
    // In a real app, this would calculate depreciation based on purchase date and cost
    toast({
      title: "Depreciation Calculated",
      description: "Asset depreciation has been calculated",
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="integration">HR-IT Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Category</label>
                <Input 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Serial Number</label>
                <Input 
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Description</label>
              <Input 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Specifications</label>
              <Textarea 
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Quantity</label>
                <Input 
                  type="number"
                  name="quantity"
                  defaultValue="1"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Update Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {updateDate ? format(updateDate, 'MM/dd/yyyy') : <span>Select date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={updateDate}
                      onSelect={setUpdateDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Condition</label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(value) => handleSelectChange('condition', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-1">Status</label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Borrowed">Borrowed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Asset QR Code</label>
              <div className="flex gap-2">
                <Input 
                  name="qrCode"
                  value={formData.qrCode}
                  onChange={handleInputChange}
                />
                <Button variant="outline" onClick={handleGenerateQR}>
                  <QrCode className="mr-2 h-4 w-4" /> Generate QR
                </Button>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>QR Code: {formData.qrCode}</p>
                <p>In a real app, a QR code image would be displayed here</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Purchase Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {purchaseDate ? format(purchaseDate, 'MM/dd/yyyy') : <span>01/10/2023</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={purchaseDate}
                      onSelect={setPurchaseDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm mb-1">Cost (Rp)</label>
                <Input 
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <File className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-lg">Depreciation Calculator</span>
                </div>
                <Button variant="outline" onClick={handleCalculateDepreciation}>
                  Calculate
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Original Cost</label>
                  <div className="font-medium">Rp {cost}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Age</label>
                  <div className="font-medium">28 months</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Depreciation</label>
                  <div className="font-medium">Rp {depreciation}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Current Value</label>
                  <div className="font-medium">Rp {currentValue}</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <div>
              <label className="block text-sm mb-2">Asset Agreement</label>
              <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center text-gray-500">
                <File className="h-8 w-8 mb-2" />
                <p>Upload document (Max 25MB)</p>
                <Button variant="secondary" className="mt-4">
                  Select Document
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Receipt / Invoice</label>
              <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center text-gray-500">
                <File className="h-8 w-8 mb-2" />
                <p>Upload document (Max 25MB)</p>
                <Button variant="secondary" className="mt-4">
                  Select Document
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Uploaded Documents</h3>
              <div className="border rounded-md">
                <div className="flex justify-between items-center p-3 border-b">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-600" />
                    <span>asset_agreement_AST-001.pdf</span>
                  </div>
                  <Badge>Agreement</Badge>
                </div>
                <div className="flex justify-between items-center p-3">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-600" />
                    <span>handover_AST-001.pdf</span>
                  </div>
                  <Badge>Handover</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">IT System Integration</h3>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm mb-1">IT System</label>
                  <Select defaultValue="it_asset_management">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it_asset_management">IT Asset Management</SelectItem>
                      <SelectItem value="inventory_system">Inventory System</SelectItem>
                      <SelectItem value="erp_system">ERP System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Synced</span>
                </div>
                <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
                  Sync with IT System
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-5">
              <h3 className="font-medium text-lg mb-2">HR-IT Asset Integration</h3>
              <p className="text-gray-500 mb-4">Manage integrated asset data between HR and IT departments</p>
              
              <div className="flex border-b mb-6 overflow-x-auto">
                <button className="px-4 py-2 border-b-2 border-purple-600 font-medium whitespace-nowrap">
                  Approval Requests
                </button>
                <button className="px-4 py-2 text-gray-500 whitespace-nowrap">
                  Asset Tags
                </button>
                <button className="px-4 py-2 text-gray-500 whitespace-nowrap">
                  Condition Report
                </button>
                <button className="px-4 py-2 text-gray-500 whitespace-nowrap">
                  System Sync
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Asset Change Approval</h4>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pending
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p><span className="font-medium">Asset:</span> AST-001</p>
                  <p><span className="font-medium">Requested By:</span> Sarah Johnson</p>
                  <p><span className="font-medium">Date:</span> 5/3/2025, 4:56:31 PM</p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Requested Changes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Status: Active → <span className="text-blue-600">Maintenance</span>
                    </li>
                    <li>
                      Specifications: 8GB RAM, 256GB SSD → <span className="text-blue-600">16GB RAM, 512GB SSD</span>
                    </li>
                  </ul>
                </div>
                
                <Textarea 
                  placeholder="Add approval notes..."
                  className="my-4"
                />
                
                <div className="flex justify-between">
                  <Button variant="outline">Reject</Button>
                  <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssetEditDialog;
