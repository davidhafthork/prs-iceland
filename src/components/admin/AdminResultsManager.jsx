import React, { useState, useEffect } from 'react';
import { Trophy, Edit2, Trash2, Save, X, Medal } from 'lucide-react';
import { matchesApi, resultsApi } from '../../lib/supabase';

function AdminResultsManager() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [results, setResults] = useState([]);
  const [editingResult, setEditingResult] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadCompletedMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      loadResults(selectedMatch);
    }
  }, [selectedMatch]);

  const loadCompletedMatches = async () => {
    try {
      const data = await matchesApi.getAll();
      const completedMatches = data.filter(m => m.status === 'completed');
      setMatches(completedMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
      setMessage({ type: 'error', text: 'Villa við að sækja mót' });
    }
  };

  const loadResults = async (matchId) => {
    try {
      setLoading(true);
      const data = await resultsApi.getForMatch(matchId);
      console.log('Loaded results:', data);
      setResults(data);
    } catch (error) {
      console.error('Error loading results:', error);
      setMessage({ type: 'error', text: 'Villa við að sækja úrslit' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (result) => {
    setEditingResult(result.id);
    setEditForm({
      score: result.score,
      percentage: result.percentage,
      points: result.points
    });
  };

  const handleSaveEdit = async (result) => {
    console.log('Saving result edit:', {
      result,
      matchId: result.match_id,
      competitorId: result.competitor_id,
      updates: editForm
    });
    
    try {
      await resultsApi.update(result.match_id, result.competitor_id, editForm);
      setMessage({ type: 'success', text: 'Úrslit uppfærð!' });
      setEditingResult(null);
      loadResults(selectedMatch);
    } catch (error) {
      console.error('Error updating result:', error);
      setMessage({ type: 'error', text: 'Villa við að uppfæra úrslit' });
    }
  };

  const handleDelete = async (result) => {
    if (!window.confirm(`Ertu viss um að þú viljir eyða úrslitum fyrir ${result.competitor.name}?`)) {
      return;
    }

    console.log('Deleting result:', {
      result,
      matchId: result.match_id,
      competitorId: result.competitor_id
    });

    try {
      await resultsApi.delete(result.match_id, result.competitor_id);
      setMessage({ type: 'success', text: 'Úrslitum eytt!' });
      loadResults(selectedMatch);
    } catch (error) {
      console.error('Error deleting result:', error);
      setMessage({ type: 'error', text: 'Villa við að eyða úrslitum' });
    }
  };

  const getDivisionBadge = (division) => {
    const divisionConfig = {
      Open: { bg: 'bg-blue-900/50', text: 'text-blue-400' },
      Production: { bg: 'bg-green-900/50', text: 'text-green-400' },
      Tactical: { bg: 'bg-purple-900/50', text: 'text-purple-400' }
    };
    
    const config = divisionConfig[division] || { bg: 'bg-zinc-800', text: 'text-zinc-400' };
    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} rounded-full text-xs`}>
        {division}
      </span>
    );
  };

  const getPlacementBadge = (index) => {
    if (index === 0) return <Medal className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Medal className="h-5 w-5 text-orange-600" />;
    return <span className="text-zinc-500 font-medium">{index + 1}.</span>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Stjórna úrslitum
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Veldu mót til að skoða/breyta úrslitum
            </label>
            <select
              value={selectedMatch}
              onChange={(e) => setSelectedMatch(e.target.value)}
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

          {message.text && (
            <div className={`p-3 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-900/50 text-green-400' 
                : 'bg-red-900/50 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {loading && (
            <p className="text-zinc-400">Sæki úrslit...</p>
          )}

          {!loading && selectedMatch && results.length > 0 && (
            <>
              {/* Mobile: Card Layout */}
              <div className="md:hidden space-y-4">
                {results.map((result, index) => (
                  <div key={result.id} className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getPlacementBadge(index)}
                        <div>
                          <div className="font-medium">{result.competitor.name}</div>
                          <div className="mt-1">
                            {getDivisionBadge(result.competitor.division)}
                          </div>
                        </div>
                      </div>
                      {editingResult !== result.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(result)}
                            className="p-1.5 text-zinc-400 hover:text-orange-500 transition-colors"
                            title="Breyta úrslitum"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(result)}
                            className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                            title="Eyða úrslitum"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {editingResult === result.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Stig</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.score}
                              onChange={(e) => setEditForm({ ...editForm, score: e.target.value })}
                              className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">%</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={editForm.percentage}
                              onChange={(e) => setEditForm({ ...editForm, percentage: e.target.value })}
                              className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-zinc-400 mb-1">Punktar</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.points}
                              onChange={(e) => setEditForm({ ...editForm, points: e.target.value })}
                              className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(result)}
                            className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <Save className="h-3 w-3" />
                            Vista
                          </button>
                          <button
                            onClick={() => setEditingResult(null)}
                            className="flex-1 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-sm transition-colors flex items-center justify-center gap-2"
                          >
                            <X className="h-3 w-3" />
                            Hætta við
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-zinc-400 text-xs">Stig</span>
                          <div className="font-medium">{result.score}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-xs">Prósenta</span>
                          <div className="font-medium">{result.percentage}%</div>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-xs">Punktar</span>
                          <div className="font-medium">{result.points}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop: Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-2">Sæti</th>
                      <th className="text-left py-2">Nafn</th>
                      <th className="text-left py-2">Flokkur</th>
                      <th className="text-left py-2">Stig</th>
                      <th className="text-left py-2">Prósenta</th>
                      <th className="text-left py-2">Punktar</th>
                      <th className="text-left py-2">Aðgerðir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                    <tr key={result.id} className="border-b border-zinc-800">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {getPlacementBadge(index)}
                        </div>
                      </td>
                      <td className="py-3 font-medium">{result.competitor.name}</td>
                      <td className="py-3">
                        {getDivisionBadge(result.competitor.division)}
                      </td>
                      {editingResult === result.id ? (
                        <>
                          <td className="py-3">
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.score}
                              onChange={(e) => setEditForm({ ...editForm, score: e.target.value })}
                              className="w-20 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded"
                            />
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={editForm.percentage}
                              onChange={(e) => setEditForm({ ...editForm, percentage: e.target.value })}
                              className="w-20 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded"
                            />
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.points}
                              onChange={(e) => setEditForm({ ...editForm, points: e.target.value })}
                              className="w-20 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded"
                            />
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEdit(result)}
                                className="p-1.5 text-green-500 hover:text-green-400 transition-colors"
                                title="Vista breytingar"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingResult(null)}
                                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                                title="Hætta við"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3">{result.score}</td>
                          <td className="py-3">{result.percentage}%</td>
                          <td className="py-3">{result.points}</td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(result)}
                                className="p-1.5 text-zinc-400 hover:text-orange-500 transition-colors"
                                title="Breyta úrslitum"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(result)}
                                className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                                title="Eyða úrslitum"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
          )}

          {!loading && selectedMatch && results.length === 0 && (
            <p className="text-zinc-400">Engin úrslit skráð fyrir þetta mót</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminResultsManager;