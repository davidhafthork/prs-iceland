import React, { useState, useEffect } from 'react';
import { Users, Shield, Mail, MapPin, Check, X, AlertCircle, Edit2, MoreVertical, Trash2 } from 'lucide-react';
import { registrationApi } from '../../lib/supabase';

function AdminRegistrationManager({ match }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedMatch, setExpandedMatch] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [editForm, setEditForm] = useState({ status: '' });

  useEffect(() => {
    if (expandedMatch) {
      loadRegistrations();
    }
  }, [expandedMatch]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationApi.getForMatch(match.id);
      console.log('Loaded registrations:', data);
      setRegistrations(data);
    } catch (error) {
      console.error('Error loading registrations:', error);
      setMessage({ type: 'error', text: 'Villa við að sækja skráningar' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (registration) => {
    setEditingRegistration(registration.id);
    setEditForm({ status: registration.status });
  };

  const handleSaveEdit = async (registration) => {
    if (editForm.status === registration.status) {
      // No change made
      setEditingRegistration(null);
      return;
    }

    console.log('Updating registration status:', {
      matchId: match.id,
      competitorId: registration.competitor_id,
      registrationId: registration.id,
      currentStatus: registration.status,
      newStatus: editForm.status
    });
    
    try {
      await registrationApi.updateStatus(match.id, registration.competitor_id, editForm.status);
      setMessage({ type: 'success', text: 'Staða uppfærð!' });
      setEditingRegistration(null);
      loadRegistrations();
    } catch (error) {
      console.error('Error updating registration:', error);
      setMessage({ type: 'error', text: 'Villa við að uppfæra stöðu' });
    }
  };

  const handleDelete = async (registration) => {
    if (!window.confirm(`Ertu viss um að þú viljir eyða skráningu fyrir ${registration.competitor.name}?`)) {
      return;
    }

    console.log('Deleting registration:', {
      matchId: match.id,
      competitorId: registration.competitor_id,
      registrationId: registration.id,
      competitorData: registration.competitor
    });

    try {
      await registrationApi.delete(match.id, registration.competitor_id);
      setMessage({ type: 'success', text: 'Skráningu eytt!' });
      loadRegistrations();
    } catch (error) {
      console.error('Error deleting registration:', error);
      setMessage({ type: 'error', text: 'Villa við að eyða skráningu' });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { bg: 'bg-green-900/50', text: 'text-green-400', label: 'Staðfest' },
      waitlist: { bg: 'bg-orange-900/50', text: 'text-orange-400', label: 'Biðlisti' },
      cancelled: { bg: 'bg-red-900/50', text: 'text-red-400', label: 'Afboðað' }
    };
    
    const config = statusConfig[status] || statusConfig.confirmed;
    return (
      <span className={`px-2 py-1 ${config.bg} ${config.text} rounded-full text-xs`}>
        {config.label}
      </span>
    );
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

  return (
    <div className="mt-4">
      <button
        onClick={() => setExpandedMatch(!expandedMatch)}
        className="w-full text-left px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Stjórna skráningum
        </span>
        <span className="text-sm text-zinc-400">
          {expandedMatch ? 'Fela' : 'Sýna'}
        </span>
      </button>

      {expandedMatch && (
        <div className="mt-4 bg-zinc-800 rounded-lg p-4">
          {message.text && (
            <div className={`mb-4 p-3 rounded-md flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-green-900/50 text-green-400' 
                : 'bg-red-900/50 text-red-400'
            }`}>
              <AlertCircle className="h-4 w-4" />
              {message.text}
            </div>
          )}

          {loading ? (
            <p className="text-zinc-400">Sæki skráningar...</p>
          ) : registrations.length === 0 ? (
            <p className="text-zinc-400">Engar skráningar fyrir þetta mót</p>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-zinc-400 mb-3">
                Skráðir: {registrations.filter(r => r.status === 'confirmed').length} / {match.capacity}
              </div>
              
              {registrations.map((registration) => (
                <div key={registration.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-zinc-900 rounded-lg space-y-3 md:space-y-0">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 space-y-2 md:space-y-0">
                    <div>
                      <div className="font-medium">{registration.competitor.name}</div>
                      <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        {registration.competitor.city}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getDivisionBadge(registration.competitor.division)}
                      {editingRegistration === registration.id ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ status: e.target.value })}
                          className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs focus:outline-none focus:border-orange-500"
                        >
                          <option value="confirmed">Staðfest</option>
                          <option value="waitlist">Biðlisti</option>
                          <option value="cancelled">Afboðað</option>
                        </select>
                      ) : (
                        getStatusBadge(registration.status)
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {editingRegistration === registration.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(registration)}
                          className="p-2 md:p-1.5 text-green-500 hover:text-green-400 transition-colors"
                          title="Vista breytingar"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingRegistration(null)}
                          className="p-2 md:p-1.5 text-zinc-400 hover:text-white transition-colors"
                          title="Hætta við"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(registration)}
                          className="p-2 md:p-1.5 text-zinc-400 hover:text-orange-500 transition-colors"
                          title="Breyta stöðu"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(registration)}
                          className="p-2 md:p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                          title="Eyða skráningu"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminRegistrationManager;