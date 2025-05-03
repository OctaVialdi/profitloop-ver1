
export interface OrganizationFormData {
  name: string;
  businessField: string;
  employeeCount: string;
  address?: string;
  phone?: string;
}

export interface BusinessField {
  value: string;
  label: string;
}
