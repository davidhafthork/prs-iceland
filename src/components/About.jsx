import React from 'react';
import { Target, Users, Award, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Target,
      titleKey: 'about.features.competitions.title',
      descriptionKey: 'about.features.competitions.description'
    },
    {
      icon: Users,
      titleKey: 'about.features.community.title',
      descriptionKey: 'about.features.community.description'
    },
    {
      icon: Award,
      titleKey: 'about.features.recognition.title',
      descriptionKey: 'about.features.recognition.description'
    },
    {
      icon: MapPin,
      titleKey: 'about.features.coverage.title',
      descriptionKey: 'about.features.coverage.description'
    }
  ];

  return (
    <section id="about" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">{t('about.title')}</h2>
            <p className="text-lg text-zinc-300 mb-8">
              {t('about.description')}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <Icon className="h-8 w-8 text-orange-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">{t(feature.titleKey)}</h3>
                      <p className="text-sm text-zinc-400">{t(feature.descriptionKey)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="relative h-96 lg:h-full rounded-lg overflow-hidden">
            <img 
              src="/images/prs-2-1024x1024.jpg" 
              alt="PRS Competition" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
