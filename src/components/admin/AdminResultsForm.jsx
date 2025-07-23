import React, { useState, useEffect } from 'react';
import { Trophy, Save, Calculator, Edit3 } from 'lucide-react';
import { matchesApi, registrationApi, resultsApi } from '../../lib/supabase';

function AdminResultsForm() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [results, setResults] = useState({});
  const [maxScore, setMaxScore] = useState(300); // Default max score
  const [useManualPoints, setUseManualPoints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      loadRegistrations(selectedMatch);
    }
  }, [selectedMatch]);

  const loadMatches = async () => {
    try {
      const data = await matchesApi.getUpcoming();
      // Include ongoing matches that need results
      const ongoingData = data.filter(m => m.status === 'ongoing' || m.status === 'upcoming');
      setMatches(ongoingData);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const loadRegistrations = async (matchId) => {
    try {
      const data = await registrationApi.getForMatch(matchId);
      setRegistrations(data);
      // Initialize results object
      const initialResults = {};
      data.forEach(reg => {
        initialResults[reg.competitor_id] = {
          score: '',
          percentage: '',
          points: ''
        };
      });
      setResults(initialResults);
    } catch (error) {
      console.error('Error loading registrations:', error);
    }
  };

  const calculatePercentage = (score) => {
    if (!score || !maxScore) return '';
    return ((parseFloat(score) / maxScore) * 100).toFixed(2);
  };

  const calculatePoints = (position, totalCompetitors) => {
    // Points based on position: 1st gets 100, 2nd gets 95, 3rd gets 92, etc.
    const basePoints = {
      1: 100,
      2: 95,
      3: 92,
      4: 90,
      5: 88,
      6: 86,
      7: 84,
      8: 82,
      9: 80,
      10: 78
    };
    
    if (position <= 10) {
      return basePoints[position];
    } else {
      // After 10th place, decrease by 2 points per position
      return Math.max(0, 78 - ((position - 10) * 2));
    }
  };

  const handleScoreChange = (competitorId, value) => {
    const score = value;
    const percentage = calculatePercentage(score);
    
    setResults(prev => ({
      ...prev,
      [competitorId]: {
        ...prev[competitorId],
        score: score,
        percentage: percentage,
        // Keep existing points if manual, otherwise it will be calculated on submit
        points: useManualPoints ? prev[competitorId].points : ''
      }
    }));
  };

  const handleManualPointsChange = (competitorId, value) => {
    setResults(prev => ({
      ...prev,
      [competitorId]: {
        ...prev[competitorId],
        points: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Sort competitors by score to determine positions
      const sortedResults = Object.entries(results)
        .filter(([_, result]) => result.score)
        .sort((a, b) => parseFloat(b[1].score) - parseFloat(a[1].score));

      // Prepare results data with calculated points if not using manual
      const resultsData = sortedResults.map(([competitorId, result], index) => {
        const position = index + 1;
        const points = useManualPoints 
          ? parseFloat(result.points) 
          : calculatePoints(position, sortedResults.length);

        return {
          match_id: selectedMatch,
          competitor_id: competitorId,
          score: parseFloat(result.score),
          percentage: parseFloat(result.percentage),
          points: points
        };
      });

      await resultsApi.addResults(selectedMatch, resultsData);
      setMessage({ type: 'success', text: 'Úrslit vistuð!' });
      
      // Reset form
      setSelectedMatch('');
      setRegistrations([]);
      setResults({});
      loadMatches(); // Reload to update status
    } catch (error) {
      console.error('Error saving results:', error);
      setMessage({ type: 'error', text: 'Villa við að vista úrslit' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 md:h-6 md:w-6" />
          Skrá úrslit móts
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Veldu mót
              </label>
              <select
                value={selectedMatch}
                onChange={(e) => setSelectedMatch(e.target.value)}
                required
                className="w-full px-3 md:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500 text-sm md:text-base"
              >
                <option value="">-- Veldu mót --</option>
                {matches.map(match => (
                  <option key={match.id} value={match.id}>
                    {match.name} - {new Date(match.date).toLocaleDateString('is-IS')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Hámarksstig í móti
              </label>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(parseInt(e.target.value))}
                className="w-full px-3 md:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500 text-sm md:text-base"
                placeholder="300"
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="manualPoints"
              checked={useManualPoints}
              onChange={(e) => setUseManualPoints(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-800 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="manualPoints" className="text-sm text-zinc-400 flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Slá inn punkta handvirkt (annars reiknað eftir sæti)
            </label>
          </div>

          {registrations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base md:text-lg font-semibold">Keppendur</h3>
                <div className="text-xs text-zinc-500 flex items-center gap-1">
                  <Calculator className="h-3 w-3" />
                  Prósenta reiknuð sjálfkrafa
                </div>
              </div>
              
              {/* Mobile: Card Layout */}
              <div className="md:hidden space-y-4">
                {registrations.map(reg => (
                  <div key={reg.id} className="bg-zinc-800 rounded-lg p-4 space-y-3">
                    <div className="font-medium text-lg">{reg.competitor.name}</div>
                    <div className="text-sm text-zinc-400">{reg.competitor.division}</div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Stig <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={results[reg.competitor_id]?.score || ''}
                          onChange={(e) => handleScoreChange(reg.competitor_id, e.target.value)}
                          className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm"
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          % <span className="text-zinc-500">(reiknað)</span>
                        </label>
                        <input
                          type="number"
                          value={results[reg.competitor_id]?.percentage || ''}
                          className="w-full px-2 py-1 bg-zinc-900 border border-zinc-600 rounded text-sm text-zinc-400"
                          placeholder="0.00"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Punktar {!useManualPoints && <span className="text-zinc-500">(eftir sæti)</span>}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={results[reg.competitor_id]?.points || ''}
                          onChange={(e) => handleManualPointsChange(reg.competitor_id, e.target.value)}
                          className={`w-full px-2 py-1 border rounded text-sm ${
                            useManualPoints 
                              ? 'bg-zinc-900 border-zinc-700' 
                              : 'bg-zinc-900/50 border-zinc-600 text-zinc-500'
                          }`}
                          placeholder={useManualPoints ? "0" : "Auto"}
                          readOnly={!useManualPoints}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-2">Nafn</th>
                      <th className="text-left py-2">Flokkur</th>
                      <th className="text-left py-2">
                        Stig <span className="text-orange-500">*</span>
                      </th>
                      <th className="text-left py-2">
                        Prósenta <span className="text-xs text-zinc-500">(reiknað)</span>
                      </th>
                      <th className="text-left py-2">
                        Punktar {!useManualPoints && <span className="text-xs text-zinc-500">(eftir sæti)</span>}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(reg => (
                      <tr key={reg.id} className="border-b border-zinc-800">
                        <td className="py-3">{reg.competitor.name}</td>
                        <td className="py-3">{reg.competitor.division}</td>
                        <td className="py-3">
                          <input
                            type="number"
                            step="0.01"
                            value={results[reg.competitor_id]?.score || ''}
                            onChange={(e) => handleScoreChange(reg.competitor_id, e.target.value)}
                            className="w-24 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded"
                            placeholder="0"
                            required
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            value={results[reg.competitor_id]?.percentage || ''}
                            className="w-24 px-2 py-1 bg-zinc-800/50 border border-zinc-600 rounded text-zinc-400"
                            placeholder="0.00"
                            readOnly
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            step="0.01"
                            value={results[reg.competitor_id]?.points || ''}
                            onChange={(e) => handleManualPointsChange(reg.competitor_id, e.target.value)}
                            className={`w-24 px-2 py-1 rounded ${
                              useManualPoints 
                                ? 'bg-zinc-800 border border-zinc-700' 
                                : 'bg-zinc-800/50 border border-zinc-600 text-zinc-500'
                            }`}
                            placeholder={useManualPoints ? "0" : "Auto"}
                            readOnly={!useManualPoints}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-zinc-800 rounded-lg text-sm">
                <p className="text-zinc-400">
                  <strong>Útskýringar:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-zinc-500 text-xs">
                  <li>• <strong>Stig:</strong> Heildarstig keppanda í mótinu (handvirt)</li>
                  <li>• <strong>Prósenta:</strong> Reiknað sjálfkrafa = (Stig / Hámarksstig) × 100</li>
                  <li>• <strong>Punktar:</strong> {useManualPoints 
                    ? "Slegið inn handvirkt" 
                    : "Reiknað eftir sæti (1. sæti = 100p, 2. = 95p, o.s.frv.)"}</li>
                </ul>
              </div>
            </div>
          )}

          {message.text && (
            <div className={`p-3 rounded-md text-sm ${
              message.type === 'success' 
                ? 'bg-green-900/50 text-green-400' 
                : 'bg-red-900/50 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {selectedMatch && registrations.length > 0 && (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 md:py-3 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Save className="h-4 w-4 md:h-5 md:w-5" />
              {loading ? 'Vista úrslit...' : 'Vista úrslit'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default AdminResultsForm;