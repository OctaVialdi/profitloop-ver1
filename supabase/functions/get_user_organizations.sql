
CREATE OR REPLACE FUNCTION public.get_user_organizations()
RETURNS TABLE (
  id uuid,
  name text,
  role text,
  logo_path text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    p.role,
    o.logo_path
  FROM 
    profiles p
    JOIN organizations o ON p.organization_id = o.id
  WHERE 
    p.id = auth.uid();
END;
$$;
