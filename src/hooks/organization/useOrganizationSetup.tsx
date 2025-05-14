
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Organization {
  id: string;
  name: string;
  business_field?: string;
  employee_count?: number;
  address?: string;
  phone?: string;
  subscription_plan_id?: string;
  subscription_status?: string;
  trial_end_date?: string;
  trial_expired?: boolean;
  created_at?: string;
}

export interface OrganizationFormData {
  name: string;
  business_field: string;
  employee_count: string;
  address: string;
  phone: string;
}

export function useOrganizationSetup() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    business_field: '',
    employee_count: '',
    address: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkUserOrganization() {
      try {
        setIsChecking(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsChecking(false);
          return;
        }

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
      } catch (error) {
        console.error('Error checking organization:', error);
      } finally {
        setIsChecking(false);
      }
    }

    checkUserOrganization();
  }, []);

  const handleChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('create_organization_with_profile', {
        user_id: user.id,
        org_name: formData.name,
        org_business_field: formData.business_field,
        org_employee_count: parseInt(formData.employee_count) || 0,
        org_address: formData.address,
        org_phone: formData.phone,
        user_role: 'super_admin'
      });

      if (error) {
        throw error;
      }

      setOrganization(data);
      return data;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    organization, 
    formData, 
    handleChange, 
    handleSubmit, 
    isLoading, 
    isChecking 
  };
}
