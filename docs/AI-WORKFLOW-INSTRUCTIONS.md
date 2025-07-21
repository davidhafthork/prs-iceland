# AI Agent Workflow Instructions for PRS Iceland Project

## Working with David - Preferred Development Flow

### Core Principles
1. **Test Locally First** - Never commit code directly to GitHub without local testing
2. **Incremental Changes** - Work on one component/feature at a time
3. **Verify Before Commit** - David will test and approve before any GitHub commits
4. **Clear Communication** - Explain what changes are being made and why

### Preferred Workflow

#### Step 1: Propose Changes
```markdown
"I'll create/modify [component] to [achieve goal]. 
This will involve:
- Change A: [reason]
- Change B: [reason]
"
```

#### Step 2: Create/Edit Files Locally
Use the local file system tools to create or modify files:
```
MCP_DOCKER:write_file - for new files
MCP_DOCKER:edit_file - for existing files
MCP_DOCKER:read_file - to check current state
```

**Important Path Format:**
- Use: `/C/Users/David/dev/prs-iceland/[path]`
- NOT: `C:\Users\David\dev\prs-iceland\[path]`

#### Step 3: Provide Test Instructions
Always include:
1. Which files were created/modified
2. How to test the changes
3. What to look for
4. Any potential issues to check

Example:
```markdown
## Testing Instructions
1. Open `test/component-test.html` in your browser
2. Check that:
   - Feature X works when...
   - Colors match the design system
   - Mobile responsive at < 768px
3. Compare with old version for regressions
```

#### Step 4: Wait for Approval
After David tests:
- If approved → proceed to commit
- If issues → fix locally first
- If questions → clarify before proceeding

#### Step 5: Commit to GitHub (Only After Approval)
When David says "push these changes" or "commit this":
```
MCP_DOCKER:create_or_update_file - with branch "main"
```

### File Organization Patterns

#### CSS Refactoring Structure
```
css/clean/
├── base/
│   ├── variables.css    # All CSS variables
│   ├── reset.css       # Minimal reset
│   └── typography.css  # Text styles
├── components/
│   ├── [component].css # One file per component
├── layout/
│   └── [layout].css    # Layout utilities
├── utilities/
│   └── [utility].css   # Utility classes
└── main-clean.css      # Import orchestrator
```

#### Test File Pattern
For each component, create:
```
test/[component]-test.html
```

### Code Standards

#### CSS Guidelines
- Use CSS variables from `variables.css`
- No `!important` unless absolutely necessary
- Use class selectors, not IDs
- Follow BEM-like naming: `.component`, `.component-element`
- Comment major sections

#### Example Component Structure
```css
/* ========================================
   COMPONENT NAME
   Brief description
   ======================================== */

/* Component Container */
.component { }

/* Component Elements */
.component-element { }

/* Component Modifiers */
.component--modifier { }

/* Component States */
.component.is-active { }

/* Responsive */
@media (max-width: 768px) { }
```

### Common Tasks

#### Refactoring a CSS Component
1. Read current file: `MCP_DOCKER:read_file`
2. Analyze what it does
3. Create clean version locally
4. Create test page
5. Wait for testing approval
6. Update main-clean.css imports
7. Document in CURRENT-STATE.md

#### Checking Project State
Always start by checking:
1. Current branch status
2. What files have been modified
3. Current refactoring progress in CURRENT-STATE.md

### Communication Style
- Be explicit about what you're doing
- Acknowledge when you can't do something
- Ask for clarification when needed
- Summarize what was accomplished

### Typical Session Flow
```
1. "What would you like to work on today?"
2. David specifies task
3. Create/modify files locally
4. Provide test instructions
5. David tests
6. Fix any issues locally
7. David approves
8. Push to GitHub
9. Update documentation
```

### Important Notes
- David uses Windows paths: `C:\Users\David\dev\prs-iceland\`
- The project uses a dark theme design system
- Performance and clean code are priorities
- The site is for PRS Iceland (precision rifle series)
- Main pages are in `pages/` directory
- Production files are index.html and arsyfirlit.html

### Tools Available
- `MCP_DOCKER:read_file` - Read file contents
- `MCP_DOCKER:write_file` - Create new files
- `MCP_DOCKER:edit_file` - Modify existing files
- `MCP_DOCKER:list_directory` - See folder contents
- `MCP_DOCKER:create_or_update_file` - GitHub operations
- Various other GitHub tools for commits, branches, etc.

### Error Recovery
If something goes wrong:
1. Don't panic or apologize excessively
2. Explain what happened
3. Propose a solution
4. Wait for David's input

### End of Session
Always:
1. Summarize what was accomplished
2. Note any pending tasks
3. Update CURRENT-STATE.md if significant progress
4. Ensure local and remote are in sync