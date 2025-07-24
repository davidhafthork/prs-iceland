-- Complete seed data for PRS Iceland
-- This version uses JOINs to avoid needing IDs
-- Copy and paste ALL of this into Supabase SQL editor

-- 1. Insert competitors
INSERT INTO competitors (name, email, division, city) VALUES
  ('Jón Gunnarsson', 'jon.gunnarsson@example.com', 'Open', 'Reykjavík'),
  ('Ólafur Þórsson', 'olafur.thorsson@example.com', 'Open', 'Akureyri'),
  ('Guðrún Sigurðardóttir', 'gudrun.sigurdardottir@example.com', 'Production', 'Selfoss'),
  ('Magnús Einarsson', 'magnus.einarsson@example.com', 'Tactical', 'Kópavogur'),
  ('Kristín Jónsdóttir', 'kristin.jonsdottir@example.com', 'Production', 'Hafnarfjörður'),
  ('Þórður Helgason', 'thordur.helgason@example.com', 'Open', 'Vopnafjörður'),
  ('Sigríður Ólafsdóttir', 'sigridur.olafsdottir@example.com', 'Tactical', 'Reykjavík'),
  ('Bjarni Kristjánsson', 'bjarni.kristjansson@example.com', 'Production', 'Egilsstaðir'),
  ('Anna Magnúsdóttir', 'anna.magnusdottir@example.com', 'Open', 'Reykjavík'),
  ('Pétur Sigurðsson', 'petur.sigurdsson@example.com', 'Production', 'Akureyri')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert matches
INSERT INTO matches (name, date, location, capacity, status) VALUES
  ('Jólamótið 2024', '2024-12-14', 'Grafarvogur', 40, 'completed'),
  ('Haustmótið 2024', '2024-11-23', 'Selfoss skotsvæði', 45, 'completed'),
  ('Vopnafjarðarmótið', '2025-02-15', 'Skotsvæði Vopnafjarðar', 40, 'upcoming'),
  ('Suðurlandsmótið', '2025-03-08', 'Selfoss skotsvæði', 50, 'upcoming'),
  ('Höfuðborgarmótið', '2025-03-22', 'Grafarvogur', 60, 'upcoming'),
  ('Norðurlandsmótið', '2025-04-05', 'Akureyri skotsvæði', 45, 'upcoming');

-- 3. Add some registrations
INSERT INTO registrations (match_id, competitor_id, status) 
SELECT 
    m.id, c.id, 'confirmed'
FROM matches m, competitors c
WHERE m.name = 'Vopnafjarðarmótið'
AND c.email IN ('jon.gunnarsson@example.com', 'gudrun.sigurdardottir@example.com', 'magnus.einarsson@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO registrations (match_id, competitor_id, status) 
SELECT 
    m.id, c.id, 'confirmed'
FROM matches m, competitors c
WHERE m.name = 'Suðurlandsmótið'
AND c.email IN ('olafur.thorsson@example.com', 'jon.gunnarsson@example.com', 'kristin.jonsdottir@example.com', 'gudrun.sigurdardottir@example.com')
ON CONFLICT DO NOTHING;

-- 4. Add some results for completed matches
INSERT INTO results (match_id, competitor_id, score, percentage, points)
SELECT 
    m.id, c.id, 285.50, 95.17, 285.50
FROM matches m, competitors c
WHERE m.name = 'Jólamótið 2024' AND c.email = 'jon.gunnarsson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO results (match_id, competitor_id, score, percentage, points)
SELECT 
    m.id, c.id, 278.25, 92.75, 278.25
FROM matches m, competitors c
WHERE m.name = 'Jólamótið 2024' AND c.email = 'olafur.thorsson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO results (match_id, competitor_id, score, percentage, points)
SELECT 
    m.id, c.id, 291.00, 97.00, 291.00
FROM matches m, competitors c
WHERE m.name = 'Haustmótið 2024' AND c.email = 'olafur.thorsson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO results (match_id, competitor_id, score, percentage, points)
SELECT 
    m.id, c.id, 286.25, 95.42, 286.25
FROM matches m, competitors c
WHERE m.name = 'Haustmótið 2024' AND c.email = 'jon.gunnarsson@example.com'
ON CONFLICT DO NOTHING;