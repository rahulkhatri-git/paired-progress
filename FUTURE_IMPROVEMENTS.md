# Future Improvements & Ideas

## High Priority

### Email Invitations
**Current:** Users manually share invite codes/links
**Better:** Send email directly to partner with invite link

**Implementation:**
- Use Supabase Edge Functions or Resend/SendGrid
- Email template with branded design
- One-click accept button in email
- Track email open/click rates
- Resend option if email not opened

**Benefits:**
- Less friction (no copy/paste)
- More professional feel
- Better tracking
- Automatic reminder emails possible

---

## Medium Priority

### Push Notifications
- Web push for habit reminders
- Partner activity notifications
- Daily streak reminders
- Review request alerts

### Nudge System
- Send friendly nudges to partner
- Auto-nudge if partner inactive for X days
- Customizable nudge messages
- Rate limiting to prevent spam

### Advanced Analytics
- Habit completion trends over time
- Best/worst performing habits
- Streak calendar visualization
- Monthly/yearly reports

### Social Features
- Share achievements to social media
- Public profile pages (optional)
- Leaderboards (with permission)
- Community challenges

---

## Low Priority

### Multi-timezone Support
- Display times in partner's timezone
- Adjust "today" based on timezone
- Coordination for global partners

### Habit Templates
- Pre-built habit templates
- Community-shared templates
- Import/export habits

### Integrations
- Apple Health / Google Fit sync
- Strava integration
- MyFitnessPal integration
- Calendar sync (Google/Apple)

### Gamification
- Badges & achievements
- Level system
- Unlockable themes
- Power-ups for streaks

---

## Technical Debt

### Performance
- Implement Redis caching
- Optimize database queries
- Add CDN for images
- Lazy load images

### Testing
- Increase E2E test coverage
- Add integration tests
- Unit tests for hooks
- Performance testing

### Monitoring
- Error tracking (Sentry)
- Analytics (PostHog/Mixpanel)
- Performance monitoring
- User session replays

---

**Note:** These are ideas for future iterations. Focus remains on completing Phase 2 core features first.
