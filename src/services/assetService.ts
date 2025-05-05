
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmployeeAsset {
  id: string;
  employee_id: string;
  name: string;
  asset_type: string;
  serial_number?: string;
  asset_tag?: string;
  brand?: string;
  model?: string;
  specifications?: string;
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  status: 'In Use' | 'Available' | 'Maintenance' | 'Retired' | 'Lost';
  assigned_date?: string;
  expected_return_date?: string;
  purchase_date?: string;
  purchase_price?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AssetFormData {
  name: string;
  asset_type: string;
  serial_number?: string;
  asset_tag?: string;
  brand?: string;
  model?: string;
  specifications?: string;
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  status: 'In Use' | 'Available' | 'Maintenance' | 'Retired' | 'Lost';
  assigned_date?: string;
  expected_return_date?: string;
  purchase_date?: string;
  purchase_price?: number;
  notes?: string;
}

export const assetTypes = [
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

export const assetConditions = ['Excellent', 'Good', 'Fair', 'Poor'];
export const assetStatuses = ['In Use', 'Available', 'Maintenance', 'Retired', 'Lost'];

export const assetService = {
  async getEmployeeAssets(employeeId: string): Promise<EmployeeAsset[]> {
    try {
      const { data, error } = await supabase
        .from('employee_assets')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as EmployeeAsset[];
    } catch (error) {
      console.error('Error fetching employee assets:', error);
      return [];
    }
  },

  async addAsset(employeeId: string, assetData: AssetFormData): Promise<EmployeeAsset | null> {
    try {
      const { data, error } = await supabase
        .from('employee_assets')
        .insert({
          employee_id: employeeId,
          ...assetData
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Asset added successfully');
      return data as EmployeeAsset;
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset');
      return null;
    }
  },

  async updateAsset(assetId: string, assetData: AssetFormData): Promise<EmployeeAsset | null> {
    try {
      const { data, error } = await supabase
        .from('employee_assets')
        .update(assetData)
        .eq('id', assetId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Asset updated successfully');
      return data as EmployeeAsset;
    } catch (error) {
      console.error('Error updating asset:', error);
      toast.error('Failed to update asset');
      return null;
    }
  },

  async deleteAsset(assetId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('employee_assets')
        .delete()
        .eq('id', assetId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Asset deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
      return false;
    }
  }
};
