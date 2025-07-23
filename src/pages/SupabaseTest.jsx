import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Database } from 'lucide-react';

function SupabaseTest() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({});

  const testConnection = async () => {
    setLoading(true);
    setStatus('');
    
    try {
      // Test basic connection by checking tables
      const tables = ['competitors', 'matches', 'registrations', 'results'];
      const tableCounts = {};
      
      for (const table of tables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        tableCounts[table] = count || 0;
      }
      
      setCounts(tableCounts);
      setStatus('success');
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const addTestData = async () => {
    setLoading(true);
    try {
      // Add a test competitor
      const { data: competitor } = await supabase
        .from('competitors')
        .insert({
          name: 'Test Keppandi',
          email: `test${Date.now()}@example.com`,
          division: 'Open',
          city: 'Reykjavík'
        })
        .select()
        .single();

      // Add a test match
      const { data: match } = await supabase
        .from('matches')
        .insert({
          name: 'Test Mót',
          date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          location: 'Test Staður',
          capacity: 20
        })
        .select()
        .single();

      alert('Test data added successfully!');
      testConnection(); // Refresh counts
    } catch (error) {
      console.error('Error adding test data:', error);
      alert('Error adding test data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Database className="h-8 w-8 text-orange-500" />
          Supabase Connection Test
        </h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>Connection successful!</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="h-5 w-5" />
              <span>Connection failed - check console and .env.local</span>
            </div>
          )}

          {Object.keys(counts).length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Table Record Counts:</h3>
              {Object.entries(counts).map(([table, count]) => (
                <div key={table} className="flex justify-between text-sm">
                  <span className="text-zinc-400">{table}:</span>
                  <span>{count} records</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-zinc-800 pt-4">
            <button
              onClick={addTestData}
              disabled={loading || status !== 'success'}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              Add Test Data
            </button>
            <p className="text-xs text-zinc-500 mt-2">
              This will add a test competitor and match to your database
            </p>
          </div>
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Setup Checklist:</h3>
          <ul className="space-y-1 text-sm text-zinc-400">
            <li>✓ Supabase project created</li>
            <li>✓ Schema SQL executed</li>
            <li>✓ RLS policies added</li>
            <li>? .env.local configured with your URL and anon key</li>
            <li>? npm install completed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SupabaseTest;