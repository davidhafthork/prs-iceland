import React from 'react';
import { Target, Users, Award, MapPin } from 'lucide-react';

function About() {
  const features = [
    {
      icon: Target,
      title: 'Nákvæmnisskotkeppni',
      description: 'Keppt á vegalengdum frá 100-1000 metrum með nákvæmum riffli'
    },
    {
      icon: Users,
      title: 'Öflugt félag',
      description: 'Yfir 150 virkir félagar úti um allt land'
    },
    {
      icon: Award,
      title: 'Alþjóðleg viðurkenning',
      description: 'Hluti af alþjóðlega PRS samfélginu'
    },
    {
      icon: MapPin,
      title: 'Mót um allt land',
      description: 'Keppt á völlunum beggja vegna landsins'
    }
  ];

  return (
    <section id="about" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Um PRS Iceland</h2>
            <p className="text-lg text-zinc-300 mb-8">
              Precision Rifle Series Iceland er íslenska útgáfan af alþjóðlegu PRS mótaseríunni. 
              Við bjóðum upp á krefjandi og skemmtilegar keppnir þar sem skotmenn takast á við 
              mismunandi aðstæður og vegalengdir.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <Icon className="h-8 w-8 text-orange-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-zinc-400">{feature.description}</p>
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
