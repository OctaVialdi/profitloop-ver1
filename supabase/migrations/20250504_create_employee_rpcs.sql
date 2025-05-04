
-- Create RPC functions to safely get employee details

-- Function to get employee personal details
CREATE OR REPLACE FUNCTION public.get_employee_personal_details(employee_id_param UUID)
RETURNS SETOF public.employee_personal_details
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM public.employee_personal_details WHERE employee_id = employee_id_param;
$$;

-- Function to get employee identity address
CREATE OR REPLACE FUNCTION public.get_employee_identity_address(employee_id_param UUID)
RETURNS SETOF public.employee_identity_addresses
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM public.employee_identity_addresses WHERE employee_id = employee_id_param;
$$;

-- Function to get employee employment details
CREATE OR REPLACE FUNCTION public.get_employee_employment(employee_id_param UUID)
RETURNS SETOF public.employee_employment
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM public.employee_employment WHERE employee_id = employee_id_param;
$$;
