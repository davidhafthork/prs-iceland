#!/bin/bash
# Archive cleanup script for PRS Iceland
# Run this to move outdated files to archive

# Gallery fix files to archive
gallery_files=(
    "GALLERY-BLANK-FIX.md"
    "GALLERY-BLOB-OPTIMIZATION.md"
    "GALLERY-COMPLETE-FIX.md"
    "GALLERY-CURSOR-MOTION-UPDATE.md"
    "GALLERY-CURSOR-NO-SPIN.md"
    "GALLERY-CURSOR-SIMPLE.md"
    "GALLERY-FIX.md"
    "GALLERY-INFINITE-UPDATE.md"
    "GALLERY-PERFORMANCE-OPTIMIZATION.md"
    "GALLERY-ROBUST-PRELOADING.md"
    "GALLERY-SEAMLESS-UPDATE.md"
)

# Other fix files to archive
other_files=(
    "ABOUT-SECTION-FIX.md"
    "FIX-SUMMARY.md"
    "CLEANUP-COMPLETE.md"
    "backup-critical-fixes.css"
    "backup-debug-header.css"
    "backup-final-fix.css"
)

# Files to keep (don't archive)
keep_files=(
    "AI-AGENT-QUICKSTART.md"
    "AI-WORKFLOW-INSTRUCTIONS.md"
    "CSS-ARCHITECTURE.md"
    "DATA-FIRST-IMPLEMENTATION.md"
    "FINAL-STRUCTURE.md"
    "REFACTORING-NOTES.md"
    "TROUBLESHOOTING.md"
    "README-GOOGLE-SHEETS.md"
    "README-NAVIGATION.md"
    "color-migration-plan.md"
)

echo "Files to be archived:"
echo "===================="
echo "Gallery fixes: ${#gallery_files[@]} files"
echo "Other fixes: ${#other_files[@]} files"
echo ""
echo "Files to keep: ${#keep_files[@]} files"
echo ""
echo "This will help clean up the project structure for the refactoring."