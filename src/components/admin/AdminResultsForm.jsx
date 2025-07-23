import React, { useState, useEffect } from 'react';
import { Trophy, Save } from 'lucide-react';
import { matchesApi, registrationApi, resultsApi } from '../../lib/supabase';

function AdminResultsForm() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [results, setResults] = useState({});
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

  const handleResultChange = (competitorId, field, value) => {
    setResults(prev => ({
      ...prev,
      [competitorId]: {
        ...prev[competitorId],
        [field]: value
      }
    }));

    // Auto-calculate points based on percentage if score is entered
    if (field === 'percentage' && value) {
      const percentage = parseFloat(value);
      const points = (percentage / 100) * 300; // Assuming 300 max points
      setResults(prev => ({
        ...prev,
        [competitorId]: {
          ...prev[competitorId],
          points: points.toFixed(2)
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare results data
      const resultsData = [];
      for (const [competitorId, result] of Object.entries(results)) {
        if (result.score && result.percentage && result.points) {
          resultsData.push({
            match_id: selectedMatch,
            competitor_id: competitorId,
            score: parseFloat(result.score),
            percentage: parseFloat(result.percentage),
            points: parseFloat(result.points)
          });
        }
      }

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
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Skrá úrslit móts
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Veldu mót
            </label>
            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500"
            >
              <option value="">-- Veldu mót --</option>
              {matches.map(match => (
                <option key={match.id} value={match.id}>
                  {match.name} - {new Date(match.date).toLocaleDateString('is-IS')}
                </option>
              ))}
            </select>
          </div>

          {registrations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Keppendur</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-2">Nafn</th>
                      <th className="text-left py-2">Flokkur</th>
                      <th className="text-left py-2">Stig</th>
                      <th className="text-left py-2">Prósenta</th>
                      <th className="text-left py-2">Punktar</th>
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
                            onChange={(e) => handleResultChange(reg.competitor_id, 'score', e.target.value)}
                            className="w-24 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={results[reg.competitor_id]?.percentage || ''}
                            onChange={(e) => handleResultChange(reg.competitor_id, 'percentage', e.target.value)}
                            className="w-24 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            step="0.01"
                            value={results[reg.competitor_id]?.points || ''}
                            onChange={(e) => handleResultChange(reg.competitor_id, 'points', e.target.value)}
                            className="w-24 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded"
                            placeholder="0.00"
                            readOnly
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {message.text && (
            <div className={`p-3 rounded-md ${
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
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="h-5 w-5" />
              {loading ? 'Vista úrslit...' : 'Vista úrslit'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default AdminResultsForm;