# Quick Fix for Registration RLS Error

The registration form is getting a Row Level Security error because the database only has READ policies, not INSERT policies. 

## To fix this immediately:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Run this SQL to add the missing policies:

```sql
-- Allow public to create competitor records (for registration)
CREATE POLICY "Public can register as competitor" 
ON competitors FOR INSERT 
WITH CHECK (true);

-- Allow updating competitor records (needed for UPSERT)
CREATE POLICY "Competitors can update own record" 
ON competitors FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow public to create registrations
CREATE POLICY "Public can register for matches" 
ON registrations FOR INSERT 
WITH CHECK (true);
```

## Alternative: Disable RLS temporarily (for development only)

If you want to disable RLS during development:

```sql
ALTER TABLE competitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
```

**Warning:** Only disable RLS in development. Production should always have proper RLS policies.

## Long-term solution

The full RLS policy setup is in `/supabase/rls_policies.sql`. This includes:
- Public read access (already exists)
- Public registration access (fixes current issue)
- Admin policies (for future authenticated admin features)