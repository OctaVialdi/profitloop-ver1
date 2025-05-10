
// This file contains SQL helpers for reference when adding required tables

/**
 * SQL to create magic_link_invitations table:
 * 
 * ```sql
 * CREATE TABLE IF NOT EXISTS public.magic_link_invitations (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   organization_id UUID NOT NULL REFERENCES public.organizations(id),
 *   email TEXT NOT NULL,
 *   token TEXT NOT NULL,
 *   role TEXT NOT NULL DEFAULT 'employee',
 *   status TEXT NOT NULL DEFAULT 'pending',
 *   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 *   expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
 *   used_at TIMESTAMPTZ
 * );
 * 
 * -- Create process_magic_link_invitation function
 * CREATE OR REPLACE FUNCTION public.process_magic_link_invitation(
 *   invitation_token TEXT,
 *   user_id UUID
 * ) RETURNS JSONB 
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   invitation RECORD;
 *   result JSONB;
 * BEGIN
 *   -- Find the invitation
 *   SELECT * INTO invitation
 *   FROM public.magic_link_invitations
 *   WHERE token = invitation_token
 *   AND status = 'pending'
 *   AND expires_at > now();
 *   
 *   -- Check if invitation exists and is valid
 *   IF invitation IS NULL THEN
 *     RETURN jsonb_build_object(
 *       'success', false,
 *       'message', 'Invalid or expired invitation token'
 *     );
 *   END IF;
 *   
 *   -- Update user profile with organization_id and role
 *   UPDATE public.profiles
 *   SET 
 *     organization_id = invitation.organization_id,
 *     role = invitation.role
 *   WHERE id = user_id;
 *   
 *   -- Mark invitation as used
 *   UPDATE public.magic_link_invitations
 *   SET 
 *     status = 'accepted',
 *     used_at = now()
 *   WHERE id = invitation.id;
 *   
 *   -- Return success result with organization info
 *   RETURN jsonb_build_object(
 *     'success', true,
 *     'message', 'Successfully joined organization',
 *     'organization_id', invitation.organization_id,
 *     'role', invitation.role
 *   );
 * END;
 * $$;
 * 
 * -- Create validate_invitation function
 * CREATE OR REPLACE FUNCTION public.validate_invitation(
 *   invitation_token TEXT,
 *   invitee_email TEXT
 * ) RETURNS TABLE(valid BOOLEAN, message TEXT, organization_id UUID, role TEXT) 
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * BEGIN
 *   RETURN QUERY
 *   SELECT
 *     CASE
 *       WHEN i.email != validate_invitation.invitee_email AND validate_invitation.invitee_email != '' THEN FALSE
 *       WHEN i.status = 'accepted' THEN FALSE
 *       WHEN i.expires_at < NOW() THEN FALSE
 *       ELSE TRUE
 *     END AS valid,
 *     CASE
 *       WHEN i.email != validate_invitation.invitee_email AND validate_invitation.invitee_email != '' THEN 'Email tidak sesuai.'
 *       WHEN i.status = 'accepted' THEN 'Undangan sudah digunakan.'
 *       WHEN i.expires_at < NOW() THEN 'Undangan kadaluarsa.'
 *       ELSE 'Valid'
 *     END AS message,
 *     i.organization_id,
 *     COALESCE(i.role, 'employee') AS role
 *   FROM public.magic_link_invitations i
 *   WHERE i.token = invitation_token;
 * END;
 * $$;
 * ```
 */

export const createMagicLinkInvitationsSQL = `-- For reference only, do not execute manually
-- Use Supabase SQL editor to run these commands if the tables don't exist`;
