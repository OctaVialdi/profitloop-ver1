
-- This file should be executed via Supabase SQL Editor to disable the automatic profile creation
-- Note: In some setups, there might be a trigger called "on_auth_user_created" that needs to be dropped
-- If it exists, this will disable it; if not, nothing will happen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
