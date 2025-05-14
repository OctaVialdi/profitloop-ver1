import { useState, FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Organization {
  id: string;
  name: string;
  business_field?: string;
  employee_count?: number;
  address?: string;
  phone?: string;
  subscription_plan_id?: string;
  trial_end_date?: string;
  created_at?: string;
}

export interface OrganizationFormData {
  name: string;
  business_field: string;
  employee_count: number;
  address: string;
  phone: string;
}

export const useOrganizationSetup = () => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    business_field: '',
    employee_count: 0,
    address: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);

  // Fetch current organization data
  const fetchOrganization = async () => {
    setIsChecking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();
          
        if (profileData?.organization_id) {
          const { data: orgData } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', profileData.organization_id)
            .single();
            
          if (orgData) {
            setOrganization(orgData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Use RPC to create organization with profile
      const { data, error } = await supabase.rpc('create_organization_with_profile', {
        user_id: user.id,
        org_name: formData.name,
        org_business_field: formData.business_field,
        org_employee_count: Number(formData.employee_count),
        org_address: formData.address,
        org_phone: formData.phone,
        user_role: 'super_admin'
      });

      if (error) {
        throw error;
      }

      if (data) {
        setOrganization(data);
      }

      return data;
    } catch (error: any) {
      console.error('Error creating organization:', error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    isChecking,
    organization,
    fetchOrganization
  };
};
