import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navigationConfig } from '../config/ui';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sort navigation items by order
  const navItems = [...navigationConfig.items].sort((a, b) => a.order - b.order);
  const desktopItems = navItems.filter(item => item.showInDesktop);
  const mobileItems = navItems.filter(item => item.showInMobile);

  // Smooth scroll handler
  const handleSmoothScroll = (e, href) => {
    // Only handle hash links
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        // Get the header height for offset
        const headerHeight = 64; // h-16 = 4rem = 64px
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      // Close mobile menu if open
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href={navigationConfig.logo.href} className="flex items-center">
              <img 
                src={navigationConfig.logo.src} 
                alt={navigationConfig.logo.alt} 
                className="h-8 w-auto"
                style={{ filter: navigationConfig.logo.colorFilter }}
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex space-x-8">
                {desktopItems.map((item) => (
                  <li key={item.name}>
                    <a 
                      href={item.href} 
                      className="hover:text-orange-500 transition-colors"
                      onClick={(e) => handleSmoothScroll(e, item.href)}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA Button */}
            {navigationConfig.cta.showInDesktop && (
              <div className="hidden lg:block">
                <a 
                  href={navigationConfig.cta.href}
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-md font-medium transition-colors"
                  onClick={(e) => handleSmoothScroll(e, navigationConfig.cta.href)}
                >
                  {navigationConfig.cta.text}
                </a>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950 pt-16">
          <nav className="container mx-auto px-4 py-8">
            <ul className="space-y-4">
              {mobileItems.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-lg"
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
              {navigationConfig.mobileMenu.showCTA && (
                <li className="pt-4">
                  <a 
                    href={navigationConfig.cta.href}
                    className="block w-full bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-md font-medium text-center"
                    onClick={(e) => handleSmoothScroll(e, navigationConfig.cta.href)}
                  >
                    {navigationConfig.cta.text}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}

export default Header;
