# PRS Iceland

Official website for Precision Rifle Series Iceland - Iceland's premier precision rifle competition organization.

## 🎯 About

PRS Iceland organizes and manages precision rifle shooting competitions across Iceland. This website serves as the central hub for:
- Competition schedules and registration
- Current standings and results
- Member information
- News and updates about the sport

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/davidhafthork/prs-iceland.git

# Navigate to project directory
cd prs-iceland

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server  
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

## 🏗️ Architecture

This project uses a **content-first architecture** that separates content from presentation:

```
src/
├── components/        # Pure presentation components
│   ├── Header.jsx    # Navigation with PRS logo
│   ├── Hero.jsx      # Hero section
│   ├── Stats.jsx     # Statistics display
│   ├── About.jsx     # About section
│   ├── UpcomingMatches.jsx
│   ├── Standings.jsx # Competition standings
│   ├── CTA.jsx       # Call-to-action
│   └── Footer.jsx    # Site footer
├── data/             # All content as data
│   ├── index.js      # Central export point
│   ├── heroContent.js
│   ├── aboutContent.js
│   ├── matches.js    # Match data
│   ├── standings.js  # Competition data
│   └── ...           # Other content files
├── config/           # Configuration
│   ├── site.js       # Site metadata
│   └── ui.js         # UI behavior config
├── hooks/            # Custom React hooks
│   └── useContent.js # Content loading
└── App.jsx          # Main application
```

### Why Content-First?

1. **Separation of Concerns**: Content is completely separated from React components
2. **Easy Updates**: Change text without touching code
3. **Framework Agnostic**: Content can be reused with any framework
4. **CMS Ready**: Simple path to integrate with headless CMS
5. **Maintainable**: Non-developers can update content

### Example Usage

```javascript
// Content file (data/heroContent.js)
export const heroContent = {
  title: "Precision Rifle Series Iceland",
  subtitle: "Keppt á hæsta stigi nákvæmnisskotfimi"
}

// Component file (components/Hero.jsx)
import { heroContent } from '../data';

function Hero() {
  return <h1>{heroContent.title}</h1>
}
```

## 📝 Content Management

All site content lives in `/src/data/`:

- **Text Content**: Hero text, about descriptions, CTAs
- **Match Data**: Upcoming and past competitions
- **Standings**: Current competition rankings
- **Configuration**: Navigation, theme, feature flags

To update content:
1. Navigate to `/src/data/`
2. Find the relevant content file
3. Update the JavaScript object
4. Save and see changes instantly

## 🎨 Customization

### Theme
Edit `/src/config/ui.js`:
```javascript
export const themeConfig = {
  colors: {
    primary: 'orange-500',
    background: 'zinc-950'
  }
}
```

### Navigation
Update navigation items in `/src/config/ui.js`:
```javascript
export const navigationConfig = {
  items: [
    { name: 'Mótaserían', href: '#matches' },
    // Add more items
  ]
}
```

### Feature Flags
Enable/disable features in `/src/config/ui.js`:
```javascript
export const featureFlags = {
  enableRegistration: true,
  showUpcomingMatches: true
}
```

## 📄 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🚢 Deployment

Build the project for production:

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## 📧 Contact

- **Email**: prs@prsiceland.is
- **Address**: Stekkjarseli 7, 109 Reykjavík

## 📚 Project Documentation

### For Developers/AI Assistants

**⚠️ IMPORTANT**: Read `/docs/DEVELOPMENT.md` before making ANY changes.

This is a PRODUCTION system. All development guidelines, current state, and pending features are documented there.

### Current Status

✅ **Working Features**:
- Supabase database integration
- Live competition data on homepage
- Admin panel for match management
- Automatic standings calculation

🚧 **Pending Features**:
- Authentication for admin access
- Competitor registration form
- Email notifications
- Production deployment

## 🔮 Future Enhancements

The content-first architecture enables:
- **CMS Integration**: Connect to Strapi, Contentful, etc.
- **Internationalization**: Add English translations
- **A/B Testing**: Test different content variants
- **Dynamic Loading**: Fetch content from APIs
- **Member Portal**: Add authentication and user features

## 📄 License

This project is proprietary software owned by PRS Iceland.

---

*Precision Rifle Series Iceland - Competing at the highest level*