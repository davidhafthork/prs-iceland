# CSS Audit Tools Guide

## Created: 2025-01-21

Two audit tools have been created to analyze the CSS architecture before refactoring:

### 1. Browser-Based Audit Tool
**Location:** `debug/css-audit.html`

**How to use:**
1. Open `debug/css-audit.html` in a web browser
2. The tool will automatically analyze all loaded CSS files
3. View the report showing:
   - Total CSS files, rules, and selectors
   - Duplicate CSS variables that need consolidation
   - Duplicate selectors across files
   - Color usage analysis with visual swatches

**Benefits:**
- No setup required
- Visual color analysis
- Real-time analysis of actual loaded styles
- Shows exactly what the browser sees

### 2. Node.js Deep Analysis Script
**Location:** `audit/analyze-css.js`

**How to use:**
```bash
cd audit
node analyze-css.js
```

**Output files:**
- `audit/css-analysis-report.txt` - Human-readable report
- `audit/css-analysis-data.json` - Machine-readable data

**What it analyzes:**
- Import chain from main.css
- File sizes and complexity
- Commented vs active code ratio
- Duplicate variables with different values
- Duplicate selectors across files
- Per-file statistics

## Key Findings to Look For

1. **Multiple Color Definitions**
   - Variables like `--primary-color` defined in multiple files
   - Different values for the same color concept

2. **Redundant Selectors**
   - Same selectors in multiple files
   - Opportunity to consolidate

3. **Dead Code**
   - High comment-to-code ratio
   - Unused CSS files not imported

4. **Import Order Issues**
   - Files that override each other
   - "Fix" files at the end of import chain

## Next Steps After Analysis

1. Review duplicate variables → Create single source of truth
2. Identify truly used vs unused files
3. Map component boundaries for new architecture
4. Plan consolidation strategy based on findings