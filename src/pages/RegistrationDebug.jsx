import React, { useState, useEffect } from 'react';
import { supabase, registrationApi } from '../lib/supabase';

function RegistrationDebug() {
  const [data, setData] = useState({
    matches: [],
    competitors: [],
    registrations: [],
    matchStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Get all matches
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .order('date');

      // Get all competitors
      const { data: competitors } = await supabase
        .from('competitors')
        .select('*')
        .order('created_at', { ascending: false });

      // Get all registrations with details
      const { data: registrations } = await supabase
        .from('registrations')
        .select(`
          *,
          competitor:competitors(name, email, division),
          match:matches(name, date)
        `)
        .order('registered_at', { ascending: false });

      // Get match registration stats
      const { data: matchStats } = await supabase
        .from('match_registration_stats')
        .select('*');

      setData({ matches, competitors, registrations, matchStats });
    } catch (error) {
      console.error('Error loading debug data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading debug data...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Registration Debug Panel</h1>
      
      <div className="space-y-8">
        {/* Match Registration Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Match Registration Stats (View)</h2>
          <div className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left p-2">Match</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Registered</th>
                  <th className="text-left p-2">Capacity</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.matchStats.map(match => (
                  <tr key={match.id} className="border-b border-zinc-800">
                    <td className="p-2">{match.name}</td>
                    <td className="p-2">{new Date(match.date).toLocaleDateString()}</td>
                    <td className="p-2">{match.registered} / {match.capacity}</td>
                    <td className="p-2">{match.capacity}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        match.registration_status === 'full' ? 'bg-red-900/50 text-red-400' :
                        match.registration_status === 'filling' ? 'bg-orange-900/50 text-orange-400' :
                        'bg-green-900/50 text-green-400'
                      }`}>
                        {match.registration_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Registrations */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Registrations</h2>
          <div className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left p-2">Competitor</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Division</th>
                  <th className="text-left p-2">Match</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {data.registrations.slice(0, 10).map(reg => (
                  <tr key={reg.id} className="border-b border-zinc-800">
                    <td className="p-2">{reg.competitor?.name}</td>
                    <td className="p-2">{reg.competitor?.email}</td>
                    <td className="p-2">{reg.competitor?.division}</td>
                    <td className="p-2">{reg.match?.name}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        reg.status === 'confirmed' ? 'bg-green-900/50 text-green-400' :
                        reg.status === 'waitlist' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-2">{new Date(reg.registered_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Competitors */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Competitors</h2>
          <div className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Division</th>
                  <th className="text-left p-2">City</th>
                  <th className="text-left p-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.competitors.slice(0, 10).map(comp => (
                  <tr key={comp.id} className="border-b border-zinc-800">
                    <td className="p-2">{comp.name}</td>
                    <td className="p-2">{comp.email}</td>
                    <td className="p-2">{comp.division}</td>
                    <td className="p-2">{comp.city || '-'}</td>
                    <td className="p-2">{new Date(comp.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Raw Match Count Check */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Raw Registration Counts</h2>
          <div className="bg-zinc-900 p-4 rounded-lg">
            {data.matches.map(match => {
              const matchRegs = data.registrations.filter(r => r.match_id === match.id);
              return (
                <div key={match.id} className="mb-2">
                  <strong>{match.name}:</strong> {matchRegs.length} registrations
                  {matchRegs.length > 0 && (
                    <ul className="ml-4 text-sm text-zinc-400">
                      {matchRegs.map(r => (
                        <li key={r.id}>- {r.competitor?.name} ({r.status})</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-8">
        <button 
          onClick={loadAllData}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}

export default RegistrationDebug;