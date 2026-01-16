# Testing Authentication Fixes

## Overview
This guide helps you test and debug the authentication fixes, specifically:
1. Login without "Account not found" error
2. Dashboard displaying actual user name and hotel name
3. Staff signup URL generation working properly

## Pre-Testing Checklist

### 1. Stop and Restart Development Server
```powershell
# Stop current dev server (Ctrl+C)
# Then restart
npm run dev
```

### 2. Clear Browser Data
- Open DevTools (F12)
- Go to Application tab → Storage → Clear site data
- This ensures no stale auth cookies

### 3. Verify Database User Exists
Check your Supabase/Prisma database:
- User should have `supabase_auth_id` matching Supabase Auth
- User should have `hotel_id` set (if not super_admin)
- Hotel with that `hotel_id` should exist

---

## Test 1: Login Flow (Most Important)

### Steps:
1. Open browser DevTools Console (F12)
2. Navigate to `/auth`
3. Enter valid credentials
4. Click "Sign In"

### Expected Console Logs (in order):
```
[useAuth] Starting login for: your@email.com
[LOGIN] Starting login process...
[LOGIN] Login attempt for email: your@email.com
[LOGIN] Authenticating with Supabase...
[LOGIN] Supabase authentication successful: <user_id>
[LOGIN] Looking up user in database...
[LOGIN] User found in database: <user_id>
[LOGIN] User approved, updating last login...
[LOGIN] Login successful for user: <username>
[useAuth] Login API successful, session data: { user_id: ..., hotel_id: ... }
[useAuth] Refreshing browser Supabase client session...
[useAuth] Browser client session confirmed: <user_id>
[useAuth] Fetching enriched profile...
[USER-PROFILE] Fetching enriched user profile...
[USER-PROFILE] Session found for user: <user_id>
[USER-PROFILE] Successfully fetched profile for: <username>
[USER-PROFILE] Hotel: <hotel_name>
[useAuth] Profile data received: { user: ..., hotel: ... }
[useAuth] User: <username>
[useAuth] Hotel: <hotel_name>
[useAuth] Hotel ID: <hotel_id>
[useAuth] Auth state fully synchronized, redirecting...
```

### What to Check:
✅ **NO "Account not found" toast/error**
✅ **Immediate redirect to dashboard (no refresh needed)**
✅ **All console logs appear in correct order**
✅ **Hotel name and hotel_id appear in logs**

### If You See Errors:

#### Error: "Account not found"
**Cause**: User exists in Supabase Auth but not in Prisma database
**Fix**:
1. Check Supabase Auth dashboard for user's ID
2. Check Prisma database - does user with that `supabase_auth_id` exist?
3. If not, create user via signup flow or manually add to database

#### Error: "Session not established"
**Cause**: Browser client can't pick up server-set cookies
**Fix**:
1. Check if cookies are being set (DevTools → Application → Cookies)
2. Look for cookies starting with `sb-` 
3. If missing, check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env

#### Error: "User profile not found" (404 from /api/user-profile)
**Cause**: User doesn't exist in database
**Fix**: Same as "Account not found" above

---

## Test 2: Dashboard Display

### Steps:
1. After successful login, observe dashboard
2. Check browser console

### Expected Console Logs:
```
[DASHBOARD] Render - authLoading: false authReady: true
[DASHBOARD] User: { id: ..., username: "...", hotel_id: "...", ... }
[DASHBOARD] Hotel: { id: "...", name: "...", address: "...", room_count: ... }
[DASHBOARD] Display - userName: <your username> hotelName: <your hotel name>
```

### What to Check:
✅ **Header shows: "Welcome back, [YOUR ACTUAL USERNAME]!"**
✅ **Subtitle shows: "[YOUR ACTUAL HOTEL NAME] - Overview of your hotel performance"**
✅ **NOT showing: "Welcome back, User!" or "Your Hotel"**

### If You See Fallback Values:

#### Showing "User" instead of username
**Cause**: `user` object is null or doesn't have `username`
**Check Console**:
- Look for `[DASHBOARD] User:` log
- If null, auth state didn't load properly
- If object exists but no `username`, check database

**Fix**:
1. Check `[useAuth]` logs - was profile fetched?
2. Check `/api/user-profile` returns user with username
3. Verify database user has `username` field populated

#### Showing "Your Hotel" instead of hotel name
**Cause**: `hotel` object is null or user has no hotel_id
**Check Console**:
- Look for `[DASHBOARD] Hotel:` log
- If null, check if user has `hotel_id` in database
- If user has `hotel_id` but hotel is null, hotel doesn't exist

**Fix**:
1. Verify user has `hotel_id` set in database
2. Verify hotel with that ID exists in Hotel table
3. Check `/api/user-profile` includes hotel in response
4. Check `[USER-PROFILE] Hotel:` log for hotel name

---

## Test 3: Staff Signup URL

### Steps:
1. Navigate to `/dashboard/staff`
2. Click "Copy Staff Signup URL" button
3. Check browser console

### Expected Console Logs:
```
[STAFF] User data: { id: ..., hotel_id: "...", ... }
[STAFF] User hotel_id: <hotel_id>
[STAFF] Setting hotel_id: <hotel_id>
[STAFF] Copy URL clicked. HotelId: <hotel_id> User: { ... }
```

### What to Check:
✅ **Toast says: "Copied! Staff signup URL copied to clipboard"**
✅ **NOT showing: "Error - Hotel ID not found"**
✅ **URL in clipboard: `http://localhost:3000/auth/staff-signup?hotelId=<uuid>`**

### If You See Error:

#### Error: "Hotel ID not found"
**Cause**: `user.hotel_id` is null or undefined
**Check Console**:
- Look for `[STAFF] User hotel_id:` log
- If shows "undefined" or "null", user has no hotel_id

**Fix**:
1. Check if logged-in user has `hotel_id` in database
2. Only owner/admin/manager roles typically have hotel_id
3. Super_admin users don't have hotel_id (this is expected)
4. Verify `[useAuth]` logs show hotel_id when profile is fetched

---

## Common Issues and Solutions

### Issue: Everything works after refresh but not on initial login

**Root Cause**: Client-side Supabase session not syncing with server cookies

**Solution Applied**: 
- `useAuth.signIn()` now explicitly calls `supabase.auth.getSession()` 
- Waits for browser client to pick up cookies
- Retries once if first attempt fails

**Verify Fix**:
- Check console logs show "Browser client session confirmed"
- This should appear BEFORE redirect

### Issue: Profile API returns 404

**Root Cause**: User not in Prisma database

**Solutions**:
1. **Check Supabase Auth**: Does user exist there?
2. **Check Prisma DB**: Run this query:
   ```sql
   SELECT * FROM "User" WHERE supabase_auth_id = '<your-supabase-user-id>';
   ```
3. **If missing**: User was created in Supabase but not synced to Prisma
4. **Fix**: Manually create user in Prisma with correct `supabase_auth_id`

### Issue: Hotel name showing but user name not showing

**Root Cause**: User record missing `username` field

**Solution**:
```sql
UPDATE "User" 
SET username = 'YourDesiredUsername' 
WHERE id = '<user-id>';
```

---

## Debugging Checklist

Use this checklist when something isn't working:

### Server Logs (Terminal)
- [ ] `[LOGIN]` logs show successful authentication
- [ ] `[LOGIN]` logs show user found in database
- [ ] `[USER-PROFILE]` logs show profile fetched
- [ ] `[USER-PROFILE]` logs show hotel name
- [ ] `[SESSION]` logs show session found

### Browser Console
- [ ] `[useAuth]` logs show complete login flow
- [ ] `[useAuth]` logs show browser session confirmed
- [ ] `[useAuth]` logs show profile data received
- [ ] `[useAuth]` logs show hotel name
- [ ] `[DASHBOARD]` logs show user and hotel objects
- [ ] No error messages in console

### Network Tab (DevTools)
- [ ] `/api/auth/login` returns 200 with user data
- [ ] `/api/user-profile` returns 200 with user + hotel
- [ ] `/api/auth/session` returns 200 (if called)

### Cookies (DevTools → Application → Cookies)
- [ ] Cookies starting with `sb-` exist
- [ ] Cookies have valid expiration dates
- [ ] Cookies are for correct domain

### Database
- [ ] User exists with correct `supabase_auth_id`
- [ ] User has `username` populated
- [ ] User has `hotel_id` populated (if applicable)
- [ ] Hotel exists with matching `hotel_id`
- [ ] Hotel has `name` populated

---

## Success Criteria

✅ **Authentication Flow**:
- Login works without refresh
- No "Account not found" error
- Immediate redirect to dashboard
- All console logs present and correct

✅ **Dashboard Display**:
- Shows actual username (not "User")
- Shows actual hotel name (not "Your Hotel")
- TopBar shows correct hotel name
- All data visible without refresh

✅ **Staff Management**:
- Copy URL button works
- No "Hotel ID not found" error
- URL contains valid hotel_id UUID

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Remove or comment out console.log statements for production
2. Test with multiple user accounts
3. Test with different roles (owner, manager, staff)
4. Test logout and re-login flow

### If Tests Fail ❌
1. Note which specific test failed
2. Check the relevant console logs
3. Review the "Common Issues" section
4. Check database for missing/incorrect data
5. Verify environment variables are correct

---

## Support

If you're still experiencing issues after following this guide:

1. **Copy all console logs** from browser and terminal
2. **Copy the exact error message** you're seeing
3. **Note which test step failed**
4. **Check database state** for the user in question

Include all this information when seeking help.

---

**Last Updated**: 2025-12-31
**Version**: 2.0
