# AGGRESSIVE CLEANUP PLAN - PRS Iceland

## 🗑️ Files to DELETE or ARCHIVE

### ARCHIVE ALL OF THESE (31 files):
```
docs/ABOUT-SECTION-FIX.md          → archive/old-fixes/
docs/FIX-SUMMARY.md                → archive/old-fixes/
docs/CLEANUP-COMPLETE.md           → archive/old-fixes/
docs/GALLERY-*.md (11 files)       → archive/gallery-attempts/
docs/backup-*.css (3 files)        → archive/css-backups/
docs/google-sheets-demo.html       → archive/demos/
docs/template-google-docs.html     → archive/demos/
docs/CSS-ARCHITECTURE.md           → archive/old-plans/
docs/DATA-FIRST-IMPLEMENTATION.md  → archive/old-plans/
docs/FINAL-STRUCTURE.md            → archive/old-plans/
docs/REFACTORING-NOTES.md          → archive/old-plans/
docs/README-GOOGLE-SHEETS.md       → archive/old-docs/
docs/README-NAVIGATION.md          → archive/old-docs/
docs/cleanup-helper.sh             → archive/scripts/
```

### KEEP ONLY THESE (5 files):
```
docs/
├── README.md                      # Main documentation
├── AI-WORKFLOW-INSTRUCTIONS.md    # Critical for AI agents
├── color-migration-plan.md        # Active refactoring plan
├── TROUBLESHOOTING.md            # Useful reference
└── CLEANUP-SUMMARY-2025.md       # Today's cleanup record
```

## 🎯 Final Structure Should Be:

```
prs-iceland/
├── docs/
│   ├── README.md
│   ├── AI-WORKFLOW-INSTRUCTIONS.md
│   ├── color-migration-plan.md
│   ├── TROUBLESHOOTING.md
│   └── archive/
│       ├── README.md (explaining archive)
│       └── [all old stuff organized by type]
├── css/
│   ├── refactored/    # New clean CSS
│   └── [current files until refactor done]
├── js/
├── images/
├── pages/
├── test/
└── README.md
```

## 💣 Aggressive Cleanup Script

```batch
@echo off
echo AGGRESSIVE CLEANUP - PRS Iceland
echo ================================
echo.
echo This will archive 31+ documentation files!
echo.

REM Create all archive directories
mkdir docs\archive\old-fixes 2>nul
mkdir docs\archive\gallery-attempts 2>nul
mkdir docs\archive\css-backups 2>nul
mkdir docs\archive\demos 2>nul
mkdir docs\archive\old-plans 2>nul
mkdir docs\archive\old-docs 2>nul
mkdir docs\archive\scripts 2>nul

REM Move everything!
move docs\*FIX*.md docs\archive\old-fixes\ 2>nul
move docs\CLEANUP-COMPLETE.md docs\archive\old-fixes\ 2>nul
move docs\GALLERY-*.md docs\archive\gallery-attempts\ 2>nul
move docs\backup-*.css docs\archive\css-backups\ 2>nul
move docs\*-demo.html docs\archive\demos\ 2>nul
move docs\template-*.html docs\archive\demos\ 2>nul
move docs\CSS-ARCHITECTURE.md docs\archive\old-plans\ 2>nul
move docs\DATA-FIRST-IMPLEMENTATION.md docs\archive\old-plans\ 2>nul
move docs\FINAL-STRUCTURE.md docs\archive\old-plans\ 2>nul
move docs\REFACTORING-NOTES.md docs\archive\old-plans\ 2>nul
move docs\README-*.md docs\archive\old-docs\ 2>nul
move docs\cleanup-helper.sh docs\archive\scripts\ 2>nul

echo.
echo Cleanup complete! Docs folder is now CLEAN!
```

## 🚨 Or Even More Aggressive:

Just keep what's needed for the refactoring:
1. `docs/AI-WORKFLOW-INSTRUCTIONS.md`
2. `docs/color-migration-plan.md`
3. Everything else → ARCHIVE

The test-files/ and workflow/ subdirectories can probably go too!

## 📊 Impact:
- **Before**: 30+ files in docs/
- **After**: 5 essential files + organized archive
- **Result**: 85% less clutter!

Want me to create this aggressive cleanup script?