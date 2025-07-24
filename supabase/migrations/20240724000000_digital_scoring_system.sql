-- PRS Iceland Digital Scoring System Schema
-- Enhanced schema for stage-by-stage scoring with full data provenance
-- Designed for offline-first, mobile-first usage with complete audit trails

-- ============================================
-- STAGE CONFIGURATION
-- ============================================

-- Match stages define the structure of each competition
CREATE TABLE match_stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  stage_number INTEGER NOT NULL,
  stage_name TEXT NOT NULL,
  target_count INTEGER NOT NULL,
  par_time INTEGER NOT NULL, -- in seconds
  max_points INTEGER NOT NULL DEFAULT 100,
  scoring_type TEXT NOT NULL DEFAULT 'hit_miss' CHECK (scoring_type IN ('hit_miss', 'time_plus', 'points')),
  stage_brief TEXT, -- RO instructions
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL, -- admin who created
  UNIQUE(match_id, stage_number)
);

-- ============================================
-- SCORING WITH FULL PROVENANCE
-- ============================================

-- Stage scores with complete data transparency
CREATE TABLE stage_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  stage_id UUID REFERENCES match_stages(id) ON DELETE CASCADE NOT NULL,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE NOT NULL,
  
  -- Score data
  hits INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  time_seconds DECIMAL(5,2), -- optional, for time-based scoring
  penalties INTEGER NOT NULL DEFAULT 0,
  dnf BOOLEAN DEFAULT FALSE, -- did not finish
  dq BOOLEAN DEFAULT FALSE, -- disqualified
  
  -- Calculated fields
  raw_points DECIMAL(5,2) NOT NULL DEFAULT 0,
  stage_points DECIMAL(5,2) NOT NULL DEFAULT 0, -- after penalties
  stage_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  
  -- Data provenance fields (critical for dispute resolution)
  entered_by TEXT NOT NULL, -- name of person who entered
  entered_by_role TEXT NOT NULL CHECK (entered_by_role IN ('RO', 'competitor', 'admin', 'scorer')),
  entry_method TEXT NOT NULL CHECK (entry_method IN ('live', 'batch', 'paper_transfer', 'correction')),
  entry_device_id TEXT, -- unique device identifier
  entry_location TEXT, -- GPS or range name
  paper_card_ref TEXT, -- reference to paper scorecard if applicable
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ, -- when synced to server
  
  -- Sync status
  is_synced BOOLEAN DEFAULT FALSE,
  sync_conflict BOOLEAN DEFAULT FALSE,
  sync_conflict_data JSONB, -- store conflicting versions
  
  -- Notes
  notes TEXT, -- for any special circumstances
  
  UNIQUE(match_id, stage_id, competitor_id)
);

-- ============================================
-- SCORE CORRECTIONS AUDIT TRAIL
-- ============================================

-- Track all score changes for complete transparency
CREATE TABLE score_corrections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_score_id UUID REFERENCES stage_scores(id) ON DELETE CASCADE NOT NULL,
  
  -- What changed
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  
  -- Why it changed
  reason TEXT NOT NULL,
  corrected_by TEXT NOT NULL,
  corrected_by_role TEXT NOT NULL CHECK (corrected_by_role IN ('RO', 'admin', 'match_director')),
  
  -- When it changed
  corrected_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Supporting evidence
  evidence_type TEXT CHECK (evidence_type IN ('video', 'witness', 'paper_card', 'ro_verification')),
  evidence_ref TEXT -- URL or reference to evidence
);

-- ============================================
-- SQUAD MANAGEMENT
-- ============================================

-- Squad assignments for rotation management
CREATE TABLE squad_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE NOT NULL,
  squad_number INTEGER NOT NULL,
  squad_position INTEGER, -- shooting order within squad
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, competitor_id)
);

-- ============================================
-- RANGE OFFICER ASSIGNMENTS
-- ============================================

-- Track which RO is running each stage
CREATE TABLE stage_ros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  stage_id UUID REFERENCES match_stages(id) ON DELETE CASCADE NOT NULL,
  ro_name TEXT NOT NULL,
  ro_email TEXT,
  ro_phone TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, stage_id)
);

-- ============================================
-- EQUIPMENT TRACKING
-- ============================================

-- Track competitor equipment for statistics
CREATE TABLE competitor_equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE NOT NULL,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  
  -- Rifle details
  rifle_caliber TEXT,
  rifle_make TEXT,
  rifle_model TEXT,
  
  -- Optics
  scope_make TEXT,
  scope_model TEXT,
  
  -- Other
  bipod TEXT,
  rear_bag TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competitor_id, match_id)
);

-- ============================================
-- SYNC TRACKING
-- ============================================

-- Track device sync status
CREATE TABLE sync_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  device_name TEXT,
  last_sync_at TIMESTAMPTZ,
  pending_uploads INTEGER DEFAULT 0,
  sync_errors INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_stage_scores_match ON stage_scores(match_id);
CREATE INDEX idx_stage_scores_competitor ON stage_scores(competitor_id);
CREATE INDEX idx_stage_scores_stage ON stage_scores(stage_id);
CREATE INDEX idx_stage_scores_sync ON stage_scores(is_synced, created_at);
CREATE INDEX idx_match_stages_match ON match_stages(match_id);
CREATE INDEX idx_squad_assignments_match ON squad_assignments(match_id);
CREATE INDEX idx_score_corrections_stage_score ON score_corrections(stage_score_id);

-- ============================================
-- VIEWS
-- ============================================

-- Match leaderboard with stage-by-stage breakdown
CREATE VIEW match_leaderboard AS
WITH stage_totals AS (
  SELECT 
    ss.match_id,
    ss.competitor_id,
    c.name,
    c.division,
    COUNT(DISTINCT ss.stage_id) as stages_completed,
    SUM(ss.stage_points) as total_points,
    AVG(ss.stage_percentage) as avg_percentage,
    SUM(ss.hits) as total_hits,
    SUM(ss.attempts) as total_attempts,
    BOOL_OR(ss.dq) as is_dq,
    BOOL_OR(ss.dnf) as has_dnf
  FROM stage_scores ss
  JOIN competitors c ON ss.competitor_id = c.id
  WHERE NOT ss.dq
  GROUP BY ss.match_id, ss.competitor_id, c.name, c.division
)
SELECT 
  match_id,
  ROW_NUMBER() OVER (PARTITION BY match_id ORDER BY total_points DESC) as overall_rank,
  ROW_NUMBER() OVER (PARTITION BY match_id, division ORDER BY total_points DESC) as division_rank,
  competitor_id,
  name,
  division,
  stages_completed,
  total_points,
  ROUND(avg_percentage, 2) as avg_percentage,
  total_hits,
  total_attempts,
  CASE WHEN total_attempts > 0 
    THEN ROUND((total_hits::DECIMAL / total_attempts) * 100, 2) 
    ELSE 0 
  END as hit_percentage,
  is_dq,
  has_dnf
FROM stage_totals
ORDER BY match_id, total_points DESC;

-- Stage leaderboard for individual stage results
CREATE VIEW stage_leaderboard AS
SELECT 
  ss.stage_id,
  ms.stage_number,
  ms.stage_name,
  ROW_NUMBER() OVER (PARTITION BY ss.stage_id ORDER BY ss.stage_points DESC) as stage_rank,
  c.name as competitor_name,
  c.division,
  ss.hits,
  ss.attempts,
  ss.time_seconds,
  ss.penalties,
  ss.stage_points,
  ss.stage_percentage,
  ss.dnf,
  ss.dq,
  ss.entered_by,
  ss.entered_by_role,
  ss.entry_method,
  ss.created_at
FROM stage_scores ss
JOIN competitors c ON ss.competitor_id = c.id
JOIN match_stages ms ON ss.stage_id = ms.id
WHERE NOT ss.dq
ORDER BY ss.stage_id, ss.stage_points DESC;

-- Data entry audit view
CREATE VIEW score_entry_audit AS
SELECT 
  m.name as match_name,
  ms.stage_number,
  ms.stage_name,
  c.name as competitor_name,
  ss.hits,
  ss.attempts,
  ss.stage_points,
  ss.entered_by,
  ss.entered_by_role,
  ss.entry_method,
  ss.entry_device_id,
  ss.created_at,
  ss.synced_at,
  ss.is_synced,
  ss.sync_conflict
FROM stage_scores ss
JOIN matches m ON ss.match_id = m.id
JOIN match_stages ms ON ss.stage_id = ms.id
JOIN competitors c ON ss.competitor_id = c.id
ORDER BY ss.created_at DESC;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE match_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_ros ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_status ENABLE ROW LEVEL SECURITY;

-- Public read access to match configuration
CREATE POLICY "Match stages are viewable by everyone" 
  ON match_stages FOR SELECT 
  USING (true);

-- Public read access to scores (transparency)
CREATE POLICY "Scores are viewable by everyone" 
  ON stage_scores FOR SELECT 
  USING (true);

-- Public read access to corrections (transparency)
CREATE POLICY "Score corrections are viewable by everyone" 
  ON score_corrections FOR SELECT 
  USING (true);

-- Public read access to squad assignments
CREATE POLICY "Squad assignments are viewable by everyone" 
  ON squad_assignments FOR SELECT 
  USING (true);

-- Public read access to RO assignments
CREATE POLICY "RO assignments are viewable by everyone" 
  ON stage_ros FOR SELECT 
  USING (true);

-- Note: Write permissions will be handled by authenticated API endpoints
-- with proper role validation, not RLS policies

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate stage points based on scoring type
CREATE OR REPLACE FUNCTION calculate_stage_points(
  p_stage_id UUID,
  p_hits INTEGER,
  p_attempts INTEGER,
  p_time_seconds DECIMAL,
  p_penalties INTEGER
) RETURNS TABLE(raw_points DECIMAL, stage_points DECIMAL, stage_percentage DECIMAL) AS $$
DECLARE
  v_scoring_type TEXT;
  v_max_points INTEGER;
  v_target_count INTEGER;
  v_par_time INTEGER;
  v_raw_points DECIMAL;
  v_stage_points DECIMAL;
  v_stage_percentage DECIMAL;
BEGIN
  -- Get stage configuration
  SELECT scoring_type, max_points, target_count, par_time
  INTO v_scoring_type, v_max_points, v_target_count, v_par_time
  FROM match_stages
  WHERE id = p_stage_id;
  
  -- Calculate based on scoring type
  CASE v_scoring_type
    WHEN 'hit_miss' THEN
      -- Simple hit/miss scoring
      v_raw_points := (p_hits::DECIMAL / v_target_count) * v_max_points;
      
    WHEN 'time_plus' THEN
      -- Time plus penalties (lower is better)
      v_raw_points := v_max_points - (p_time_seconds - v_par_time) - (p_penalties * 5);
      v_raw_points := GREATEST(0, v_raw_points);
      
    WHEN 'points' THEN
      -- Direct points entry
      v_raw_points := p_hits; -- hits field used for points in this mode
  END CASE;
  
  -- Apply penalties
  v_stage_points := v_raw_points - (p_penalties * 5);
  v_stage_points := GREATEST(0, v_stage_points);
  
  -- Calculate percentage
  v_stage_percentage := (v_stage_points / v_max_points) * 100;
  
  RETURN QUERY SELECT v_raw_points, v_stage_points, v_stage_percentage;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update calculated fields on stage_scores
CREATE OR REPLACE FUNCTION update_stage_score_calculations() RETURNS TRIGGER AS $$
DECLARE
  v_calc RECORD;
BEGIN
  -- Calculate points
  SELECT * INTO v_calc FROM calculate_stage_points(
    NEW.stage_id,
    NEW.hits,
    NEW.attempts,
    NEW.time_seconds,
    NEW.penalties
  );
  
  -- Update calculated fields
  NEW.raw_points := v_calc.raw_points;
  NEW.stage_points := v_calc.stage_points;
  NEW.stage_percentage := v_calc.stage_percentage;
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_stage_scores
  BEFORE INSERT OR UPDATE ON stage_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_stage_score_calculations();

-- ============================================
-- SAMPLE DATA HELPERS (Remove in production)
-- ============================================

-- Helper function to set up a match with stages
CREATE OR REPLACE FUNCTION setup_match_stages(
  p_match_id UUID,
  p_stage_count INTEGER DEFAULT 10
) RETURNS VOID AS $$
DECLARE
  i INTEGER;
BEGIN
  FOR i IN 1..p_stage_count LOOP
    INSERT INTO match_stages (
      match_id, 
      stage_number, 
      stage_name, 
      target_count, 
      par_time, 
      max_points,
      created_by
    ) VALUES (
      p_match_id,
      i,
      'Stage ' || i,
      8 + (i % 5), -- 8-12 targets
      90 + (i * 10), -- 90-180 seconds
      100,
      'System Admin'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;