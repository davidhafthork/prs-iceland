// Central content management
// All site content is managed here, completely separated from React components

export { heroContent } from './heroContent';
export { aboutContent } from './aboutContent';
export { statsContent } from './statsContent';
export { ctaContent } from './ctaContent';
export { matchesContent } from './matchesContent';
export { standingsContent } from './standingsContent';
export { footerContent } from './footerContent';
export { registrationContent } from './registrationContent';
export { upcomingMatches, pastMatches } from './matches';
export { currentStandings, divisionInfo } from './standings';

// This pattern allows us to:
// 1. Update content without touching React components
// 2. Easily implement i18n (internationalization) later
// 3. Connect to a CMS by just changing these exports
// 4. Test components with mock data
// 5. Keep components pure and focused on presentation
