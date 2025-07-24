import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { heroContent } from '../data/heroContent';

function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroContent.backgroundImage} 
          alt="Precision Rifle Competition" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            {t('hero.title.line1')}
            <span className="block text-orange-500">{t('hero.title.line2')}</span>
          </h1>
          <p className="text-xl lg:text-2xl text-zinc-300 mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={heroContent.cta.primary.href}
              className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              {t('hero.registerNextMatch')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
            <a 
              href={heroContent.cta.secondary.href}
              className="border border-zinc-600 hover:bg-zinc-900 px-8 py-3 rounded-md font-medium transition-colors text-center"
            >
              {t('hero.viewStandings')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
