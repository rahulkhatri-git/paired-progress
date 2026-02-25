// Email service using Resend (recommended)
// Install: npm install resend

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPartnerInviteEmail({
  inviterName,
  inviteeEmail,
  inviteCode,
  inviteUrl,
}: {
  inviterName: string
  inviteeEmail: string
  inviteCode: string
  inviteUrl: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Paired Progress <noreply@pairedprogress.app>',
      to: inviteeEmail,
      subject: `${inviterName} invited you to be accountability partners!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Partner Invitation</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0ea5e9; margin: 0;">Paired Progress</h1>
              <p style="color: #64748b; margin: 5px 0 0 0;">Build Better Habits Together</p>
            </div>

            <!-- Main Content -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #1e293b;">You've been invited! 🎉</h2>
              
              <p style="font-size: 16px; color: #475569;">
                <strong>${inviterName}</strong> wants you to be their accountability partner on Paired Progress.
              </p>

              <p style="color: #64748b;">
                Accountability partners help each other build better habits, stay motivated, and celebrate wins together.
              </p>

              <!-- Invite Code Box -->
              <div style="background: white; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Your Invite Code</p>
                <p style="margin: 0; font-size: 32px; font-weight: bold; color: #0ea5e9; letter-spacing: 3px;">${inviteCode}</p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteUrl}" style="display: inline-block; background: #0ea5e9; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Accept Invitation
                </a>
              </div>

              <p style="font-size: 14px; color: #64748b; text-align: center;">
                Or copy and paste this link: <br>
                <a href="${inviteUrl}" style="color: #0ea5e9; word-break: break-all;">${inviteUrl}</a>
              </p>
            </div>

            <!-- How it Works -->
            <div style="margin: 30px 0;">
              <h3 style="color: #1e293b; font-size: 18px;">How it works:</h3>
              <ol style="color: #475569; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Create an account (or log in if you already have one)</li>
                <li style="margin-bottom: 10px;">Enter the invite code or click the link above</li>
                <li style="margin-bottom: 10px;">Start building habits together!</li>
              </ol>
            </div>

            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 13px;">
              <p>This invitation expires in 7 days.</p>
              <p>Didn't expect this email? You can safely ignore it.</p>
              <p style="margin-top: 20px;">
                <a href="https://pairedprogress.app" style="color: #0ea5e9; text-decoration: none;">Paired Progress</a> • 
                Building habits, together
              </p>
            </div>

          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email sending error:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send invitation email:', error)
    throw error
  }
}
