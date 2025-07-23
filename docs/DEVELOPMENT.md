# Development Handbook

## Critical Information

**This is a PRODUCTION system for PRS Iceland**, not a demo or learning project. It manages real precision rifle competitions in Iceland.

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

### What's Missing
- 🔐 Authentication (admin panel is unprotected)
- 📝 Registration form (the "Skrá í mót" button doesn't work yet)
- 📧 Email notifications
- ✏️ Edit/delete functionality
- 🚀 Production deployment

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

### Key Files
- `/src/lib/supabase.js` - All database operations
- `/src/components/admin/*` - Admin interface
- `/supabase/schema.sql` - Database structure

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

### Environment
```bash
# .env.local (required)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## For AI Assistants

Before suggesting changes:
1. Understand this is a real production system
2. Check if the feature already exists
3. Consider if it truly helps match organizers
4. Keep solutions simple and maintainable

Never:
- Add complex features "just because"
- Make static content dynamic without good reason
- Modify database schema without migration planning
- Implement features not in the "What's Missing" list above