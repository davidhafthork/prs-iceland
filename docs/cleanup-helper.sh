#!/bin/bash
# Quick cleanup script for PRS Iceland
# Run from project root: bash docs/cleanup-helper.sh

echo "PRS Iceland Cleanup Helper"
echo "========================="
echo ""

# Check if we're in the right directory
if [ ! -d "css" ] || [ ! -d "docs" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

# Create archive directories
echo "Creating archive directories..."
mkdir -p docs/archive/gallery-fixes
mkdir -p docs/archive/design-fixes
mkdir -p docs/archive/css-backups

# Move gallery fix files
echo ""
echo "Moving gallery fix documentation..."
for file in docs/GALLERY-*.md; do
    if [ -f "$file" ]; then
        echo "  Moving: $file"
        mv "$file" docs/archive/gallery-fixes/
    fi
done

# Move other fix files
echo ""
echo "Moving other fix documentation..."
if [ -f "docs/ABOUT-SECTION-FIX.md" ]; then
    echo "  Moving: docs/ABOUT-SECTION-FIX.md"
    mv "docs/ABOUT-SECTION-FIX.md" docs/archive/design-fixes/
fi

if [ -f "docs/FIX-SUMMARY.md" ]; then
    echo "  Moving: docs/FIX-SUMMARY.md"
    mv "docs/FIX-SUMMARY.md" docs/archive/design-fixes/
fi

if [ -f "docs/CLEANUP-COMPLETE.md" ]; then
    echo "  Moving: docs/CLEANUP-COMPLETE.md"
    mv "docs/CLEANUP-COMPLETE.md" docs/archive/design-fixes/
fi

# Move backup CSS files
echo ""
echo "Moving backup CSS files..."
for file in docs/backup-*.css; do
    if [ -f "$file" ]; then
        echo "  Moving: $file"
        mv "$file" docs/archive/css-backups/
    fi
done

# Summary
echo ""
echo "Cleanup Complete!"
echo "================"
echo ""
echo "Files have been organized into:"
echo "  - docs/archive/gallery-fixes/ (gallery-related fixes)"
echo "  - docs/archive/design-fixes/ (other fix attempts)"
echo "  - docs/archive/css-backups/ (CSS backup files)"
echo ""
echo "Next steps:"
echo "1. Review the cleanup summary: docs/CLEANUP-SUMMARY-2025.md"
echo "2. Test the new color system: http://localhost:8000/test/tactical-color-test.html"
echo "3. Continue with Phase 2 of the refactoring"
echo ""
echo "Note: Original CSS files in css/ directory are kept for now."
echo "They will be removed after the refactoring is complete and tested."