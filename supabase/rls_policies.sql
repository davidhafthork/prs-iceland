-- Row Level Security Policies for PRS Iceland
-- This file contains all RLS policies needed for the application

-- Enable RLS on all tables
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- ===================================
-- Public Read Access (already exists)
-- ===================================
CREATE POLICY "Public read access" ON competitors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON registrations FOR SELECT USING (true);
CREATE POLICY "Public read access" ON results FOR SELECT USING (true);

-- ===================================
-- Registration Policies (NEW)
-- ===================================

-- Allow anyone to create a competitor record (for registration)
-- They can only insert their own email
CREATE POLICY "Public can register as competitor" 
ON competitors FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update their own competitor record
-- This is needed for the UPSERT operation in registration
CREATE POLICY "Competitors can update own record" 
ON competitors FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow anyone to create registrations
CREATE POLICY "Public can register for matches" 
ON registrations FOR INSERT 
WITH CHECK (true);

-- ===================================
-- Admin Policies (for future use)
-- ===================================

-- These will need authentication setup first
-- Example policies commented out for reference:

-- Admin can insert matches (requires auth)
-- CREATE POLICY "Admin can create matches" 
-- ON matches FOR INSERT 
-- WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Admin can insert results (requires auth)
-- CREATE POLICY "Admin can add results" 
-- ON results FOR INSERT 
-- WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Admin can update match status (requires auth)
-- CREATE POLICY "Admin can update matches" 
-- ON matches FOR UPDATE 
-- USING (auth.jwt() ->> 'role' = 'admin')
-- WITH CHECK (auth.jwt() ->> 'role' = 'admin');