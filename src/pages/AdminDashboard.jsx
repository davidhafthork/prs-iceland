import React, { useState } from 'react';
import { Shield, Calendar, Trophy, Settings, Edit } from 'lucide-react';
import AdminMatchForm from '../components/admin/AdminMatchForm';
import AdminResultsForm from '../components/admin/AdminResultsForm';
import AdminMatchList from '../components/admin/AdminMatchList';
import AdminResultsManager from '../components/admin/AdminResultsManager';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('matches');

  // TODO: Add authentication check here
  // For now, this is just a UI demo

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-orange-500" />
            Stjórnborð PRS Iceland
          </h1>
          <p className="text-zinc-400 mt-2">Stjórna mótum og úrslitum</p>
        </div>

        {/* Tab Navigation - Mobile Optimized */}
        <div className="mb-8">
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4">
            <div className="flex gap-2 border-b border-zinc-800 min-w-max pb-1">
              <button
                onClick={() => setActiveTab('matches')}
                className={`pb-3 px-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'matches' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Búa til</span>
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`pb-3 px-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'manage' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Stjórna</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`pb-3 px-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'results' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Trophy className="h-4 w-4" />
                <span className="text-sm">Úrslit</span>
              </button>
              <button
                onClick={() => setActiveTab('manageResults')}
                className={`pb-3 px-3 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'manageResults' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Edit className="h-4 w-4" />
                <span className="text-sm">Breyta</span>
              </button>
            </div>
          </div>
          
          {/* Tablet and up: Full labels */}
          <div className="hidden md:flex gap-4 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('matches')}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'matches' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calendar className="h-5 w-5" />
              Búa til mót
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'manage' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Settings className="h-5 w-5" />
              Stjórna mótum
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'results' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Trophy className="h-5 w-5" />
              Skrá úrslit
            </button>
            <button
              onClick={() => setActiveTab('manageResults')}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'manageResults' 
                  ? 'text-orange-500 border-b-2 border-orange-500' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Edit className="h-5 w-5" />
              Stjórna úrslitum
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'matches' && <AdminMatchForm />}
          {activeTab === 'manage' && <AdminMatchList />}
          {activeTab === 'results' && <AdminResultsForm />}
          {activeTab === 'manageResults' && <AdminResultsManager />}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Athugið</h3>
          <p className="text-zinc-400">
            Þetta stjórnborð er enn í þróun. Authentication og öryggisatriði vantar áður en það fer í notkun.
            Öll gögn eru geymd í Supabase gagnagrunninum og uppfærast sjálfkrafa á vefsíðunni.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;