
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KolRatesTabProps {
  selectedKol: any;
}

export const KolRatesTab: React.FC<KolRatesTabProps> = ({ selectedKol }) => {
  const [rates, setRates] = useState(selectedKol?.kol_rates || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    platform: "",
    min_rate: 0,
    max_rate: 0,
    currency: ""
  });
  
  // Fetch currencies and platforms when component mounts
  React.useEffect(() => {
    fetchCurrencies();
    fetchPlatforms();
  }, []);
  
  // Fetch currencies from database
  const fetchCurrencies = async () => {
    const { data, error } = await supabase
      .from('kol_currencies')
      .select('*');
      
    if (error) {
      console.error('Error fetching currencies:', error);
      return;
    }
    
    setCurrencies(data || []);
  };
  
  // Fetch platforms from database
  const fetchPlatforms = async () => {
    const { data, error } = await supabase
      .from('kol_platforms')
      .select('*');
      
    if (error) {
      console.error('Error fetching platforms:', error);
      return;
    }
    
    setPlatforms(data || []);
  };
  
  // Open dialog for adding new rate
  const openAddDialog = () => {
    setFormData({
      platform: "",
      min_rate: 0,
      max_rate: 0,
      currency: ""
    });
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(true);
  };
  
  // Open dialog for editing rate
  const openEditDialog = (rate: any) => {
    setFormData({
      platform: rate.platform,
      min_rate: rate.min_rate,
      max_rate: rate.max_rate,
      currency: rate.currency
    });
    setIsEditing(true);
    setEditingId(rate.id);
    setIsDialogOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "min_rate" || name === "max_rate" ? parseFloat(value) : value 
    }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Save rate
  const handleSaveRate = async () => {
    try {
      if (isEditing) {
        // Update existing rate
        const { error } = await supabase
          .from('kol_rates')
          .update({
            platform: formData.platform,
            min_rate: formData.min_rate,
            max_rate: formData.max_rate,
            currency: formData.currency
          })
          .eq('id', editingId);
          
        if (error) throw error;
        
        // Update local state
        setRates(prev => prev.map(rate => 
          rate.id === editingId ? { ...rate, ...formData } : rate
        ));
        
        toast.success('Rate updated successfully');
      } else {
        // Add new rate
        const { data, error } = await supabase
          .from('kol_rates')
          .insert({
            kol_id: selectedKol.id,
            platform: formData.platform,
            min_rate: formData.min_rate,
            max_rate: formData.max_rate,
            currency: formData.currency
          })
          .select();
          
        if (error) throw error;
        
        // Update local state
        setRates(prev => [...prev, data[0]]);
        
        toast.success('Rate added successfully');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving rate:', error);
      toast.error('Failed to save rate');
    }
  };
  
  // Delete rate
  const handleDeleteRate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kol_rates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setRates(prev => prev.filter(rate => rate.id !== id));
      
      toast.success('Rate deleted successfully');
    } catch (error) {
      console.error('Error deleting rate:', error);
      toast.error('Failed to delete rate');
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      {/* Rate Cards */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Rate Cards</h3>
            <Button 
              onClick={openAddDialog}
              variant="outline" 
              className="flex items-center gap-1"
            >
              <PlusCircle size={16} />
              <span>Add Rate Card</span>
            </Button>
          </div>
          
          {rates.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
              <p>No rate cards added yet</p>
              <Button 
                onClick={openAddDialog} 
                variant="link" 
                className="mt-2 text-blue-600"
              >
                Add your first rate card
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rates.map((rate) => (
                <div key={rate.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{rate.platform}</h4>
                      <p className="text-sm text-gray-500">Rate Card</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(rate)}
                      >
                        <Edit size={16} className="text-blue-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteRate(rate.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {rate.min_rate === rate.max_rate ? (
                      <p className="text-2xl font-bold">
                        {formatCurrency(rate.min_rate, rate.currency)}
                      </p>
                    ) : (
                      <p className="text-2xl font-bold">
                        {formatCurrency(rate.min_rate, rate.currency)} - {formatCurrency(rate.max_rate, rate.currency)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Rate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Rate Card' : 'Add Rate Card'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details of this rate card' 
                : 'Add a new rate card for this KOL'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select 
                value={formData.platform}
                onValueChange={(value) => handleSelectChange('platform', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.name}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={formData.currency}
                onValueChange={(value) => handleSelectChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_rate">Minimum Rate</Label>
                <Input 
                  id="min_rate" 
                  name="min_rate"
                  type="number"
                  value={formData.min_rate} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max_rate">Maximum Rate</Label>
                <Input 
                  id="max_rate" 
                  name="max_rate"
                  type="number"
                  value={formData.max_rate} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? 'Update' : 'Add'} Rate Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
