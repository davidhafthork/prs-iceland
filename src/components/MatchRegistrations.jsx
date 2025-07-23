import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { registrationApi } from '../lib/supabase';

function MatchRegistrations({ match }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      loadRegistrations();
    }
  }, [expanded, match.id]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationApi.getForMatch(match.id);
      setRegistrations(data);
    } catch (error) {
      console.error('Error loading registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t border-zinc-800 pt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        <Users className="h-4 w-4" />
        <span>Sjá skráða keppendur ({match.registered || 0})</span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-zinc-500">Sæki lista...</p>
          ) : registrations.length === 0 ? (
            <p className="text-sm text-zinc-500">Enginn skráður ennþá</p>
          ) : (
            <div className="space-y-2">
              {registrations.map((reg, index) => (
                <div key={reg.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500">{index + 1}.</span>
                    <span>{reg.competitor?.name}</span>
                    <span className="text-zinc-500">({reg.competitor?.division})</span>
                  </div>
                  {reg.competitor?.city && (
                    <span className="text-zinc-500">{reg.competitor?.city}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MatchRegistrations;