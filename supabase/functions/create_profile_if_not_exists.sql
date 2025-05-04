
CREATE OR REPLACE FUNCTION public.create_profile_if_not_exists(
  user_id UUID, 
  user_email TEXT, 
  user_full_name TEXT DEFAULT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  profile_exists BOOLEAN;
BEGIN
  -- Check if profile exists
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id
  ) INTO profile_exists;
  
  IF profile_exists THEN
    -- Profile already exists, update it
    UPDATE public.profiles
    SET 
      email = COALESCE(user_email, email),
      full_name = COALESCE(user_full_name, full_name),
      email_verified = COALESCE(is_email_verified, email_verified)
    WHERE id = user_id;
    
    RETURN TRUE;
  ELSE
    -- Profile doesn't exist, create it
    INSERT INTO public.profiles (
      id, 
      email, 
      full_name, 
      email_verified
    ) VALUES (
      user_id,
      user_email,
      user_full_name,
      is_email_verified
    );
    
    RETURN TRUE;
  END IF;

EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$;
