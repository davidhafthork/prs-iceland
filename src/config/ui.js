// UI Configuration separated from components
// This allows changing UI behavior without touching React code

export const navigationConfig = {
  // Main navigation items
  items: [
    { 
      name: 'Mótaserían', 
      href: '#matches',
      order: 1,
      showInMobile: true,
      showInDesktop: true
    },
    { 
      name: 'Úrslit & Stig', 
      href: '#standings',
      order: 2,
      showInMobile: true,
      showInDesktop: true
    },
    { 
      name: 'Félagatal', 
      href: '#members',
      order: 3,
      showInMobile: true,
      showInDesktop: true
    },
    { 
      name: 'Um PRS', 
      href: '#about',
      order: 4,
      showInMobile: true,
      showInDesktop: true
    }
  ],
  
  // CTA button configuration
  cta: {
    text: 'Skrá í mót',
    href: '#matches',
    style: 'primary', // primary, secondary, outline
    showInMobile: false,
    showInDesktop: true
  },
  
  // Mobile menu configuration
  mobileMenu: {
    breakpoint: 1024, // lg breakpoint
    animationType: 'slide', // slide, fade, none
    showCTA: true
  },
  
  // Logo configuration
  logo: {
    src: '/images/psr-logo.svg',
    alt: 'PRS Iceland',
    height: '32px',
    href: '/',
    // SVG color filter for orange
    colorFilter: 'brightness(0) saturate(100%) invert(52%) sepia(93%) saturate(2969%) hue-rotate(9deg) brightness(101%) contrast(97%)'
  }
};

// Theme configuration
export const themeConfig = {
  colors: {
    primary: 'orange-500',
    primaryHover: 'orange-600',
    background: 'zinc-950',
    surface: 'zinc-900',
    border: 'zinc-800',
    text: {
      primary: 'zinc-50',
      secondary: 'zinc-300',
      muted: 'zinc-400'
    }
  },
  
  spacing: {
    section: 'py-20',
    container: 'container mx-auto px-4',
    componentGap: 'gap-8'
  },
  
  animations: {
    transition: 'transition-colors',
    duration: 'duration-200',
    hover: 'hover:scale-105'
  }
};

// Layout configuration
export const layoutConfig = {
  header: {
    fixed: true,
    height: '64px', // h-16
    background: 'bg-zinc-950/90',
    blur: true,
    border: true
  },
  
  sections: {
    hero: { enabled: true, order: 1 },
    stats: { enabled: true, order: 2 },
    about: { enabled: true, order: 3 },
    matches: { enabled: true, order: 4 },
    standings: { enabled: true, order: 5 },
    cta: { enabled: true, order: 6 }
  },
  
  footer: {
    columns: 4,
    showSocial: true,
    showCopyright: true
  }
};

// Feature flags
export const featureFlags = {
  enableRegistration: true,
  showUpcomingMatches: true,
  showPastMatches: false,
  enableMemberLogin: false,
  showLiveScoring: false,
  enableNewsletter: false,
  showSponsors: false
};

// SEO configuration
export const seoConfig = {
  defaultTitle: 'PRS Iceland - Precision Rifle Series',
  titleTemplate: '%s | PRS Iceland',
  description: 'Fremsta nákvæmnisskotfélag Íslands. Keppt á hæsta stigi í precision rifle shooting.',
  keywords: ['PRS', 'precision rifle', 'shooting', 'Iceland', 'skotfimi', 'keppni'],
  openGraph: {
    type: 'website',
    locale: 'is_IS',
    site_name: 'PRS Iceland'
  }
};
