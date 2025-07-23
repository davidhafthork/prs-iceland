import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { upcomingMatches } from '../data/matches';

function UpcomingMatches() {

  return (
    <section id="matches" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Næstu mót</h2>
          <p className="text-xl text-zinc-400">Skráðu þig í komandi keppnir</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            {upcomingMatches.map((match, index) => (
              <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{match.name}</h3>
                    <div className="space-y-2 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{match.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{match.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{match.capacity}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {match.status === 'open' && (
                      <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-sm">
                        Opið
                      </span>
                    )}
                    {match.status === 'filling' && (
                      <span className="px-3 py-1 bg-orange-900/50 text-orange-400 rounded-full text-sm">
                        Að fyllast
                      </span>
                    )}
                  </div>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium transition-colors">
                  Skrá í mót
                </button>
              </div>
            ))}
          </div>
          
          <div className="relative h-96 lg:h-full rounded-lg overflow-hidden">
            <img 
              src="/images/prs-3-1024x566.jpg" 
              alt="PRS Match" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xl font-semibold mb-2">Ertu tilbúinn í áskorun?</p>
              <p className="text-zinc-300">Skráðu þig í næsta mót og taktu þátt í spennandi keppni</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UpcomingMatches;
