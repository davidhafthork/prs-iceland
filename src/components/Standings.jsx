import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { standingsApi } from '../lib/supabase';

function Standings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStandings();
  }, []);

  const loadStandings = async () => {
    try {
      setLoading(true);
      const data = await standingsApi.getCurrent();
      setStandings(data);
    } catch (err) {
      console.error('Error loading standings:', err);
      setError('Gat ekki sótt stigastöðu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="standings" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-zinc-400">Sæki stigastöðu...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="standings" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="standings" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-10 w-10 text-orange-500 mr-3" />
            <h2 className="text-4xl font-bold">Stigastaða</h2>
          </div>
          <p className="text-xl text-zinc-400">2025 PRS Iceland Mótaseríu</p>
        </div>

        <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="text-left p-4">Sæti</th>
                  <th className="text-left p-4">Keppandi</th>
                  <th className="text-left p-4">Flokkur</th>
                  <th className="text-right p-4">Stig</th>
                  <th className="text-right p-4">%</th>
                  <th className="text-right p-4">Mót</th>
                </tr>
              </thead>
              <tbody>
                {standings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-zinc-400">
                      Engin stigastaða til
                    </td>
                  </tr>
                ) : (
                  standings.slice(0, 10).map((shooter) => (
                    <tr key={shooter.rank} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                      <td className="p-4">
                        <span className={`font-medium ${
                          shooter.rank === 1 ? 'text-yellow-500' :
                          shooter.rank === 2 ? 'text-zinc-400' :
                          shooter.rank === 3 ? 'text-orange-600' : ''
                        }`}>
                          {shooter.rank}
                        </span>
                      </td>
                      <td className="p-4">{shooter.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-sm ${
                          shooter.division === 'Open' ? 'bg-blue-900/50 text-blue-400' :
                          shooter.division === 'Production' ? 'bg-green-900/50 text-green-400' :
                          'bg-purple-900/50 text-purple-400'
                        }`}>
                          {shooter.division}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-green-500">
                        {shooter.points?.toFixed(2) || '0.00'}
                      </td>
                      <td className="p-4 text-right">{shooter.percentage || '0%'}</td>
                      <td className="p-4 text-right text-zinc-400">
                        {shooter.matches_completed || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {standings.length > 10 && (
            <div className="p-4 bg-zinc-800/50 text-center">
              <button className="text-orange-500 hover:text-orange-400 font-medium">
                Sjá heildarstigastöðu ({standings.length} keppendur) →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Standings;