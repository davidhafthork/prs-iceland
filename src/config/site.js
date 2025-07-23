// Site-wide configuration and constants
export const siteConfig = {
  name: 'PRS Iceland',
  tagline: 'Precision Rifle Series Iceland',
  description: 'Fremsta nákvæmnisskotfélag Íslands',
  email: 'prs@prsiceland.is',
  address: {
    street: 'Stekkjarseli 7',
    postalCode: '109',
    city: 'Reykjavík'
  },
  social: {
    facebook: 'https://www.facebook.com/prsiceland',
    instagram: 'https://www.instagram.com/prsiceland'
  },
  stats: {
    members: '150+',
    annualMatches: '24',
    yearsActive: '4',
    divisions: '3'
  }
};

// Navigation items
export const navigationItems = [
  { name: 'Mótaserían', href: '#matches' },
  { name: 'Úrslit & Stig', href: '#standings' },
  { name: 'Félagatal', href: '#members' },
  { name: 'Um PRS', href: '#about' }
];

// Hero images for different sections
export const images = {
  hero: '/images/prs-1-1024x682.jpg',
  about: '/images/prs-2-1024x1024.jpg',
  matches: '/images/prs-3-1024x566.jpg',
  logo: '/images/psr-logo.svg'
};
