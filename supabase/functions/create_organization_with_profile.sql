
CREATE OR REPLACE FUNCTION public.create_organization_with_profile(
  user_id uuid, 
  org_name text, 
  org_business_field text, 
  org_employee_count integer, 
  org_address text, 
  org_phone text, 
  user_role text,
  creator_email text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  plan_id UUID;
  trial_end_date TIMESTAMP WITH TIME ZONE;
  new_org_id UUID;
  org_data JSONB;
  creator_email_value TEXT;
BEGIN
  -- Get default subscription plan (Basic)
  SELECT id INTO plan_id
  FROM public.subscription_plans
  WHERE name = 'Basic'
  LIMIT 1;
  
  -- If no plan exists, create a basic plan
  IF plan_id IS NULL THEN
    INSERT INTO public.subscription_plans (name, max_members, price, features)
    VALUES ('Basic', 5, 0, '{"storage": "1GB", "api_calls": 1000}'::jsonb)
    RETURNING id INTO plan_id;
  END IF;
  
  -- Set trial_end_date to 14 days from now (changed from 30)
  trial_end_date := now() + interval '14 days';
  
  -- Use provided creator email or fetch from auth.users if not provided
  IF creator_email IS NULL THEN
    SELECT email INTO creator_email_value 
    FROM auth.users 
    WHERE id = user_id;
  ELSE
    creator_email_value := creator_email;
  END IF;
  
  -- Create new organization
  INSERT INTO public.organizations (
    name,
    business_field,
    employee_count,
    address,
    phone,
    subscription_plan_id,
    trial_end_date,
    creator_email
  )
  VALUES (
    org_name,
    org_business_field,
    org_employee_count,
    org_address,
    org_phone,
    plan_id,
    trial_end_date,
    creator_email_value
  )
  RETURNING id INTO new_org_id;
  
  -- Update user profile with SECURITY DEFINER to bypass RLS
  UPDATE public.profiles
  SET 
    organization_id = new_org_id,
    role = user_role
  WHERE id = user_id;
  
  -- If no rows were updated, the profile doesn't exist, so create it
  IF NOT FOUND THEN
    -- Get user email from auth.users
    INSERT INTO public.profiles (id, organization_id, role, email)
    SELECT 
      user_id,
      new_org_id,
      user_role,
      email
    FROM auth.users
    WHERE id = user_id;
  END IF;
  
  -- Return the created organization data as JSON
  SELECT jsonb_build_object(
    'id', o.id,
    'name', o.name,
    'business_field', o.business_field,
    'employee_count', o.employee_count,
    'address', o.address,
    'phone', o.phone,
    'subscription_plan_id', o.subscription_plan_id,
    'trial_end_date', o.trial_end_date,
    'creator_email', o.creator_email
  ) INTO org_data
  FROM public.organizations o
  WHERE o.id = new_org_id;
  
  RETURN org_data;
END;
$function$;
