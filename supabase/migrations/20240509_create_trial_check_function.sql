
-- Creates a function to check for expired trials and update their status
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
    '/subscription'
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
    '/subscription'
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

-- Add trigger to check trial when organization is updated
CREATE OR REPLACE FUNCTION public.check_trial_expiration()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  days_left INTEGER;
  org_admins RECORD;
BEGIN
  -- Hanya memproses jika trial_end_date diperbarui atau dibuat
  IF (TG_OP = 'UPDATE' AND OLD.trial_end_date IS DISTINCT FROM NEW.trial_end_date) OR TG_OP = 'INSERT' THEN
    -- Hitung hari tersisa
    days_left := EXTRACT(DAY FROM (NEW.trial_end_date - CURRENT_TIMESTAMP));
    
    -- Jika kurang dari 7 hari tersisa dan belum expired
    IF days_left <= 7 AND days_left > 0 AND NOT COALESCE(NEW.trial_expired, false) THEN
      -- Kirim notifikasi ke semua admin organisasi
      FOR org_admins IN (
        SELECT id FROM profiles 
        WHERE organization_id = NEW.id AND role IN ('super_admin', 'admin')
      ) LOOP
        INSERT INTO notifications (
          user_id, organization_id, title, message, type, action_url
        ) VALUES (
          org_admins.id,
          NEW.id,
          'Masa Trial Akan Berakhir',
          'Masa trial organisasi Anda akan berakhir dalam ' || days_left || ' hari. Silakan berlangganan untuk terus menggunakan layanan.',
          'warning',
          '/subscription'
        );
      END LOOP;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Add trigger to update trial status when organization is inserted or updated
CREATE OR REPLACE FUNCTION public.update_organization_trial_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Set trial_end_date to 14 days after trial_start_date if not already set
  IF NEW.trial_end_date IS NULL AND NEW.trial_start_date IS NOT NULL THEN
    NEW.trial_end_date := NEW.trial_start_date + INTERVAL '14 days';
  END IF;
  
  -- Set grace_period_end to 2 days after trial_end_date if not already set
  IF NEW.grace_period_end IS NULL AND NEW.trial_end_date IS NOT NULL THEN
    NEW.grace_period_end := NEW.trial_end_date + INTERVAL '2 days';
  END IF;
  
  -- Calculate subscription_status based on dates and existing status
  IF NEW.subscription_plan_id IS NOT NULL AND NEW.subscription_plan_id != (
      SELECT id FROM subscription_plans WHERE name = 'Basic' LIMIT 1
    ) THEN
    -- If they have a paid plan, set status to active
    NEW.subscription_status := 'active';
    NEW.trial_expired := FALSE;
  ELSIF NEW.trial_end_date < NOW() THEN
    -- If trial has ended, set status to expired
    NEW.subscription_status := 'expired';
    NEW.trial_expired := TRUE;
  ELSE
    -- Otherwise, they are in trial
    NEW.subscription_status := 'trial';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Add the triggers to the organizations table
DROP TRIGGER IF EXISTS before_organization_insert_update ON public.organizations;
CREATE TRIGGER before_organization_insert_update
BEFORE INSERT OR UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION update_organization_trial_status();

DROP TRIGGER IF EXISTS after_organization_trial_update ON public.organizations;
CREATE TRIGGER after_organization_trial_update
AFTER UPDATE OF trial_end_date ON public.organizations
FOR EACH ROW EXECUTE FUNCTION check_trial_expiration();

-- Create function to extend trials for admin use
CREATE OR REPLACE FUNCTION public.extend_organization_trial(org_id uuid, days_to_add integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  org_record RECORD;
  new_trial_end_date TIMESTAMP WITH TIME ZONE;
  new_grace_period_end TIMESTAMP WITH TIME ZONE;
  result_data JSONB;
BEGIN
  -- Get the current organization record
  SELECT * INTO org_record 
  FROM public.organizations 
  WHERE id = org_id;
  
  IF org_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Organization not found'
    );
  END IF;
  
  -- Calculate the new trial_end_date
  -- If trial has expired, extend from current date, otherwise extend from current trial_end_date
  IF org_record.trial_end_date < NOW() THEN
    new_trial_end_date := NOW() + (days_to_add || ' days')::INTERVAL;
  ELSE
    new_trial_end_date := org_record.trial_end_date + (days_to_add || ' days')::INTERVAL;
  END IF;
  
  -- Calculate new grace period (2 days after trial end)
  new_grace_period_end := new_trial_end_date + INTERVAL '2 days';
  
  -- Update the organization record
  UPDATE public.organizations
  SET 
    trial_end_date = new_trial_end_date,
    grace_period_end = new_grace_period_end,
    subscription_status = 'trial',
    trial_expired = false
  WHERE id = org_id
  RETURNING id, trial_end_date, grace_period_end, subscription_status INTO org_record;
  
  -- Log the trial extension in audit logs
  INSERT INTO public.subscription_audit_logs (
    organization_id,
    action,
    user_id,
    data
  ) VALUES (
    org_id,
    'trial_extension_approved',
    auth.uid(),
    jsonb_build_object(
      'days_added', days_to_add,
      'new_trial_end_date', new_trial_end_date,
      'extended_by', auth.uid()
    )
  );
  
  -- Build the result
  result_data := jsonb_build_object(
    'success', true,
    'message', 'Trial extended successfully',
    'organization_id', org_id,
    'days_added', days_to_add,
    'new_trial_end_date', new_trial_end_date,
    'new_grace_period_end', new_grace_period_end
  );
  
  RETURN result_data;
END;
$function$;
