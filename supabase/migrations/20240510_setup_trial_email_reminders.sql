
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to execute arbitrary SQL for admin operations
-- This allows us to schedule jobs from edge functions
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Create function that will be called daily to check for trial expirations
-- Enhance the existing function with better logging for email tracking
CREATE OR REPLACE FUNCTION public.check_trial_expirations()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Update all organizations where trial has expired but status not yet updated
  UPDATE public.organizations
  SET trial_expired = TRUE,
      subscription_status = 'expired'
  WHERE trial_end_date < NOW() 
    AND subscription_status = 'trial';
    
  -- Create notifications for organizations approaching trial expiration
  INSERT INTO notifications (
    user_id,
    organization_id,
    title,
    message,
    type,
    action_url
  )
  SELECT 
    p.id,
    o.id,
    'Trial Expiring Soon',
    CASE
      WHEN NOW() > o.trial_end_date - INTERVAL '1 day' THEN 'Your trial expires in less than 24 hours. Upgrade now to continue using all features.'
      WHEN NOW() > o.trial_end_date - INTERVAL '2 days' THEN 'Your trial expires in less than 48 hours. Upgrade now to continue using all features.'
      ELSE 'Your trial expires in less than 72 hours. Upgrade now to continue using all features.'
    END,
    'warning',
    '/settings/subscription'
  FROM 
    public.organizations o
    JOIN public.profiles p ON p.organization_id = o.id
  WHERE 
    o.subscription_status = 'trial'
    AND p.role IN ('super_admin', 'admin')
    AND o.trial_end_date - NOW() < INTERVAL '3 days'
    AND o.trial_end_date > NOW()
    AND NOT EXISTS (
      -- Check if notification already sent in the last 24 hours
      SELECT 1 FROM notifications n
      WHERE n.organization_id = o.id
        AND n.title = 'Trial Expiring Soon'
        AND n.created_at > NOW() - INTERVAL '24 hours'
    );
  
  -- Create notifications for expired trials
  INSERT INTO notifications (
    user_id,
    organization_id,
    title,
    message,
    type,
    action_url
  )
  SELECT 
    p.id,
    o.id,
    'Trial Has Expired',
    'Your trial has expired. Please upgrade to continue using all features.',
    'error',
    '/settings/subscription'
  FROM 
    public.organizations o
    JOIN public.profiles p ON p.organization_id = o.id
  WHERE 
    o.subscription_status = 'expired'
    AND p.role IN ('super_admin', 'admin')
    AND o.trial_end_date < NOW()
    AND o.trial_end_date > NOW() - INTERVAL '1 day'
    AND NOT EXISTS (
      -- Check if notification already sent
      SELECT 1 FROM notifications n
      WHERE n.organization_id = o.id
        AND n.title = 'Trial Has Expired'
    );
END;
$function$;

-- Create a table to track email delivery and engagement
CREATE TABLE IF NOT EXISTS public.trial_email_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id),
    recipient_email TEXT NOT NULL,
    email_type TEXT NOT NULL, -- e.g., 'trial_reminder_3_days', 'trial_expired', etc.
    external_email_id TEXT,   -- ID from email service provider
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_trial_email_org_type ON public.trial_email_status (organization_id, email_type);

-- Make sure subscription_audit_logs table exists for logging
CREATE TABLE IF NOT EXISTS public.subscription_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id),
    action TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS to secure the tables
ALTER TABLE public.trial_email_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for trial_email_status
CREATE POLICY "Admins can view email status for their organization" 
    ON public.trial_email_status FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() 
            AND profiles.organization_id = trial_email_status.organization_id
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- RLS policies for subscription_audit_logs
CREATE POLICY "Admins can view audit logs for their organization" 
    ON public.subscription_audit_logs FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() 
            AND profiles.organization_id = subscription_audit_logs.organization_id
            AND profiles.role IN ('admin', 'super_admin')
        )
    );
