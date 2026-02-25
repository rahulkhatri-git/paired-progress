import { NextRequest, NextResponse } from 'next/server'
import { sendPartnerInviteEmail } from '@/lib/email/send-invite'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { inviterName, inviteeEmail, inviteCode, inviteUrl } = body

    if (!inviteeEmail || !inviteCode || !inviteUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await sendPartnerInviteEmail({
      inviterName: inviterName || 'Someone',
      inviteeEmail,
      inviteCode,
      inviteUrl,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending invite email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
