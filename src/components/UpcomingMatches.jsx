import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { matchesApi } from '../lib/supabase';
import RegistrationModal from './RegistrationModal';

function UpcomingMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await matchesApi.getUpcoming();
      setMatches(data);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Gat ekki sótt upplýsingar um mót');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('is-IS', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getStatusBadge = (match) => {
    if (match.registered >= match.capacity) {
      return (
        <span className="px-3 py-1 bg-red-900/50 text-red-400 rounded-full text-sm">
          Fullt
        </span>
      );
    } else if (match.registration_status === 'filling') {
      return (
        <span className="px-3 py-1 bg-orange-900/50 text-orange-400 rounded-full text-sm">
          Að fyllast
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-sm">
          Opið
        </span>
      );
    }
  };

  if (loading) {
    return (
      <section id="matches" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-zinc-400">Sæki upplýsingar um mót...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="matches" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="matches" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Næstu mót</h2>
          <p className="text-xl text-zinc-400">Skráðu þig í komandi keppnir</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            {matches.length === 0 ? (
              <p className="text-zinc-400">Engin mót á dagskrá</p>
            ) : (
              matches.map((match) => (
                <div key={match.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{match.name}</h3>
                      <div className="space-y-2 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(match.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{match.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{match.registered || 0}/{match.capacity} keppendur</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(match)}
                    </div>
                  </div>
                  <button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={match.registered >= match.capacity}
                    onClick={() => {
                      setSelectedMatch(match);
                      setShowRegistrationModal(true);
                    }}
                  >
                    {match.registered >= match.capacity ? 'Mót fullt' : 'Skrá í mót'}
                  </button>
                </div>
              ))
            )}
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

      {showRegistrationModal && selectedMatch && (
        <RegistrationModal
          match={selectedMatch}
          onClose={() => {
            setShowRegistrationModal(false);
            setSelectedMatch(null);
          }}
          onSuccess={() => {
            // Reload matches to update registration count
            loadMatches();
          }}
        />
      )}
    </section>
  );
}

export default UpcomingMatches;