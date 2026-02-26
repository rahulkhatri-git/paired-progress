# Delete Account Edge Function

This Edge Function handles account deletion securely with proper authentication.

## Setup

1. Deploy the function:
```bash
supabase functions deploy delete-account
```

2. Set required secrets (if not already set):
```bash
supabase secrets set SUPABASE_URL=your-project-url
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## What it does

1. Verifies the user is authenticated (checks JWT token)
2. Deletes the user's profile from the database (cascades to all related data)
3. Deletes the user's auth account using admin privileges
4. Returns success/error response

## Security

- Requires valid authentication token
- User can only delete their own account
- Uses service role key for auth deletion (not exposed to client)
- All related data is deleted via CASCADE constraints

## Usage from client

```typescript
const { data, error } = await supabase.functions.invoke('delete-account', {
  headers: {
    Authorization: `Bearer ${session.access_token}`
  }
})
```
