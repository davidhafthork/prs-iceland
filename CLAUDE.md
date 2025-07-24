# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Start Here

1. **Read this file first** - Contains AI-specific guidance
2. **Then read `/docs/DEVELOPMENT.md`** - Contains full project details, architecture, and development history
3. **Update this file** when adding new AI-specific guidance or common pitfalls

## Git Workflow (REQUIRED)

**NEVER work directly on main branch**. Always create a feature branch:

```bash
# For new features
git checkout -b feature/description-here

# For bug fixes
git checkout -b fix/description-here

# For documentation updates
git checkout -b docs/description-here

# Examples:
git checkout -b feature/email-notifications
git checkout -b fix/registration-error
git checkout -b docs/update-readme
```

**Before starting work:**
1. Always pull latest main: `git pull origin main`
2. Create new branch from main
3. Make changes and test thoroughly
4. Commit with clear messages
5. Let user handle PR creation

## Quick Commands

```bash
npm run dev         # Start development (port 5173)
npm run lint        # Check code quality
npm run build       # Production build

# After making changes:
npm run lint        # Always run this before considering task complete
```

## Environment Requirements

```bash
# Required .env.local file:
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
```

## Critical AI Rules

1. **NEVER work on main branch** - Always create feature/fix branches
2. **NEVER create new documentation files** - Only README.md and docs/DEVELOPMENT.md exist
3. **This is PRODUCTION** - Real competitions, real users. Test everything.
4. **Don't add complexity** - This replaces a Google Sheets. Keep it simple.
5. **Static vs Dynamic** - Static content in `/src/data/`, dynamic from Supabase. Don't mix.

## Common AI Mistakes to Avoid

- Creating new .md files (add to DEVELOPMENT.md instead)
- Making static content dynamic without good reason
- Adding features not requested by the user
- Forgetting to run `npm run lint` after changes
- Not checking if a feature already exists before implementing

## Architecture Quick Reference

```
/src/lib/supabase.js    # All database operations
/src/components/admin/  # Admin interface
/src/data/             # Static content files
/admin                 # Protected route (password: prs-admin-2025)
```

## Testing & Verification

- Always test changes with `npm run dev`
- Check `/test` route to verify database connection
- Test admin features at `/admin` (password required)
- Use `/debug` for registration troubleshooting

## Compounding Engineering Practices

### Fix Problems at Lowest Value Stage
Always catch issues during planning, not implementation:
1. Review feature plans before coding
2. Validate approach with small tests first
3. Question assumptions early

### Feature Planning Template
When planning a new feature, structure it as:
```
Problem Statement: What specific issue are we solving?
User Story: As a [user], I want [feature] so that [benefit]
Questions to Consider:
- Does this already exist in some form?
- What's the simplest solution?
- How does this affect existing features?

Implementation Approach:
1. Research existing patterns in codebase
2. Define success criteria
3. List potential edge cases
```

### Planning Templates
The `.claude/commands/` directory contains templates for common tasks:

- `prs-feature.md` - Feature planning checklist
- `prs-debug.md` - Debugging methodology

To use: Read the template and follow its structure when planning work.

## Complete Workflow Example

Here's how to implement a new feature from start to finish:

```bash
# 1. Start on main and pull latest
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Plan the feature using the template from prs-feature.md
# - Research existing code
# - Define problem and solution
# - List implementation steps

# 4. Implement following the plan
# - Make changes
# - Test locally with npm run dev
# - Run npm run lint

# 5. Commit with clear message
git add .
git commit -m "feat: add your feature description"

# 6. Push branch
git push -u origin feature/your-feature-name

# 7. User creates PR (not AI)
```

## For Detailed Information

See `/docs/DEVELOPMENT.md` for:
- Complete architecture explanation
- Database schema and RLS policies
- Development history and session logs
- Deployment instructions
- All other project details