# PRS Feature Planning Template

When planning a new feature for PRS Iceland, follow this structure:

## 1. Research (5 min)
- Check if feature exists: grep through codebase
- Find similar patterns in /src/components
- Review relevant Supabase APIs in /src/lib/supabase.js

## 2. Plan Structure

```
PROBLEM: What user pain point are we solving?

SOLUTION: One sentence description

IMPLEMENTATION:
1. [Component/file to create/modify]
2. [Database changes if needed]
3. [UI/UX considerations]

TESTING:
- [ ] Works on mobile
- [ ] Handles edge cases (list them)
- [ ] No console errors
```

## 3. Before Coding
- Get user approval on approach
- Create feature branch
- Keep it simple - this replaces Google Sheets