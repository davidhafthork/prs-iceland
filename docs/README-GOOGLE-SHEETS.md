# PRS Iceland - Google Sheets Integration Guide

## Overview
This guide explains how to integrate Google Sheets data into the PRS Iceland website. We've created several methods to fetch and display data elegantly while maintaining the site's design consistency.

## Quick Start

### 1. Publishing Your Google Sheet
1. Open your Google Sheet
2. Go to **File → Publish to web**
3. Choose either:
   - **Web page** format for embedding
   - **CSV** format for data fetching
4. Click **Publish**

### 2. Integration Methods

#### Method A: Direct Embed (Simplest)
Perfect for: Documents that need to maintain their original formatting

```html
<iframe src="YOUR_PUBLISHED_SHEET_URL" 
        width="100%" 
        height="600"
        style="border: none;">
</iframe>
```

#### Method B: CSV Data Fetch (Recommended)
Perfect for: Event schedules, results tables, member lists

```javascript
// Use the provided GoogleSheetsHelper
const helper = new GoogleSheetsHelper();
const data = await helper.fetchSheetData(YOUR_SHEET_URL);
```

#### Method C: Custom Table Display
Perfect for: Data that needs custom styling or filtering

```javascript
// See arsyfirlit.html for a complete example
```

## Site Navigation

All pages now include consistent navigation:
- **Header**: Fixed navigation bar with logo and menu (matches main site)
- **Logo**: Always links back to home page (index.html)
- **Breadcrumb**: Shows current page location with back link
- **Current Page Indicator**: Active menu items are highlighted in orange

### Creating New Pages
When creating new pages, use the template (`template-google-docs.html`) which includes:
- Pre-configured header navigation
- Proper spacing for fixed header
- Responsive mobile menu
- Print-friendly styles

## File Structure

```
prs-iceland-improved/
├── index.html      # Main website
├── arsyfirlit.html         # Annual schedule page (example)
├── google-sheets-demo.html # Integration examples
├── js/
│   ├── google-sheets-helper.js  # Utility for fetching data
│   └── data-config.js          # Configuration for data sources
```

## Adding a New Data Page

1. **Create the HTML page**:
   ```bash
   Copy arsyfirlit.html as a template
   ```

2. **Update data-config.js**:
   ```javascript
   urslit2024: {
       url: 'YOUR_GOOGLE_SHEET_URL',
       type: 'googleSheets',
       columns: [
           { key: 'date', label: 'Dagsetning', type: 'date' },
           // ... more columns
       ]
   }
   ```

3. **Link from main navigation**:
   Update the dropdown menu in index.html

## Troubleshooting

### CORS Errors
If you get CORS errors when fetching data:
1. Make sure the sheet is properly published
2. The GoogleSheetsHelper includes a CORS proxy fallback
3. Consider using the embed method instead

### Data Not Updating
- Google Sheets can cache published data for up to 5 minutes
- Force refresh by republishing the sheet
- Add a timestamp parameter to bypass cache: `?t=${Date.now()}`

### Styling Issues
- All tables use consistent styling from the main site
- Customize colors in the CSS variables
- Mobile responsive by default

## Examples

### Event Schedule (Ársyfirlit)
- **URL**: arsyfirlit.html
- **Data Source**: Google Sheet with columns: Date, Event, Type, Location, Info
- **Features**: Filtering by event type, responsive table, fallback embed

### Competition Results
- **Template**: Use arsyfirlit.html as base
- **Customize**: Update columns for rankings, scores, participants
- **Add**: Sorting functionality for results

### Member Directory
- **Privacy**: Consider if data should be public
- **Features**: Search functionality, category filters
- **Display**: Card layout instead of table for better mobile view

## Best Practices

1. **Always have a fallback**: Show the embedded sheet if data fetch fails
2. **Loading states**: Show spinner while fetching data
3. **Error handling**: Display user-friendly error messages in Icelandic
4. **Performance**: Cache data for 5-10 minutes to reduce API calls
5. **Accessibility**: Ensure tables are screen-reader friendly
6. **Mobile first**: Test on mobile devices

## Need Help?

1. Check the demo page: `google-sheets-demo.html`
2. Look at working example: `arsyfirlit.html`
3. Review helper functions: `js/google-sheets-helper.js`

## Future Enhancements

- [ ] Add data caching to reduce API calls
- [ ] Create admin interface for updating sheet URLs
- [ ] Add more visualization options (charts, graphs)
- [ ] Implement real-time updates via Google Sheets API
- [ ] Add export functionality (PDF, Excel)

---

*For questions or issues, contact the PRS Iceland web team.*