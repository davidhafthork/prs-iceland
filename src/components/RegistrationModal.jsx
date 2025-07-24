import React, { useState } from 'react';
import { X, User, Mail, Target, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { registrationApi } from '../lib/supabase';
import { registrationContent } from '../data/registrationContent';

function RegistrationModal({ match, onClose, onSuccess }) {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    division: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const divisions = registrationContent.fields.division.options;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await registrationApi.register(match.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message?.includes('duplicate key')) {
        setError(t('registration.errors.duplicate'));
      } else if (err.message?.includes('unique constraint')) {
        setError(t('registration.errors.emailExists'));
      } else {
        setError(t('registration.errors.general'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t('registration.modalTitle')} {match.name}</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-zinc-400 mt-2">
            {new Date(match.date).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'is-IS', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })} - {match.location}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <User className="inline h-4 w-4 mr-1" />
              {t('registration.fields.name.label')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500"
              placeholder={t('registration.fields.name.placeholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Mail className="inline h-4 w-4 mr-1" />
              {t('registration.fields.email.label')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500"
              placeholder={t('registration.fields.email.placeholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Target className="inline h-4 w-4 mr-1" />
              {t('registration.fields.division.label')}
            </label>
            <select
              name="division"
              value={formData.division}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500"
            >
              <option value="">{t('registration.fields.division.placeholder')}</option>
              {divisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              {t('registration.fields.city.label')}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-orange-500"
              placeholder={t('registration.fields.city.placeholder')}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-900/50 text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-md font-medium transition-colors"
            >
              {t('registration.buttons.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {loading ? t('registration.buttons.submitting') : t('registration.buttons.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationModal;