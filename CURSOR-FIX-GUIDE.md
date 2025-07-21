# Cursor Visibility Fix Guide - PRS Iceland

## The Problem
The dark theme makes the default black cursor nearly invisible, making navigation extremely difficult.

## Solutions Implemented

### 1. **CSS-Only Fix (Immediate Effect)**
Located in: `css/cursor-fix-simple.css`

This file:
- Uses crosshair cursor on HTML element for better visibility
- Adds hover animations on buttons
- Includes focus indicators for keyboard navigation
- Works immediately without JavaScript

### 2. **Enhanced JavaScript Cursor**
Located in: `js/cursor-enhancement.js`

Features:
- Adds a white circle that follows the cursor
- Changes size/color on hover over interactive elements
- Uses mix-blend-mode for maximum contrast
- Smooth animations for better tracking

### 3. **Inline Script (Quick Fix)**
Located in: `cursor-inline-fix.html`

Copy this script directly into any HTML page for immediate cursor visibility with:
- Custom white cursor with black outline
- Glowing effect on hover
- Optional cursor follower

## How to Apply

### Option 1: Already Applied (Recommended)
The CSS fix is already imported in `main.css`. Just clear your browser cache and reload.

### Option 2: Quick Test
Add this to any HTML page's `<head>`:
```html
<style>
    * { cursor: crosshair !important; }
    a, button { cursor: pointer !important; }
</style>
```

### Option 3: Maximum Visibility
Copy the entire content of `cursor-inline-fix.html` into your page's `<head>` section.

## Browser Compatibility

- **CSS cursors**: Work in all modern browsers
- **JavaScript enhancement**: Works in Chrome, Firefox, Safari, Edge
- **Mix-blend-mode**: Not supported in IE11 (falls back gracefully)

## Accessibility Notes

- High contrast mode automatically enabled with `prefers-contrast: high`
- Cursor enhancements disabled with `prefers-reduced-motion: reduce`
- Keyboard navigation indicators always visible

## Testing

1. Clear browser cache
2. Move cursor over dark backgrounds - should be clearly visible
3. Hover over buttons/links - should see color change or glow
4. Test keyboard navigation - should see blue focus outlines

## Customization

To adjust cursor visibility further, modify these CSS variables in `cursor-fix-simple.css`:
- Cursor type: Change `crosshair` to `default` or custom SVG
- Focus color: Adjust the blue color `rgba(59, 130, 246, 0.8)`
- Animation speed: Modify the `pulse-ring` animation duration

## Troubleshooting

If cursor is still hard to see:
1. Check browser zoom level (should be 100%)
2. Try enabling high contrast mode in your OS
3. Add `body { cursor: crosshair !important; }` to test
4. Use the inline script method for maximum control