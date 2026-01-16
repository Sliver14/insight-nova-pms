# Signup Error Diagnostic Guide

## Changes Made

### 1. **Enhanced Error Logging**
Both signup routes now include comprehensive logging:
- `[SIGNUP]` prefix for general signup
- `[STAFF-SIGNUP]` prefix for staff signup
- Logs every step of the process
- Logs environment variable status
- Detailed error stack traces in development mode

### 2. **Environment Variable Validation**
- Added validation in `lib/supabase-server.ts`
- Throws clear error if Supabase credentials are missing
- Logs credential status on each request

### 3. **Improved Error Handling**
- Catches Prisma unique constraint violations
- Returns detailed errors in development mode
- Returns generic errors in production for security
- Handles both Supabase and Prisma errors separately

## Testing Steps

### Test 1: Check Server Logs
1. Run `npm run dev`
2. Watch the console output
3. Look for `[SUPABASE]` logs showing environment variable status
4. If you see "Missing environment variables", check your `.env` file

### Test 2: Test General Signup (Owner/Manager)
1. Navigate to `/auth?mode=signup`
2. Fill in the signup form:
   - Full Name: "Test Owner"
   - Email: "testowner@example.com"
   - Password: "test123456"
   - Role: "owner"
   - Hotel Name: "Test Hotel" (Step 2)
3. Complete all 3 steps
4. Check console logs for:
   ```
   [SIGNUP] Starting signup process...
   [SIGNUP] Request body: ...
   [SIGNUP] Creating Supabase client...
   [SIGNUP] Calling Supabase auth.signUp...
   [SIGNUP] Supabase user created: ...
   [SIGNUP] Creating hotel for owner: ...
   [SIGNUP] Hotel created: ...
   [SIGNUP] Creating Prisma user record...
   [SIGNUP] Prisma user created: ...
   ```

### Test 3: Test Staff Signup
**Prerequisites:** You need a hotel ID first

1. Sign up as owner (Test 2) to create a hotel
2. Get the hotel ID from database or from the staff signup URL
3. Navigate to `/auth/staff?h=YOUR_HOTEL_ID`
4. Fill in:
   - Full Name: "Test Staff"
   - Email: "teststaff@example.com"
   - Password: "test123456"
5. Submit and check console for:
   ```
   [STAFF-SIGNUP] Starting staff signup process...
   [STAFF-SIGNUP] Verifying hotel exists: ...
   [STAFF-SIGNUP] Hotel verified: ...
   [STAFF-SIGNUP] Calling Supabase auth.signUp...
   [STAFF-SIGNUP] Supabase user created: ...
   [STAFF-SIGNUP] Creating Prisma user record as staff...
   [STAFF-SIGNUP] Prisma user created: ...
   ```

### Test 4: Check Database
After successful signup, verify in your database:

**Supabase Dashboard -> Auth:**
- User should appear in `auth.users` table

**Supabase Dashboard -> Database -> public.User:**
- User record should exist with:
  - `supabase_auth_id` matching auth.users.id
  - Correct `role` (owner/manager/staff)
  - `is_approved` = true for owner/manager, false for staff
  - `hotel_id` populated correctly

**Supabase Dashboard -> Database -> public.Hotel:**
- Hotel record should exist (for owner signups)
- `owner_id` should match the user's id

## Common Errors and Solutions

### Error 1: "Missing Supabase environment variables"
**Symptom:** Logs show `[SUPABASE] Missing environment variables`
**Solution:**
1. Check `.env` file has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Restart dev server after changing `.env`

### Error 2: "Unique constraint failed"
**Symptom:** Error message about duplicate email or fullname
**Solution:**
- Email or fullname already exists
- Use a different email
- Or delete the existing user from database

### Error 3: "Invalid hotel"
**Symptom:** Staff signup fails with "Invalid hotel"
**Solution:**
- The hotel ID in the URL doesn't exist
- Sign up as owner first to create a hotel
- Get the correct hotel ID from the staff management page

### Error 4: Supabase signup succeeds but Prisma fails
**Symptom:** User created in auth.users but not in public.User
**Solution:**
1. Check Prisma schema matches database schema
2. Run `npx prisma db push` to sync
3. Check console logs for Prisma-specific errors
4. Verify all required fields are being provided

### Error 5: "Failed to create user" (no Supabase error)
**Symptom:** Supabase returns success but no user data
**Solution:**
- Email confirmation might be enabled in Supabase
- Go to Supabase Dashboard -> Auth -> Settings
- Disable "Enable email confirmations" for testing
- Or check the user's email for confirmation link

## Debug Mode

For maximum debugging, add this to your `.env`:
```
NODE_ENV=development
```

This will:
- Return full error messages to the client
- Include stack traces in API responses
- Show all console.log statements

## Manual API Testing with Postman

### Test General Signup
```
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123456",
  "fullname": "Test User",
  "role": "owner",
  "hotelName": "My Test Hotel"
}
```

### Test Staff Signup
```
POST http://localhost:3000/api/auth/staff-signup
Content-Type: application/json

{
  "email": "staff@example.com",
  "password": "test123456",
  "fullname": "Test Staff",
  "hotelId": "paste-hotel-uuid-here"
}
```

## Next Steps After Fixing

1. **Remove excessive logging** - Once working, remove console.logs
2. **Add rate limiting** - Prevent signup spam
3. **Email verification** - Enable in Supabase for production
4. **Password strength** - Add frontend validation
5. **CAPTCHA** - Add to prevent bots

## Contact Points

If errors persist, check these specific areas:

1. **Supabase Connection**: `lib/supabase-server.ts` line 7-15
2. **User Creation**: `app/api/auth/signup/route.ts` line 85-96
3. **Hotel Creation**: `app/api/auth/signup/route.ts` line 68-82
4. **Staff Validation**: `app/api/auth/staff-signup/route.ts` line 22-35
5. **Error Handling**: Both routes at the catch blocks

All errors now include detailed stack traces in development mode for easier debugging.
