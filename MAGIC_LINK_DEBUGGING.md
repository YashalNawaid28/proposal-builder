# Magic Link Authentication Debugging Guide

## Issues Identified and Fixed

### 1. ✅ Fixed: Token vs Code Parameter Mismatch
**Problem**: The magic link you received uses a `token` parameter, but the callback route was only looking for a `code` parameter.

**Solution**: Updated `src/app/(auth)/callback/route.ts` to handle both `code` and `token` parameters:

```typescript
const code = requestUrl.searchParams.get("code");
const token = requestUrl.searchParams.get("token");
const authCode = code || token;
```

### 2. ⚠️ Potential Issue: Supabase Auth Helpers Version
**Problem**: Using `@supabase/auth-helpers-nextjs` version `0.10.0`, which is quite old.

**Recommendation**: Consider upgrading to the latest version:
```bash
npm install @supabase/auth-helpers-nextjs@latest
```

### 3. ✅ Working: Magic Link Configuration
The current setup is correct:
- `shouldCreateUser: false` - Prevents creating new users
- `emailRedirectTo: 'http://localhost:3000/callback'` - Correct redirect URL

## Testing Steps

### Step 1: Verify User Exists in Database
1. Go to your Supabase dashboard
2. Check the `users` table
3. Ensure the user email exists and status is 'Active'

### Step 2: Test Magic Link Flow
1. Visit `http://localhost:3000/sign-in`
2. Enter a valid email that exists in your `users` table
3. Check browser console for any errors
4. Check server logs for detailed error messages

### Step 3: Check Magic Link URL
The magic link should look like:
```
https://bqobctrcfgearocxjhxr.supabase.co/auth/v1/verify?token=TOKEN&type=magiclink&redirect_to=http://localhost:3000/callback
```

### Step 4: Verify Callback Handling
When you click the magic link, it should:
1. Redirect to `http://localhost:3000/callback`
2. Exchange the token for a session
3. Check user exists in database
4. Verify user status is 'Active'
5. Redirect to `/jobs` on success

## Debugging Commands

### Check Server Logs
```bash
# In your terminal where npm run dev is running
# Look for console.log messages from:
# - "Callback - URL params:"
# - "Callback - Exchanging auth code for session"
# - "Callback - Session user email:"
# - "Callback - User lookup result:"
```

### Test API Endpoints
```bash
# Test sync-user API
curl -X POST http://localhost:3000/api/sync-user \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

### Check Environment Variables
```bash
# Verify all required env vars are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
echo $SUPABASE_SERVICE_ROLE_KEY
echo $NEXT_PUBLIC_SITE_URL
```

## Common Issues and Solutions

### Issue 1: "User not found in database"
**Cause**: User doesn't exist in the `users` table
**Solution**: Add user to the `users` table with status 'Active'

### Issue 2: "User is disabled"
**Cause**: User exists but status is 'Disabled'
**Solution**: Update user status to 'Active' in the `users` table

### Issue 3: "Authentication failed"
**Cause**: Token/code exchange failed
**Solution**: Check Supabase configuration and ensure user exists in auth system

### Issue 4: "Access denied"
**Cause**: User not found in database after authentication
**Solution**: Ensure user sync is working properly

## Updated Files

1. **`src/app/(auth)/callback/route.ts`** - Now handles both `code` and `token` parameters
2. **`src/app/api/sync-user/route.ts`** - Added better logging for debugging

## Next Steps

1. **Test the updated callback route** with your magic link
2. **Check browser console** for any JavaScript errors
3. **Monitor server logs** for detailed error messages
4. **Verify user exists** in both auth system and database
5. **Consider upgrading** Supabase auth helpers if issues persist

## Magic Link Flow Summary

```
User enters email → Check users table → Sync with auth system → Send magic link → 
User clicks link → Callback handles token → Exchange for session → 
Check user exists → Verify status → Redirect to /jobs
```

The main fix was updating the callback route to handle the `token` parameter that your magic links are using instead of `code`. 