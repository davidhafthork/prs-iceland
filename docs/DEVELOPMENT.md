# Development Handbook

## Critical Information

**This is a PRODUCTION system for PRS Iceland**, not a demo or learning project. It manages real precision rifle competitions in Iceland.

## Documentation Rules

**IMPORTANT**: This project uses exactly TWO documentation files:
1. `/README.md` - Public-facing project overview
2. `/docs/DEVELOPMENT.md` - This file, containing all development information

**DO NOT CREATE** additional documentation files. All development notes, guides, session summaries, or technical documentation must be added to THIS FILE. No exceptions.

## System State (Last Updated: July 2025)

### What's Deployed
- Database: Supabase (PostgreSQL)
- Frontend: React 19 + Vite + Tailwind CSS 4
- Core Features: Match management, registration tracking, results, standings

### What's Working
- ✅ Database connected with 4 tables (competitors, matches, registrations, results)
- ✅ Homepage shows live data (upcoming matches, standings, stats)
- ✅ Admin panel at `/admin` for creating matches and entering results
- ✅ Automatic standings calculation from match results
- ✅ Registration form with modal interface
- ✅ Participant list display for each match
- ✅ Smooth scroll navigation
- ✅ Edit/delete functionality for matches, registrations, and results
  - Match management: Edit match details, delete upcoming matches
  - Registration management: Change status, delete registrations
  - Results management: Edit scores, delete results

### What's Missing
- 🔐 Authentication (admin panel is unprotected)
- 📧 Email notifications
- 🚀 Production deployment

## Architecture Overview

### Content-First Design

This project uses a **content-first architecture** that separates content from presentation:

```
src/
├── components/        # Pure presentation components
├── data/             # All content as data
│   ├── heroContent.js
│   ├── matches.js    # Match data
│   ├── standings.js  # Competition data
│   └── ...           # Other content files
├── config/           # Configuration
│   ├── site.js       # Site metadata
│   └── ui.js         # UI behavior config
└── lib/
    └── supabase.js   # Database operations
```

**Important**: The separation between static content (in `/data`) and dynamic data (from Supabase) is intentional. Don't change this.

### Database Schema
```sql
competitors (id, name, email, division, city)
matches (id, name, date, location, capacity, status)
registrations (match_id, competitor_id, status)
results (match_id, competitor_id, score, percentage, points)
```

### API Methods
```javascript
// From /src/lib/supabase.js
matchesApi.getUpcoming()     // Get upcoming matches
matchesApi.create()          // Create match (admin)
standingsApi.getCurrent()    // Get current standings
registrationApi.register()   // Register for match
resultsApi.addResults()      // Add results (admin)
```

## Development Rules

### 1. Keep It Simple
This replaces a chaotic Google Sheets system. Don't add complexity unless it solves a real problem for match organizers.

### 2. Preserve Architecture
- **Dynamic data** (matches, results) comes from Supabase
- **Static content** (hero, about, footer) stays in `/src/data` files
- This separation is intentional - don't change it

### 3. Test Everything
- Always run `npm run dev` and test locally
- Check `/test` route to verify database connection
- Never push untested database schema changes

### 4. Safe Operations
```bash
# Safe to run anytime
npm install
npm run dev

# Check before modifying
- Database schema (test migrations first)
- Authentication logic (affects all users)
- Production environment variables
```

## Quick Reference

### Routes
- `/` - Main website
- `/admin` - Admin dashboard (unprotected)
- `/test` - Database connection tester
- `/debug` - Registration and data debug panel

### Key Files
- `/src/lib/supabase.js` - All database operations
- `/src/components/admin/*` - Admin interface
- `/src/components/RegistrationModal.jsx` - Registration form
- `/src/components/MatchRegistrations.jsx` - Participant list
- `/supabase/schema.sql` - Database structure
- `/supabase/rls_policies.sql` - Row Level Security policies
- `/supabase/SETUP.md` - Database setup instructions

### Environment
```bash
# .env.local (required)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## Content Management

Static content lives in `/src/data/`:
- Hero text, about descriptions, CTAs
- Navigation configuration
- Theme settings
- Feature flags

To update static content:
1. Navigate to `/src/data/`
2. Find the relevant content file
3. Update the JavaScript object
4. Changes appear instantly in dev mode

### Customization Options

**Theme** (`/src/config/ui.js`):
```javascript
export const themeConfig = {
  colors: {
    primary: 'orange-500',
    background: 'zinc-950'
  }
}
```

**Feature Flags** (`/src/config/ui.js`):
```javascript
export const featureFlags = {
  enableRegistration: true,
  showUpcomingMatches: true
}
```

## Deployment

### Build Process
```bash
npm run build    # Creates optimized build in /dist
npm run preview  # Test production build locally
```

### Deployment Checklist
- [ ] Set up authentication for admin routes
- [ ] Configure production environment variables
- [x] Enable RLS policies in Supabase (basic policies done)
- [ ] Set up proper CORS headers
- [ ] Configure custom domain
- [ ] Set up monitoring/logging
- [ ] Add email notifications for registrations
- [ ] Implement proper error tracking

### Future Enhancements

The content-first architecture enables:
- **CMS Integration**: Connect to Strapi, Contentful, etc.
- **Internationalization**: Add English translations
- **Member Portal**: Add authentication and user features

## For AI Assistants

### Core Principle: Fix Problems at Lowest Value Stage
Always catch issues during planning, not after implementation:
1. **Plan thoroughly** before coding
2. **Validate approach** with small tests
3. **Question assumptions** early
4. **Review plans** before executing

Before suggesting changes:
1. Understand this is a real production system
2. Check if the feature already exists
3. Consider if it truly helps match organizers
4. Keep solutions simple and maintainable
5. **NEVER create new documentation files** - use only README.md and DEVELOPMENT.md

Never:
- Add complex features "just because"
- Make static content dynamic without good reason
- Modify database schema without migration planning
- Implement features not in the "What's Missing" list above
- **Create any documentation files beyond README.md and DEVELOPMENT.md**

### Planning Templates
Templates are available in `.claude/commands/`:
- `prs-feature.md` - Feature planning structure
- `prs-debug.md` - Debugging methodology

Use these as guides when planning work to ensure thorough thinking before implementation.

## Common Issues & Solutions

### Registration RLS Error
If you get "new row violates row-level security policy":
1. Check that RLS policies are properly set in Supabase
2. Run the policies in `/supabase/rls_policies.sql`
3. Or temporarily disable RLS for development: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;`

## Development Log

**Add session notes here instead of creating new files**

### July 2025 - Registration Implementation
- Implemented registration modal with form validation
- Fixed RLS policies for public registration
- Added participant display for matches
- Created debug route at `/debug`
- Updated header navigation with smooth scrolling
- **Note**: All future session summaries should be added here, not in separate files

### July 2025 - Edit/Delete Functionality Implementation
- Extended Supabase API with full CRUD operations for matches, registrations, results, and competitors
- Created AdminMatchList component for match management with inline editing
- Added AdminRegistrationManager for managing match registrations (status changes, deletions)
- Created AdminResultsManager for editing and deleting match results
- Updated Admin Dashboard with new tabs for managing data
- Key features:
  - Matches: Edit details (name, date, location, capacity), delete upcoming matches only
  - Registrations: Change status (confirmed/waitlist/cancelled), delete registrations
  - Results: Edit scores/percentages/points, delete individual results
  - All operations include confirmation dialogs and success/error messaging

### July 2025 - Mobile Responsive Admin Panel
- Made entire admin panel mobile-friendly with responsive design
- Tab Navigation:
  - Horizontal scroll on mobile with shortened labels
  - Full labels on tablet and desktop
  - Prevented text wrapping issues
- Tables converted to card layouts on mobile:
  - Results form: Stacked card layout with grid inputs
  - Results manager: Card-based display with inline editing
  - Registration manager: Flexible layout with proper spacing
- Form improvements:
  - Responsive padding and text sizes
  - Touch-friendly button sizes (44px minimum)
  - Proper input field spacing
- Match list:
  - Stacked layout for match details on mobile
  - Grid inputs stack vertically on small screens
- Key responsive breakpoints:
  - Mobile: Default styles
  - Tablet/Desktop: md: breakpoint (768px+)

### July 2025 - Registration Management Bug Fix
- Fixed delete and update operations for registrations not working due to missing RLS policies
- Created `/supabase/rls_policies_registration_fix.sql` with:
  - DELETE policy for registrations
  - UPDATE policy for registrations
- Added debugging console logs to help identify issues
- **Action Required**: Run the new SQL file in Supabase to enable delete/update operations:
  ```sql
  -- Run in Supabase SQL editor after the main rls_policies.sql
  -- Contents of /supabase/rls_policies_registration_fix.sql
  ```

### July 2025 - Results and Complete Edit/Delete Fix
- Fixed "JSON object requested, multiple (or no) rows returned" error for results updates
- Created comprehensive RLS policies file: `/supabase/rls_policies_complete_fix.sql`
- Includes all missing UPDATE and DELETE policies for:
  - Matches
  - Registrations 
  - Results
  - Competitors
- Added debugging to track ID issues
- **Action Required**: Run the complete fix SQL in Supabase:
  ```sql
  -- Run the contents of /supabase/rls_policies_complete_fix.sql in Supabase SQL editor
  -- This will fix all edit/delete operations across the admin panel
  ```
- **Important**: Check console logs to see if `competitor_id` is present in result objects

### July 2025 - Clarified Manual vs Calculated Fields
- Redesigned results entry to clearly distinguish between:
  - **Manual Input**: Score (raw points from competition)
  - **Auto-Calculated**: Percentage (score/max_score × 100)
  - **Configurable**: Points (either manual or auto-calculated based on position)
- Added max score setting per match (default 300)
- Added toggle for manual vs automatic points calculation
- Visual indicators:
  - Required fields marked with orange asterisk
  - Calculated fields shown with gray background and "(reiknað)" label
  - Read-only fields have different styling
- Points calculation options:
  - **Automatic**: Based on final position (1st = 100p, 2nd = 95p, etc.)
  - **Manual**: Admin can enter custom points
- Added explanatory section showing what each field represents

### July 2025 - Admin Protection & Deployment Preparation
- Added temporary password protection for admin routes
  - Password: `prs-admin-2025` (MUST BE CHANGED!)
  - Component: `/src/components/AdminProtection.jsx`
  - Protects: `/admin` and `/debug` routes
  - Uses sessionStorage for session persistence
- Prepared for client review deployment

## Client Review Deployment Guide

### Quick Deployment to Vercel (Recommended)

1. **Pre-deployment:**
   ```bash
   # Test build locally
   npm run build
   npm run preview
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub (davidhafthork)
   - Click "Add New Project"
   - Import `davidhafthork/prs-iceland`
   - Configure:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variables:
     - `VITE_SUPABASE_URL` = (value from .env.local)
     - `VITE_SUPABASE_ANON_KEY` = (value from .env.local)
   - Deploy!

3. **Alternative: Netlify**
   - Similar process at [netlify.com](https://netlify.com)
   - Also supports GitHub integration
   - Free password protection with Netlify Identity

4. **Share with Client:**
   - Main site: `https://[project-name].vercel.app`
   - Admin panel: `https://[project-name].vercel.app/admin`
   - Password: Share separately via secure channel

5. **Continuous Deployment:**
   - Any push to GitHub automatically redeploys
   - Preview deployments for pull requests

### Security Considerations

- **Temporary Admin Protection**: Current password protection is basic and temporary
- **Don't commit passwords**: Never commit the actual password to Git
- **Consider site-wide protection**: Use Vercel/Netlify's password protection during review
- **Plan for proper auth**: Implement Supabase Auth before production launch