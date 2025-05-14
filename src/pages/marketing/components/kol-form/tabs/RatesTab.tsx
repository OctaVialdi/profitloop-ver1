
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RatesTabProps {
  formData: Record<string, any>;
  handleChange: (field: string, value: any) => void;
}

export const RatesTab: React.FC<RatesTabProps> = ({ formData, handleChange }) => {
  const [platform, setPlatform] = useState("");
  const [minRate, setMinRate] = useState<number>(0);
  const [maxRate, setMaxRate] = useState<number>(0);
  const [currency, setCurrency] = useState("IDR");

  // Initialize tempRates if it doesn't exist in formData
  const rates = formData.tempRates || [];

  const handleAddRate = () => {
    if (!platform) {
      alert("Please select a platform");
      return;
    }
    
    const newRate = {
      platform,
      min_rate: Number(minRate),
      max_rate: Number(maxRate),
      currency
    };
    
    const updatedRates = [...rates, newRate];
    handleChange("tempRates", updatedRates);
    
    // Reset form fields
    setPlatform("");
    setMinRate(0);
    setMaxRate(0);
    setCurrency("IDR");
  };

  const handleRemoveRate = (index: number) => {
    const updatedRates = [...rates];
    updatedRates.splice(index, 1);
    handleChange("tempRates", updatedRates);
  };

  // Format currency
  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">KOL Rate Card</h3>
        <p className="text-sm text-gray-500 mb-4">
          Add the KOL's rate ranges for different platforms
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Instagram Post">Instagram Post</SelectItem>
              <SelectItem value="Instagram Story">Instagram Story</SelectItem>
              <SelectItem value="Instagram Reel">Instagram Reel</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Min Rate</label>
          <Input 
            type="number" 
            placeholder="0" 
            value={minRate.toString()}
            onChange={(e) => setMinRate(parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Max Rate</label>
          <Input 
            type="number" 
            placeholder="0" 
            value={maxRate.toString()}
            onChange={(e) => setMaxRate(parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <div className="flex items-center space-x-2">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDR">IDR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="SGD">SGD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              onClick={handleAddRate}
              size="icon"
              className="mt-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* List of added rates */}
      {rates.length > 0 && (
        <div className="border rounded-md p-4 mt-4">
          <h4 className="font-medium mb-2">Added Rate Cards</h4>
          <div className="space-y-2">
            {rates.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <span className="font-medium">{item.platform}</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span>
                    {formatCurrency(item.min_rate, item.currency)} - {formatCurrency(item.max_rate, item.currency)}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveRate(index)}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
