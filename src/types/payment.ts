
export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  provider: string;
  type: 'bank_transfer' | 'e_wallet' | 'credit_card' | 'retail';
  is_active: boolean;
  logo_url: string;
  configuration?: any;
  created_at?: string;
  updated_at?: string;
}

export interface BillingItem {
  id: string;
  date: string;
  invoice_number: string;
  status: string;
  amount: number;
  plan_name: string;
  currency: string;
  payment_method?: string;
}
