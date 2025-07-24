-- Disable RLS on scoring tables for development
-- These tables need write access from the frontend during testing

ALTER TABLE match_stages DISABLE ROW LEVEL SECURITY;
ALTER TABLE stage_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE score_corrections DISABLE ROW LEVEL SECURITY;
ALTER TABLE squad_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE stage_ros DISABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_equipment DISABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status DISABLE ROW LEVEL SECURITY;