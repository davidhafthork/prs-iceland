# PRS Iceland Website

Official website for PRS Iceland (Precision Rifle Series) - Tournament platform with live standings, registration, and competition data.

## Project Structure

```
prs-iceland/
├── css/                      # All stylesheets
│   ├── clean/                # New refactored CSS architecture
│   ├── legacy/               # Old/unused CSS files
│   └── *.css                 # Active CSS files
├── docs/                     # Documentation
│   ├── workflow/             # Development workflows & AI instructions
│   ├── refactoring/          # Current refactoring documentation
│   └── archive/              # Historical docs and fixes
├── pages/                    # HTML pages
│   ├── index.html            # Main tournament platform
│   └── arsyfirlit.html       # Calendar page
├── js/                       # JavaScript modules
├── images/                   # Image assets
├── test/                     # Test pages
├── audit/                    # CSS audit tools
└── debug/                    # Debug utilities
```

## Quick Start

1. **For Development:**
   - Main CSS: `css/main.css`
   - Clean CSS (refactoring): `css/clean/`
   - Main pages: `pages/index.html`, `pages/arsyfirlit.html`

2. **For AI Agents:**
   - Read `docs/workflow/AI-WORKFLOW-INSTRUCTIONS.md`
   - Quick reference: `docs/workflow/AI-AGENT-QUICKSTART.md`

## Current Status

Currently refactoring CSS architecture from 23+ files to a clean, maintainable structure. See `docs/refactoring/CURRENT-STATE.md` for progress.

## Technologies

- HTML5/CSS3
- Vanilla JavaScript (ES6+)
- Google Sheets integration for live data
- Dark theme design system

## License

See LICENSE file for details.