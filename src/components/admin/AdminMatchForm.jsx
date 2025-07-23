import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Users } from 'lucide-react';
import { matchesApi } from '../../lib/supabase';

function AdminMatchForm() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    capacity: 40
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await matchesApi.create(formData);
      setMessage({ type: 'success', text: 'Mót búið til!' });
      setFormData({ name: '', date: '', location: '', capacity: 40 });
    } catch (error) {
      console.error('Error creating match:', error);
      setMessage({ type: 'error', text: 'Villa við að búa til mót' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
          <Plus className="h-5 w-5 md:h-6 md:w-6" />
          Búa til nýtt mót
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nafn móts
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 md:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500 text-sm md:text-base"
              placeholder="t.d. Vopnafjarðarmótið"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Dagsetning
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 md:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500 text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Staðsetning
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 md:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500 text-sm md:text-base"
              placeholder="t.d. Skotsvæði Vopnafjarðar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              Hámarksfjöldi keppenda
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 md:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500 text-sm md:text-base"
            />
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 md:py-3 rounded-md font-medium transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            {loading ? 'Vista...' : 'Búa til mót'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminMatchForm;