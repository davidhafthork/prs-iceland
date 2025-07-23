-- Complete RLS Policies Fix for Edit/Delete Operations
-- Run this after the main rls_policies.sql file
-- This enables all edit/delete operations that were missing

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow match updates" ON matches;
DROP POLICY IF EXISTS "Allow match deletion" ON matches;
DROP POLICY IF EXISTS "Allow registration deletion" ON registrations;
DROP POLICY IF EXISTS "Allow registration status updates" ON registrations;
DROP POLICY IF EXISTS "Allow results deletion" ON results;
DROP POLICY IF EXISTS "Allow results updates" ON results;
DROP POLICY IF EXISTS "Allow competitor updates" ON competitors;
DROP POLICY IF EXISTS "Allow competitor deletion" ON competitors;

-- ===================================
-- Match Management Policies
-- ===================================

-- Allow updating matches (temporary - should require auth in production)
CREATE POLICY "Allow match updates" 
ON matches FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow deletion of matches (temporary - should require auth in production)
CREATE POLICY "Allow match deletion" 
ON matches FOR DELETE 
USING (true);

-- ===================================
-- Registration Management Policies
-- ===================================

-- Allow deletion of registrations (temporary - should require auth in production)
CREATE POLICY "Allow registration deletion" 
ON registrations FOR DELETE 
USING (true);

-- Allow updating registration status (temporary - should require auth in production)
CREATE POLICY "Allow registration status updates" 
ON registrations FOR UPDATE 
USING (true)
WITH CHECK (true);

-- ===================================
-- Results Management Policies
-- ===================================

-- Allow deletion of results (temporary - should require auth in production)
CREATE POLICY "Allow results deletion" 
ON results FOR DELETE 
USING (true);

-- Allow updating results (temporary - should require auth in production)
CREATE POLICY "Allow results updates" 
ON results FOR UPDATE 
USING (true)
WITH CHECK (true);

-- ===================================
-- Competitor Management Policies
-- ===================================

-- Allow updating competitors (temporary - should require auth in production)
CREATE POLICY "Allow competitor updates" 
ON competitors FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow deletion of competitors (temporary - should require auth in production)
CREATE POLICY "Allow competitor deletion" 
ON competitors FOR DELETE 
USING (true);

-- ===================================
-- IMPORTANT NOTES:
-- ===================================
-- 1. These policies are TEMPORARY and allow anyone to perform these operations
-- 2. In production with authentication, replace all instances of:
--    USING (true) 
--    WITH:
--    USING (auth.jwt() ->> 'role' = 'admin')
--    
--    And replace:
--    WITH CHECK (true)
--    WITH:
--    WITH CHECK (auth.jwt() ->> 'role' = 'admin')