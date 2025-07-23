import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
// These values will come from your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations

export const matchesApi = {
  // Get all upcoming matches with registration stats
  async getUpcoming() {
    const { data, error } = await supabase
      .from('match_registration_stats')
      .select('*')
      .eq('status', 'upcoming')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get past matches
  async getPast() {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        results (
          competitor:competitors (name),
          score,
          percentage
        )
      `)
      .eq('status', 'completed')
      .order('date', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  },

  // Create a new match (admin only)
  async create(match) {
    const { data, error } = await supabase
      .from('matches')
      .insert(match)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

export const standingsApi = {
  // Get current season standings
  async getCurrent() {
    const { data, error } = await supabase
      .from('current_standings')
      .select('*')
    
    if (error) throw error
    return data
  },

  // Get standings by division
  async getByDivision(division) {
    const { data, error } = await supabase
      .from('current_standings')
      .select('*')
      .eq('division', division)
    
    if (error) throw error
    return data
  }
}

export const registrationApi = {
  // Register a competitor for a match
  async register(matchId, competitorData) {
    // First, ensure competitor exists
    const { data: competitor, error: competitorError } = await supabase
      .from('competitors')
      .upsert(competitorData)
      .select()
      .single()
    
    if (competitorError) throw competitorError

    // Then create registration
    const { data, error } = await supabase
      .from('registrations')
      .insert({
        match_id: matchId,
        competitor_id: competitor.id,
        status: 'confirmed'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get registrations for a match
  async getForMatch(matchId) {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        competitor:competitors (
          name,
          division,
          city
        )
      `)
      .eq('match_id', matchId)
      .order('registered_at')
    
    if (error) throw error
    return data
  }
}

export const resultsApi = {
  // Add results for a match (admin only)
  async addResults(matchId, results) {
    const { data, error } = await supabase
      .from('results')
      .insert(results)
      .select()
    
    if (error) throw error
    
    // Update match status to completed
    await supabase
      .from('matches')
      .update({ status: 'completed' })
      .eq('id', matchId)
    
    return data
  }
}