-- Add email templates for partner invitations
-- This uses Supabase's notification system

-- Create a function to send invitation emails
CREATE OR REPLACE FUNCTION send_partner_invitation_email(
  p_inviter_name TEXT,
  p_invitee_email TEXT,
  p_invite_code TEXT,
  p_invite_url TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into a notifications/emails table or use Supabase's email service
  -- For now, we'll rely on application-level email sending
  -- This function is a placeholder for database-triggered emails
  
  -- You can also use pg_notify for real-time notifications:
  PERFORM pg_notify(
    'partner_invitation',
    json_build_object(
      'inviter_name', p_inviter_name,
      'invitee_email', p_invitee_email,
      'invite_code', p_invite_code,
      'invite_url', p_invite_url
    )::text
  );
END;
$$;
