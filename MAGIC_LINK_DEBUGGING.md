# Magic Link Authentication Debugging Guide

## ✅ Migration to Supabase SSR Complete

The application has been successfully migrated from the deprecated `@supabase/auth-helpers-nextjs` to the new `@supabase/ssr` package.

### Key Changes Made:

1. **New Utility Functions Created:**
   - `src/lib/supabase/client.ts` - For client-side components
   - `src/lib/supabase/server.ts` - For server-side components
   - `src/lib/supabase/middleware.ts` - For middleware

2. **Updated Files:**
   - `middleware.ts` - Now uses SSR middleware with custom user validation
   - `src/app/(auth)/callback/route.ts` - Updated to use SSR server client
   - `src/app/(auth)/sign-in/page.tsx` - Updated to use SSR client
   - `src/app/api/sync-user/route.ts` - Updated to use SSR server client
   - `src/app/api/auth/sign-out/route.ts` - Updated to use SSR server client
   - `src/components/supabase-auth-provider.tsx` - Updated to use SSR client

3. **New Files:**
   - `src/app/auth/confirm/route.ts` - Auth confirmation handler for email templates

4. **Removed Files:**
   - `src/supabase/client.ts` - Replaced with SSR client
   - `src/supabase/server.ts` - Replaced with SSR server client

### Email Template Configuration Required

**IMPORTANT:** You need to update your Supabase email templates to support the new SSR flow:

1. Go to your Supabase dashboard
2. Navigate to Authentication > Email Templates
3. In the "Confirm signup" template, change:
   - From: `{{ .ConfirmationURL }}`
   - To: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

### Authentication Flow

The authentication flow remains the same:

1. User enters email on sign-in page
2. System checks if user exists in `users` table with status 'Active'
3. If valid, syncs user with auth system and sends magic link
4. User clicks magic link → redirects to `/callback`
5. Callback exchanges token for session and validates user
6. User is redirected to `/jobs` on success

### Testing Steps

1. **Verify Environment Variables:**
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

2. **Test Magic Link Flow:**
   - Visit `http://localhost:3000/sign-in`
   - Enter a valid email from your `users` table
   - Check email for magic link
   - Click the link and verify redirect to `/jobs`

3. **Check Server Logs:**
   - Monitor console for authentication flow logs
   - Verify user validation is working correctly

### Common Issues and Solutions

**Issue 1: "User not found in database"**
- Cause: User doesn't exist in the `users` table
- Solution: Add user to the `users` table with status 'Active'

**Issue 2: "User is disabled"**
- Cause: User exists but status is 'Disabled'
- Solution: Update user status to 'Active' in the `users` table

**Issue 3: "Authentication failed"**
- Cause: Token/code exchange failed
- Solution: Check Supabase configuration and ensure user exists in auth system

**Issue 4: "Access denied"**
- Cause: User not found in database after authentication
- Solution: Ensure user sync is working properly

### Magic Link Flow Summary

```
User enters email → Check users table → Sync with auth system → Send magic link → 
User clicks link → Callback handles token → Exchange for session → 
Check user exists → Verify status → Redirect to /jobs
```

The migration maintains all existing functionality while using the modern, supported Supabase SSR implementation. 