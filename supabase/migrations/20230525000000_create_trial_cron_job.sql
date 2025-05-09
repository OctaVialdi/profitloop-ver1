
-- Create function to create a trial check cron job
CREATE OR REPLACE FUNCTION public.create_trial_check_cron_job()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if pg_cron is available
  IF EXISTS (
    SELECT 1
    FROM pg_extension
    WHERE extname = 'pg_cron'
  ) THEN
    -- Create or replace the cron job to run daily at midnight
    PERFORM cron.schedule(
      'check-trial-expiration',
      '0 0 * * *', -- Run daily at midnight (cron syntax)
      $$
      SELECT net.http_post(
        url := 'https://nqbcxrujjxwgoyjxmmla.functions.supabase.co/daily-trial-check',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmN4cnVqanh3Z295anhtbWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMjA3ODAsImV4cCI6MjA2MTU5Njc4MH0.ksytXhQEPyaHVNCmmFd45FgC58Nyn3MOkSdioIqUiwQ"}'::jsonb,
        body := '{}'::jsonb
      );
      $$
    );
    
    RETURN true;
  ELSE
    RAISE EXCEPTION 'pg_cron extension not available';
    RETURN false;
  END IF;
END;
$$;

-- Add a function to handle trial extension requests
CREATE OR REPLACE FUNCTION public.request_trial_extension(
  org_id UUID,
  reason TEXT,
  contact_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  requesting_user_id UUID;
BEGIN
  -- Get the current user ID
  requesting_user_id := auth.uid();
  
  -- Validate the user is part of this organization
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = requesting_user_id AND organization_id = org_id
  ) THEN
    RETURN false;
  END IF;
  
  -- Create an audit log entry
  INSERT INTO subscription_audit_logs (
    organization_id,
    user_id,
    action,
    data
  ) VALUES (
    org_id,
    requesting_user_id,
    'trial_extension_requested',
    jsonb_build_object(
      'reason', reason,
      'contact_email', contact_email,
      'requested_at', now()
    )
  );
  
  -- Create a notification for admins
  INSERT INTO notifications (
    organization_id,
    title,
    message,
    type,
    user_id
  )
  SELECT 
    org_id,
    'Trial Extension Request',
    'A user has requested a trial extension. Reason: ' || reason,
    'info',
    p.id
  FROM 
    profiles p
  WHERE 
    p.organization_id = org_id AND
    p.role IN ('super_admin', 'admin');
  
  RETURN true;
END;
$$;

-- Add a function to extend an organization's trial
CREATE OR REPLACE FUNCTION public.extend_organization_trial(
  org_id UUID,
  days_to_add INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  current_user_role TEXT;
  old_trial_end_date TIMESTAMP WITH TIME ZONE;
  new_trial_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the current user ID and role
  SELECT id, role INTO current_user_id, current_user_role
  FROM profiles
  WHERE id = auth.uid();
  
  -- Validate the user is an admin
  IF current_user_role NOT IN ('super_admin', 'admin') THEN
    RETURN false;
  END IF;
  
  -- Get the current trial end date
  SELECT trial_end_date INTO old_trial_end_date
  FROM organizations
  WHERE id = org_id;
  
  -- Calculate the new trial end date
  new_trial_end_date := GREATEST(old_trial_end_date, now()) + (days_to_add || ' days')::INTERVAL;
  
  -- Update the organization
  UPDATE organizations
  SET 
    trial_end_date = new_trial_end_date,
    trial_expired = false,
    subscription_status = 'trial'
  WHERE id = org_id;
  
  -- Create an audit log entry
  INSERT INTO subscription_audit_logs (
    organization_id,
    user_id,
    action,
    data
  ) VALUES (
    org_id,
    current_user_id,
    'trial_extended',
    jsonb_build_object(
      'days_added', days_to_add,
      'old_end_date', old_trial_end_date,
      'new_end_date', new_trial_end_date
    )
  );
  
  RETURN true;
END;
$$;

-- Create index on organizations.trial_end_date for faster queries
CREATE INDEX IF NOT EXISTS idx_organizations_trial_end_date
ON organizations(trial_end_date);

-- Create index on subscription status for faster queries
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_status
ON organizations(subscription_status);
