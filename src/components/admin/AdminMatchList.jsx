import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Edit2, Trash2, Check, X } from 'lucide-react';
import { matchesApi } from '../../lib/supabase';
import AdminRegistrationManager from './AdminRegistrationManager';

function AdminMatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await matchesApi.getAll();
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
      setMessage({ type: 'error', text: 'Villa við að sækja mót' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (match) => {
    setEditingMatch(match.id);
    setEditForm({
      name: match.name,
      date: match.date,
      location: match.location,
      capacity: match.capacity
    });
  };

  const handleSaveEdit = async (matchId) => {
    try {
      await matchesApi.update(matchId, editForm);
      setMessage({ type: 'success', text: 'Mót uppfært!' });
      setEditingMatch(null);
      loadMatches();
    } catch (error) {
      console.error('Error updating match:', error);
      setMessage({ type: 'error', text: 'Villa við að uppfæra mót' });
    }
  };

  const handleDelete = async (matchId, matchName) => {
    if (!window.confirm(`Ertu viss um að þú viljir eyða mótinu "${matchName}"? Þetta mun einnig eyða öllum skráningum.`)) {
      return;
    }

    try {
      await matchesApi.delete(matchId);
      setMessage({ type: 'success', text: 'Móti eytt!' });
      loadMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
      setMessage({ type: 'error', text: 'Villa við að eyða móti' });
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { bg: 'bg-blue-900/50', text: 'text-blue-400', label: 'Framundan' },
      ongoing: { bg: 'bg-orange-900/50', text: 'text-orange-400', label: 'Í gangi' },
      completed: { bg: 'bg-green-900/50', text: 'text-green-400', label: 'Lokið' }
    };
    
    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-sm`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <p className="text-zinc-400">Sæki mót...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Öll mót</h3>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-900/50 text-green-400' 
              : 'bg-red-900/50 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {matches.length === 0 ? (
            <p className="text-zinc-400">Engin mót skráð</p>
          ) : (
            matches.map((match) => (
              <div key={match.id} className="border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                {editingMatch === match.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500"
                        placeholder="Staðsetning"
                      />
                      <input
                        type="number"
                        value={editForm.capacity}
                        onChange={(e) => setEditForm({ ...editForm, capacity: parseInt(e.target.value) })}
                        className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500"
                        placeholder="Hámarksfjöldi"
                        min="1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(match.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Vista
                      </button>
                      <button
                        onClick={() => setEditingMatch(null)}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md transition-colors flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Hætta við
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <h4 className="text-lg font-semibold break-words">{match.name}</h4>
                          {getStatusBadge(match.status)}
                        </div>
                        <div className="flex flex-col md:flex-row md:gap-4 text-sm text-zinc-400 space-y-1 md:space-y-0">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>{formatDate(match.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{match.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 flex-shrink-0" />
                            <span>Hámark: {match.capacity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-start sm:self-auto flex-shrink-0">
                        <button
                          onClick={() => handleEdit(match)}
                          className="p-2 text-zinc-400 hover:text-orange-500 transition-colors"
                          title="Breyta móti"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        {match.status === 'upcoming' && (
                          <button
                            onClick={() => handleDelete(match.id, match.name)}
                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                            title="Eyða móti"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <AdminRegistrationManager match={match} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMatchList;