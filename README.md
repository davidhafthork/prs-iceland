# PRS Iceland

Official website for Precision Rifle Series Iceland - Iceland's premier precision rifle competition organization.

## About

PRS Iceland organizes and manages precision rifle shooting competitions across Iceland. This website serves as the central hub for:
- Competition schedules and registration
- Current standings and results
- Member information
- News and updates about the sport

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

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

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
prs-iceland/
├── src/
│   ├── App.jsx        # Main application component
│   ├── main.jsx       # Application entry point
│   └── index.css      # Global styles and Tailwind imports
├── public/            # Static assets
├── index.html         # HTML template
└── [config files]     # Vite, Tailwind, PostCSS, ESLint configs
```

## Features

- **Responsive Design** - Mobile-first approach with desktop optimization
- **Dark Theme** - Modern dark UI with orange accent colors
- **Competition Standings** - Live rankings and scoring
- **Match Registration** - Easy signup for upcoming competitions
- **Member Portal** - Access for registered shooters
- **Bilingual Support** - Icelandic primary with English considerations

## Development

The site uses Tailwind CSS for styling with a custom color scheme:
- Primary: Orange (`orange-500`)
- Background: Dark (`zinc-950`)
- Text: Light (`zinc-50`)

## Deployment

Build the project for production:

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## Contact

- **Email**: prs@prsiceland.is
- **Address**: Stekkjaseli 7, 109 Reykjavík

## License

This project is proprietary software owned by PRS Iceland.

---

*Precision Rifle Series Iceland - Competing at the highest level*