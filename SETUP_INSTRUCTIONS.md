# Data Fetching Issues - Setup Instructions

## Issues Found & Fixed

1. **Missing API Routes** ✅ FIXED
   - Created `/api/carriers.ts` - fetches carrier data from Supabase
   - Created `/api/incidents.ts` - fetches incident data from Supabase
   - Updated `/api/shipments.ts` - now queries Supabase instead of returning empty array

2. **Missing Database Tables** ⚠️ NEEDS ACTION
   - Created SQL migration files in `database/` folder:
     - `001_shipments.sql`
     - `002_goods.sql`
     - `003_carriers.sql`
     - `004_incidents.sql`
     - `005_staff_users.sql`

## What You Need to Do

### Step 1: Create Database Tables in Supabase

Option A (Recommended - Manual):
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `vgypehtcuupctiavnniv`
3. Go to SQL Editor
4. Create a new query
5. Copy and paste the contents of `database/001_shipments.sql` and run it
6. Repeat for files 002-005

Option B (Automated):
Run the migration script (note: requires special Supabase setup):
```bash
cd /path/to/shipwise
npm run migrate
```

### Step 2: Run the Frontend Dev Server

```bash
cd frontend-web
npm run dev
```

The frontend will now be able to:
- Sign in with Supabase authentication
- Fetch shipments, carriers, and incidents data from the API routes

## Remaining Issues

### Supabase Auth 406 Error
The `staff_users` table fetch is returning a 406 error. After creating the table with the migrations above, you can:
1. Add a user to the `staff_users` table after signing up
2. Or disable the staff_users query during sign in if it's not required yet

Edit `frontend-web/contexts/AuthContext.tsx` line 43-50 to comment out the staff_users fetch if needed:
```typescript
// if (session?.user) {
//   const { data } = await supabase
//     .from("staff_users")
//     .select("*")
//     .eq("user_id", session.user.id)
//     .single();
//   if (data) {
//     setStaffUser(data as StaffUser);
//   }
// }
```

## Environment Variables ✅

Both frontend and backend are properly configured with Supabase credentials in `.env.local`
