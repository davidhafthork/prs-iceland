-- PRS Iceland Database Schema
-- Simple and maintainable structure for competition management

-- Competitors table
CREATE TABLE competitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  division TEXT NOT NULL CHECK (division IN ('Open', 'Production', 'Tactical')),
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches/Tournaments table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 40,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
  UNIQUE(match_id, competitor_id)
);

-- Results table
CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  points DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, competitor_id)
);

-- Create indexes for performance
CREATE INDEX idx_registrations_match ON registrations(match_id);
CREATE INDEX idx_registrations_competitor ON registrations(competitor_id);
CREATE INDEX idx_results_match ON results(match_id);
CREATE INDEX idx_results_competitor ON results(competitor_id);

-- View for current standings
CREATE VIEW current_standings AS
WITH season_results AS (
  SELECT 
    c.id,
    c.name,
    c.division,
    c.city,
    r.points,
    r.percentage,
    m.date
  FROM competitors c
  JOIN results r ON c.id = r.competitor_id
  JOIN matches m ON r.match_id = m.id
  WHERE m.status = 'completed'
    AND m.date >= DATE_TRUNC('year', CURRENT_DATE)
),
competitor_stats AS (
  SELECT 
    id,
    name,
    division,
    city,
    SUM(points) as total_points,
    AVG(percentage) as avg_percentage,
    COUNT(*) as matches_completed
  FROM season_results
  GROUP BY id, name, division, city
)
SELECT 
  ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank,
  name,
  division,
  city,
  total_points as points,
  ROUND(avg_percentage, 2) || '%' as percentage,
  matches_completed
FROM competitor_stats
ORDER BY total_points DESC;

-- View for match registration counts
CREATE VIEW match_registration_stats AS
SELECT 
  m.id,
  m.name,
  m.date,
  m.location,
  m.capacity,
  m.status,
  COUNT(r.id) FILTER (WHERE r.status = 'confirmed') as registered,
  COUNT(r.id) FILTER (WHERE r.status = 'waitlist') as waitlisted,
  CASE 
    WHEN COUNT(r.id) FILTER (WHERE r.status = 'confirmed') >= m.capacity * 0.8 THEN 'filling'
    WHEN COUNT(r.id) FILTER (WHERE r.status = 'confirmed') >= m.capacity THEN 'full'
    ELSE 'open'
  END as registration_status
FROM matches m
LEFT JOIN registrations r ON m.id = r.match_id
GROUP BY m.id, m.name, m.date, m.location, m.capacity, m.status;