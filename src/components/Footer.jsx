import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="py-12 bg-zinc-900 border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/images/psr-logo.svg" 
                alt="PRS Iceland" 
                className="h-6 w-auto"
                style={{ filter: 'brightness(0) saturate(100%) invert(52%) sepia(93%) saturate(2969%) hue-rotate(9deg) brightness(101%) contrast(97%)' }}
              />
            </div>
            <p className="text-sm text-zinc-400">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks.title')}</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#matches" className="hover:text-zinc-50">{t('footer.quickLinks.matchRegistration')}</a></li>
              <li><a href="#standings" className="hover:text-zinc-50">{t('footer.quickLinks.standings')}</a></li>
              <li><a href="#" className="hover:text-zinc-50">{t('footer.quickLinks.members')}</a></li>
              <li><a href="#about" className="hover:text-zinc-50">{t('footer.quickLinks.about')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact.title')}</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>prs@prsiceland.is</li>
              <li>Stekkjarseli 7</li>
              <li>109 Reykjavík</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.social.title')}</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/prsiceland" 
                className="text-zinc-400 hover:text-zinc-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a 
                href="https://www.instagram.com/prsiceland" 
                className="text-zinc-400 hover:text-zinc-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
