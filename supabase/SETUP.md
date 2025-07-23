# Supabase Setup Guide for PRS Iceland

## 1. Initial Setup

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project (name: `prs-iceland`)
   - Save your project URL and anon key

2. **Run Database Schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `schema.sql`
   - Run the SQL to create tables

3. **Enable Row Level Security (RLS)**
   ```sql
   -- Public read access for all tables
   ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
   ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
   ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE results ENABLE ROW LEVEL SECURITY;

   -- Read policies
   CREATE POLICY "Public read access" ON competitors FOR SELECT USING (true);
   CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
   CREATE POLICY "Public read access" ON registrations FOR SELECT USING (true);
   CREATE POLICY "Public read access" ON results FOR SELECT USING (true);
   
   -- Registration policies (allow public to register)
   CREATE POLICY "Public can register as competitor" ON competitors FOR INSERT WITH CHECK (true);
   CREATE POLICY "Competitors can update own record" ON competitors FOR UPDATE USING (true) WITH CHECK (true);
   CREATE POLICY "Public can register for matches" ON registrations FOR INSERT WITH CHECK (true);
   ```

## 2. Environment Variables

Create `.env.local` in your project root:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## 4. API Usage Examples

### Initialize Client
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Fetch Upcoming Matches
```javascript
const { data, error } = await supabase
  .from('match_registration_stats')
  .select('*')
  .eq('status', 'upcoming')
  .order('date', { ascending: true })
```

### Fetch Current Standings
```javascript
const { data, error } = await supabase
  .from('current_standings')
  .select('*')
```

### Register for a Match
```javascript
// First, create or find competitor
const { data: competitor } = await supabase
  .from('competitors')
  .upsert({ 
    email: 'jon@example.com',
    name: 'Jón Gunnarsson',
    division: 'Open',
    city: 'Reykjavík'
  })
  .select()
  .single()

// Then register for match
const { data, error } = await supabase
  .from('registrations')
  .insert({
    match_id: 'match-uuid-here',
    competitor_id: competitor.id,
    status: 'confirmed'
  })
```

## 5. Admin Functions

For admin features, you'll need:
1. Authentication setup (Supabase Auth)
2. RLS policies for write access
3. Admin UI components

### Example Admin Insert
```javascript
// Create a new match (requires auth)
const { data, error } = await supabase
  .from('matches')
  .insert({
    name: 'Vopnafjarðarmótið',
    date: '2025-02-15',
    location: 'Skotsvæði Vopnafjarðar',
    capacity: 40
  })
```

### Enter Match Results
```javascript
// Add results for a completed match
const { data, error } = await supabase
  .from('results')
  .insert({
    match_id: 'match-uuid',
    competitor_id: 'competitor-uuid',
    score: 285.25,
    percentage: 95.08,
    points: 285.25
  })
```

## 6. Real-time Subscriptions (Optional)

```javascript
// Listen for registration updates
const subscription = supabase
  .channel('registrations')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'registrations' },
    (payload) => {
      console.log('Registration change:', payload)
      // Update UI
    }
  )
  .subscribe()
```

## Next Steps

1. Set up authentication for admin users
2. Create admin UI components
3. Add data validation
4. Set up backup procedures