
-- Function to get organizations with trials expiring on a specific date
CREATE OR REPLACE FUNCTION public.get_organizations_with_trial_expiring_on(target_date TEXT)
RETURNS TABLE(
  id UUID,
  name TEXT,
  trial_end_date TIMESTAMPTZ,
  trial_expired BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    o.trial_end_date,
    o.trial_expired
  FROM 
    public.organizations o
  WHERE 
    o.subscription_status = 'trial' 
    AND o.trial_expired = FALSE
    AND DATE(o.trial_end_date) = DATE(target_date::DATE)
  ORDER BY 
    o.trial_end_date ASC;
END;
$$;
