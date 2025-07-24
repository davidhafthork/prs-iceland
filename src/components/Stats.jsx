import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

function Stats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    competitors: 0,
    upcomingMatches: 0,
    completedMatches: 0,
    totalRegistrations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get competitor count
      const { count: competitorCount } = await supabase
        .from('competitors')
        .select('*', { count: 'exact', head: true });

      // Get upcoming matches count
      const { count: upcomingCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'upcoming');

      // Get completed matches count for this year
      const { count: completedCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('date', new Date(new Date().getFullYear(), 0, 1).toISOString());

      // Get total registrations for upcoming matches
      const { count: registrationCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed');

      setStats({
        competitors: competitorCount || 0,
        upcomingMatches: upcomingCount || 0,
        completedMatches: completedCount || 0,
        totalRegistrations: registrationCount || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-zinc-400">{t('stats.loading')}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {stats.competitors}
            </div>
            <div className="text-zinc-400">{t('stats.registeredCompetitors.label')}</div>
            <div className="text-sm text-zinc-500 mt-1">{t('stats.registeredCompetitors.description')}</div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {stats.upcomingMatches}
            </div>
            <div className="text-zinc-400">{t('stats.upcomingMatches.label')}</div>
            <div className="text-sm text-zinc-500 mt-1">{t('stats.upcomingMatches.description')}</div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {stats.completedMatches}
            </div>
            <div className="text-zinc-400">{t('stats.completedMatches.label')}</div>
            <div className="text-sm text-zinc-500 mt-1">{t('stats.completedMatches.description')}</div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {stats.totalRegistrations}
            </div>
            <div className="text-zinc-400">{t('stats.totalRegistrations.label')}</div>
            <div className="text-sm text-zinc-500 mt-1">{t('stats.totalRegistrations.description')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;