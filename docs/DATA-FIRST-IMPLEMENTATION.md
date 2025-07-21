# PRS Iceland - Data-First Implementation Guide

## Overview
This guide details how to transform PRS Iceland into a data-first tournament platform following the research findings.

## 1. Google Sheets Integration

### Option A: Using Sheety (Recommended for Quick Start)
1. **Setup Sheety Account**
   - Go to https://sheety.co/
   - Sign in with Google account
   - Create new project from your Google Sheets

2. **Prepare Your Google Sheets**
   ```
   Sheet 1: Standings
   | Rank | Name | Division | Match1 | Match2 | Match3 | Total | Average |
   
   Sheet 2: Schedule
   | Date | Match | Location | Series | Status | MaxSlots | Registered |
   
   Sheet 3: Results
   | Match | Date | Winner | Division | Score | Link |
   ```

3. **API Implementation**
   ```javascript
   const SHEETY_API = 'https://api.sheety.co/YOUR_PROJECT_ID/';
   
   async function loadStandings() {
     const response = await fetch(SHEETY_API + 'standings');
     const data = await response.json();
     return data.standings;
   }
   ```

### Option B: Direct Google Sheets API
1. **Enable Google Sheets API**
   - Go to Google Cloud Console
   - Create new project
   - Enable Sheets API
   - Create service account credentials

2. **Implementation**
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID';
   const API_KEY = 'YOUR_API_KEY';
   const RANGE = 'Standings!A2:H100';
   
   async function loadFromSheets() {
     const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
     const response = await fetch(url);
     const data = await response.json();
     return data.values;
   }
   ```

## 2. Registration System Integration

### Recommended Platform: Jersey Watch
- **Cost**: $29/month
- **Features**: Multi-step forms, payment processing, roster management
- **Setup**:
  1. Create account at jerseywatch.com
  2. Configure tournament structure
  3. Embed registration widget:
  ```html
  <div id="jw-registration" data-event-id="YOUR_EVENT_ID"></div>
  <script src="https://jerseywatch.com/embed.js"></script>
  ```

### Alternative: Race Roster
- Better for larger events
- More expensive but more features
- API integration available

## 3. Content Management (Blog/News)

### Headless CMS Setup with Storyblok
1. **Create Storyblok Space**
   - Define content types: News, Match Reports, Player Profiles
   - Set up visual editor

2. **API Integration**
   ```javascript
   const storyblokApi = new StoryblokClient({
     accessToken: 'YOUR_ACCESS_TOKEN',
     cache: {
       clear: 'auto',
       type: 'memory'
     }
   });
   
   async function getLatestNews() {
     const { data } = await storyblokApi.get('cdn/stories', {
       version: 'published',
       starts_with: 'news/',
       per_page: 3
     });
     return data.stories;
   }
   ```

## 4. Image Optimization Pipeline

### Cloudflare Images Setup
1. **Enable Cloudflare Images**
   - $5/month for 100,000 images
   - Automatic AVIF/WebP conversion

2. **Implementation**
   ```html
   <picture>
     <source srcset="https://imagedelivery.net/YOUR_ID/IMAGE_ID/avif" type="image/avif">
     <source srcset="https://imagedelivery.net/YOUR_ID/IMAGE_ID/webp" type="image/webp">
     <img src="https://imagedelivery.net/YOUR_ID/IMAGE_ID/public" 
          alt="Description" 
          loading="lazy"
          width="1024"
          height="768">
   </picture>
   ```

## 5. Progressive Enhancement Strategy

### Phase 1: Core Data Integration (Week 1-2)
- [ ] Set up Google Sheets with tournament data
- [ ] Implement Sheety/API connection
- [ ] Create data display components
- [ ] Test real-time updates

### Phase 2: Registration System (Week 3)
- [ ] Choose and configure registration platform
- [ ] Create registration pages
- [ ] Test payment processing
- [ ] Link to member database

### Phase 3: Content Management (Week 4)
- [ ] Set up headless CMS
- [ ] Migrate existing content
- [ ] Create content templates
- [ ] Train content editors

### Phase 4: Performance Optimization (Week 5)
- [ ] Implement image CDN
- [ ] Convert images to modern formats
- [ ] Add lazy loading
- [ ] Optimize data caching

## 6. Data Display Components

### Standings Table Component
```javascript
class StandingsTable {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.data = [];
    this.filters = {
      division: 'all',
      series: 'prs'
    };
  }
  
  async load() {
    this.data = await loadStandings();
    this.render();
  }
  
  render() {
    const filtered = this.filterData();
    const html = this.generateTableHTML(filtered);
    this.container.innerHTML = html;
  }
  
  filterData() {
    return this.data.filter(row => {
      if (this.filters.division !== 'all' && row.division !== this.filters.division) {
        return false;
      }
      return true;
    });
  }
}
```

## 7. SEO & Performance Checklist

- [ ] Add structured data for sports events
- [ ] Implement proper meta tags
- [ ] Set up Google Analytics 4
- [ ] Configure performance monitoring
- [ ] Add sitemap generation
- [ ] Implement breadcrumbs
- [ ] Add Open Graph tags

## 8. Mobile Optimization

### Touch-Friendly Tables
```css
@media (max-width: 768px) {
  .standings-table {
    font-size: 14px;
  }
  
  .standings-table table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .standings-table th,
  .standings-table td {
    white-space: nowrap;
    padding: 12px 16px;
  }
}
```

## 9. Real-Time Updates

### WebSocket Integration (Advanced)
```javascript
const ws = new WebSocket('wss://your-server/live-scores');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  updateStandingsRow(update.shooterId, update.newScore);
};
```

### Polling Alternative (Simpler)
```javascript
setInterval(async () => {
  const newData = await loadStandings();
  if (JSON.stringify(newData) !== JSON.stringify(currentData)) {
    updateTable(newData);
    showUpdateNotification();
  }
}, 30000); // Check every 30 seconds
```

## 10. Analytics & Tracking

### Google Analytics 4 Events
```javascript
// Track match registrations
gtag('event', 'registration_complete', {
  'match_name': matchName,
  'division': division,
  'value': registrationFee
});

// Track data interactions
gtag('event', 'view_standings', {
  'filter_division': currentDivision,
  'filter_series': currentSeries
});
```

## Next Steps

1. **Immediate Actions**
   - Create Google Sheets with sample data
   - Test Sheety integration
   - Update navigation structure

2. **Short Term (1-2 weeks)**
   - Implement full data integration
   - Set up registration system
   - Optimize images

3. **Long Term (1 month)**
   - Launch headless CMS
   - Add advanced features
   - Implement real-time updates

## Support Resources

- Sheety Documentation: https://sheety.co/docs
- Google Sheets API: https://developers.google.com/sheets/api
- Jersey Watch API: https://jerseywatch.com/api-docs
- Storyblok Docs: https://www.storyblok.com/docs

Remember: Start simple, test thoroughly, and iterate based on user feedback!
