---
## 🔴 AGENT HANDOFF NOTE - REMOVE AFTER READING CAREFULLY 🔴

### Context & Mission
You are continuing work on the **Digital Scoring System** for PRS Iceland. This is a young rifle shooting club (est. 2021) that currently uses paper scorecards and manual Excel entry. We're building a hybrid paper-digital system that respects their current workflow while solving real pain points.

### What Has Been Decided

**1. Architecture Philosophy: "Enhance, Don't Replace"**
- Paper scoring remains PRIMARY during matches (ROs are busy with safety)
- Digital entry happens BETWEEN stages or AFTER match
- System must work 100% offline (Icelandic ranges often have no signal)
- Gradual adoption is the goal - let them feel benefits naturally

**2. Core Problem We're Solving**
- Currently: 2-3 hours manual Excel entry after each match
- Currently: Results published days later on Facebook
- Solution: 15-minute digital entry → instant results

**3. Technical Approach - Data Transparency**
The user emphasized this is key: Every piece of data must show:
- WHO entered it (RO name, competitor, admin)
- WHEN it was entered
- HOW it was entered (live, batch, paper transfer)
- WHERE it came from (which device, what method)
- Full audit trail for dispute resolution

**4. What Professional PRS Needs** (from research)
- Matches have 8-16 stages
- Each stage: target count, par time, scoring type
- Stage-by-stage scoring (not just final score)
- Hit/miss tracking per target
- Equipment tracking
- Squad rotation management

### Current Branch Status
- Branch: `feature/digital-scoring-system`
- Started fresh from main (production is untouched)
- Will deploy to separate Vercel preview URL
- User wants separate Supabase environment for testing

### Next Implementation Steps

**1. Database Schema** (Start Here)
```sql
-- Enhanced matches with stages
CREATE TABLE match_stages (
  id UUID PRIMARY KEY,
  match_id UUID REFERENCES matches(id),
  stage_number INTEGER,
  stage_name TEXT,
  target_count INTEGER,
  par_time INTEGER
);

-- Flexible scoring with full provenance
CREATE TABLE stage_scores (
  id UUID PRIMARY KEY,
  match_id UUID,
  stage_id UUID,
  competitor_id UUID,
  hits INTEGER,
  attempts INTEGER,
  -- Provenance fields (USER EMPHASIZED THIS)
  entered_by TEXT,
  entered_by_role TEXT,
  entry_method TEXT, -- 'live', 'batch', 'paper_transfer'
  device_id TEXT,
  created_at TIMESTAMPTZ,
  synced BOOLEAN DEFAULT false
);
```

**2. Build Three Interfaces**
- **RO Interface**: Quick score entry between stages (mobile-first, BIG buttons)
- **Admin Interface**: Resolve conflicts, see all data with provenance
- **Public Interface**: Competitors view scores (read-only)

**3. Offline-First Implementation**
- PWA with service worker
- LocalStorage for unsynced scores
- Background sync when connection available
- Show sync status clearly

### Critical User Requirements
1. **Simple for ROs** - Don't disrupt their match flow
2. **Transparent data** - Every score traceable to source
3. **Works offline** - Icelandic ranges have poor connectivity
4. **Gradual adoption** - Paper remains available always
5. **Mobile-first** - Designed for phones in outdoor conditions

### Development Approach
1. Start with post-match batch entry (easiest win)
2. Add between-stage entry once that works
3. Real-time scoring only if/when they ask for it
4. Always maintain paper as fallback

### Important Context
- This is a REAL production system for REAL competitions
- 150+ active members, 24 matches/year
- They currently use Google Sheets - keep it simple
- Focus on solving actual pain points, not creating new ones

### Your First Tasks
1. Create the enhanced database schema in new Supabase project
2. Build basic RO score entry interface (mobile-first)
3. Implement offline storage with sync
4. Create admin view showing data provenance

### Files to Review
- `/docs/DEVELOPMENT.md` - Full project context
- `/CLAUDE.md` - AI-specific guidance
- Current schema: `/supabase/schema.sql`

Remember: The user values honest, thoughtful critique. Don't just build - think about whether it truly makes their life easier.

---

# PRS Iceland

Official website for Precision Rifle Series Iceland - Iceland's premier precision rifle competition organization.

## About

PRS Iceland organizes and manages precision rifle shooting competitions across Iceland. This website serves as the central hub for:
- Competition schedules and registration
- Current standings and results  
- Member information
- News and updates about the sport

## Quick Start

```bash
# Clone the repository
git clone https://github.com/davidhafthork/prs-iceland.git

# Navigate to project directory  
cd prs-iceland

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Supabase** - Database and authentication
- **Lucide React** - Icons

## Documentation

For detailed development information, architecture details, and contribution guidelines, see [`/docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## Contact

- **Email**: prs@prsiceland.is
- **Address**: Stekkjarseli 7, 109 Reykjavík

## License

This project is proprietary software owned by PRS Iceland.

---

*Precision Rifle Series Iceland - Competing at the highest level*