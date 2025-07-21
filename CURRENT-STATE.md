# Current State Documentation - PRS Iceland
*Generated: 2025-01-21*

## Active Production Pages
- `pages/index.html` - Main tournament platform page (PRODUCTION)
- `pages/arsyfirlit.html` - Calendar page (PRODUCTION)

## CSS Files Currently Imported (via main.css)
Based on main.css import order:
1. `cohesive-design-system.css` - Modern dark theme system
2. `base.css` - Base styles and CSS reset
3. `header-clean.css` - Clean minimal header (NOT header.css)
4. `hero.css` - Hero section styles
5. `about.css` - About section styles
6. `gallery.css` - Gallery component
7. `footer.css` - Footer styles
8. `pages.css` - Page-specific styles
9. `gallery-fix.css` - Gallery fixes
10. `hero-split.css` - Hero split screen variant
11. `enhanced-design.css` - Enhanced design system
12. `design-fixes.css` - Design fixes and color consistency
13. `responsive.css` - Responsive styles
14. `color-fix-override.css` - TEMPORARY color fix override
15. `final-design-fix.css` - FINAL dark theme fix
16. `cursor-visibility.css` - CRITICAL cursor visibility fix
17. `animations-simple.css` - Clean animations
18. `tournament-data.css` - Tournament tables and data

## Unused/Legacy CSS Files
- `header.css` - Old animated header (replaced by header-clean.css)
- `tactical-design-system.css` - Not imported in main.css
- `header-tactical.css` - Not imported
- `hero-tactical.css` - Not imported
- `cursor-fix.css` - Legacy cursor fix
- `cursor-fix-simple.css` - Legacy cursor fix
- `tournament-platform-inline.css` - Appears to be unused

## Known Issues to Address
- [ ] Multiple overlapping color systems across files
- [ ] Inline styles in index.html (tournament section)
- [ ] Multiple "fix" files indicating patches over patches
- [ ] Dead code in comments throughout CSS files
- [ ] Duplicate CSS variable definitions

## Color System Confusion
Currently defining colors in:
- cohesive-design-system.css
- base.css
- enhanced-design.css
- design-fixes.css
- color-fix-override.css
- final-design-fix.css

All need to be consolidated to a single source of truth.

## JavaScript Files
(To be audited in next phase)

## Test Pages (Non-Production)
- `clean-design-test.html`
- `color-test.html`
- `cursor-test.html`
- `design-test.html`
- `index-fixed.html`
- `index-old.html`
- `index-simple-gallery.html`