import React from 'react';

function Footer() {
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
              Fremsta nákvæmnisskotfélag Íslands
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Flýtileiðir</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#matches" className="hover:text-zinc-50">Skráning í mót</a></li>
              <li><a href="#standings" className="hover:text-zinc-50">Stigastaða</a></li>
              <li><a href="#" className="hover:text-zinc-50">Félagatal</a></li>
              <li><a href="#about" className="hover:text-zinc-50">Um félagið</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Samband</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>prs@prsiceland.is</li>
              <li>Stekkjarseli 7</li>
              <li>109 Reykjavík</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Fylgdu okkur</h4>
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
          <p>&copy; 2025 PRS Iceland. Allur réttur áskilinn.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
