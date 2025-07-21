# Quick AI Agent Instructions

## Workflow: LOCAL FIRST, COMMIT AFTER TESTING

1. **Create/edit files locally** using `/C/Users/David/dev/prs-iceland/` path
2. **Provide test instructions** for David to verify
3. **Wait for approval** before any GitHub commits
4. **Only push to GitHub** when David says "push" or "commit"

## Key Points
- Work on one component at a time
- Use MCP_DOCKER tools for local file operations
- No direct GitHub commits without testing
- Explain changes clearly
- Follow existing patterns in `css/clean/` structure

## Tools
- `MCP_DOCKER:write_file` - Create files locally
- `MCP_DOCKER:edit_file` - Edit files locally  
- `MCP_DOCKER:read_file` - Read current files
- `MCP_DOCKER:create_or_update_file` - GitHub commits (only after approval)

## Current Focus
Refactoring CSS from multiple files into clean architecture under `css/clean/`