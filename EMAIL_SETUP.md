# Email Setup Instructions

## Option 1: Resend (Recommended - Free tier available)

### 1. Sign up for Resend
- Go to https://resend.com
- Create a free account
- Verify your domain (or use their test domain for development)

### 2. Get API Key
- Go to API Keys section
- Create a new API key
- Copy the key

### 3. Add to Environment Variables
```bash
# Add to .env.local
RESEND_API_KEY=re_your_api_key_here
```

### 4. Install Resend
```bash
npm install resend
```

### 5. Test
- Send an invite with an email
- Check the recipient's inbox (including spam folder)

## Option 2: SendGrid

```bash
npm install @sendgrid/mail
```

Add to `.env.local`:
```bash
SENDGRID_API_KEY=your_sendgrid_key_here
```

Update `lib/email/send-invite.ts` to use SendGrid instead of Resend.

## Option 3: Simple SMTP (Gmail, etc.)

```bash
npm install nodemailer
```

Use nodemailer with your Gmail/SMTP credentials (less reliable, not recommended for production).

## Development Mode (No Email)

If you don't want to set up email yet:
- The invitation will still be created
- You'll just get the code to share manually
- The toast will say "Email sending failed, share the code manually"

## Production Checklist

- [ ] Domain verified in Resend
- [ ] Update `from` email in `lib/email/send-invite.ts`
- [ ] Test with real email addresses
- [ ] Check spam folder delivery
- [ ] Set up SPF/DKIM records for better delivery

## Cost

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day
- More than enough for MVP

**Upgrade if needed:**
- $20/month for 50,000 emails
