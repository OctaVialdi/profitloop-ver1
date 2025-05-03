import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CalendarIcon, QrCode } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

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

interface AddAssetDialogProps {
  onAdd: (asset: Partial<Asset>) => void;
  onCancel: () => void;
}

const AddAssetDialog: React.FC<AddAssetDialogProps> = ({ onAdd, onCancel }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<Partial<Asset>>({
    category: '',
    serialNumber: '',
    qrCode: '',
    employee: '',
    description: '',
    specifications: '',
    status: 'Available',
    condition: 'Excellent',
  });
  const [updateDate, setUpdateDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState('0');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateQR = () => {
    if (formData.serialNumber) {
      const qrCode = `QR-${formData.serialNumber}`;
      setFormData({ ...formData, qrCode });
      
      toast({
        title: "QR Code Generated",
        description: `Generated QR code: ${qrCode}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a serial number first",
        variant: "destructive",
      });
    }
  };

  const handleAddAsset = () => {
    // In a real app, we'd validate the form data
    if (!formData.category || !formData.serialNumber || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      ...formData,
      id: Math.random().toString(36).substring(2, 9), // Generate a random ID for now
      lendDate: updateDate ? format(updateDate, 'MM/dd/yyyy') : '',
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
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
                  placeholder="e.g. Laptop, Monitor, etc."
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Serial Number</label>
                <Input 
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. LP-2023-003"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Description</label>
              <Input 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g. MacBook Pro 14-inch"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Specifications</label>
              <Textarea 
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g. M1 Pro, 16GB RAM, 512GB SSD"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Quantity</label>
                <Input 
                  type="number"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
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
                    <SelectValue placeholder="Select condition" />
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
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Borrowed">Borrowed</SelectItem>
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
                  placeholder="QR Code identifier"
                />
                <Button variant="outline" onClick={handleGenerateQR}>
                  <QrCode className="mr-2 h-4 w-4" /> Generate QR
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Other tabs can be implemented later */}
          <TabsContent value="financial">
            <div className="p-8 text-center text-gray-500">
              Financial information can be added after creating the asset
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="p-8 text-center text-gray-500">
              Documents can be uploaded after creating the asset
            </div>
          </TabsContent>
          
          <TabsContent value="integration">
            <div className="p-8 text-center text-gray-500">
              IT system integration can be configured after creating the asset
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleAddAsset} className="bg-purple-600 hover:bg-purple-700">Add Asset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetDialog;
