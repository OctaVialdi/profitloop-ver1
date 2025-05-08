
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmployeeAsset {
  id: string;
  employee_id: string | null; // Changed to allow null for company assets
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
  asset_image?: string;
  // Properties added for organization assets view
  employeeName?: string;
  employeeCode?: string;
  employees?: {
    name: string;
    employee_id: string;
  };
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
  asset_image?: string;
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

  // New method to get all organization assets
  async getAllOrganizationAssets(): Promise<EmployeeAsset[]> {
    try {
      const { data, error } = await supabase
        .from('employee_assets')
        .select(`
          *,
          employees(name, employee_id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform the data to match the EmployeeAsset interface
      const transformedData = data.map((asset: any) => {
        const employeeName = asset.employees ? asset.employees.name : 'Unassigned';
        const employeeCode = asset.employees ? asset.employees.employee_id : '';
        
        // Create a copy without the employees field
        const { employees, ...assetData } = asset;
        
        return {
          ...assetData,
          employeeName, // Add employeeName for display purposes
          employeeCode  // Add employeeCode for display purposes
        };
      });
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching all organization assets:', error);
      toast.error('Failed to load organization assets');
      return [];
    }
  },

  async addAsset(employeeId: string | null, assetData: AssetFormData): Promise<EmployeeAsset | null> {
    try {
      // Modified to handle optional employeeId
      let insertData;
      
      if (employeeId) {
        insertData = {
          employee_id: employeeId,
          ...assetData
        };
      } else {
        // For company assets not assigned to anyone
        insertData = {
          ...assetData
        };
      }

      const { data, error } = await supabase
        .from('employee_assets')
        .insert(insertData)
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

  // Update to accept optional employeeId for reassigning assets
  async assignAssetToEmployee(assetId: string, employeeId: string | null): Promise<boolean> {
    try {
      const updateData = employeeId 
        ? { employee_id: employeeId, status: 'In Use' as const, assigned_date: new Date().toISOString().split('T')[0] }
        : { employee_id: null, status: 'Available' as const, assigned_date: null };
      
      const { error } = await supabase
        .from('employee_assets')
        .update(updateData)
        .eq('id', assetId);
      
      if (error) {
        throw error;
      }
      
      toast.success(employeeId ? 'Asset assigned successfully' : 'Asset unassigned successfully');
      return true;
    } catch (error) {
      console.error('Error assigning/unassigning asset:', error);
      toast.error(employeeId ? 'Failed to assign asset' : 'Failed to unassign asset');
      return false;
    }
  },

  async deleteAsset(assetId: string): Promise<boolean> {
    try {
      // First get the asset to check if it has an image
      const { data: asset } = await supabase
        .from('employee_assets')
        .select('asset_image')
        .eq('id', assetId)
        .single();
      
      // If there's an image, delete it from storage
      if (asset?.asset_image) {
        const imagePath = asset.asset_image.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('asset_images')
            .remove([imagePath]);
        }
      }
      
      // Then delete the asset record
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
  },
  
  // New method for uploading asset images
  async uploadAssetImage(file: File): Promise<string | null> {
    try {
      if (!file) return null;
      
      // Create a unique file name to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      // Upload the file to the asset_images bucket
      const { data, error } = await supabase.storage
        .from('asset_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('asset_images')
        .getPublicUrl(data.path);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading asset image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  }
};
