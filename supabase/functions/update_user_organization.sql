
CREATE OR REPLACE FUNCTION public.update_user_organization(user_id uuid, org_id uuid, user_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    organization_id = org_id,
    role = user_role
  WHERE id = user_id;
END;
$$;
