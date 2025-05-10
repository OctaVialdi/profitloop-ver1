
-- Create subscription_analytics table
CREATE TABLE IF NOT EXISTS public.subscription_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id),
  user_id UUID,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS subscription_analytics_organization_id_idx ON public.subscription_analytics(organization_id);
CREATE INDEX IF NOT EXISTS subscription_analytics_event_type_idx ON public.subscription_analytics(event_type);
CREATE INDEX IF NOT EXISTS subscription_analytics_created_at_idx ON public.subscription_analytics(created_at);

-- Add RLS policies for subscription_analytics
ALTER TABLE public.subscription_analytics ENABLE ROW LEVEL SECURITY;

-- Organizations can view their own analytics
CREATE POLICY "Organizations can view their own analytics" 
  ON public.subscription_analytics 
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT profiles.id 
      FROM profiles 
      WHERE profiles.organization_id = subscription_analytics.organization_id
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Insert policy - Any authenticated user can insert analytics
CREATE POLICY "Authenticated users can insert analytics"
  ON public.subscription_analytics
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
