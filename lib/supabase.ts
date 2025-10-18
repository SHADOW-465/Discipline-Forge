import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  display_name: string;
  current_phase: string;
  commitment_start: string | null;
  commitment_duration: number;
  dark_mode: boolean;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'mental' | 'social' | 'productivity' | 'wellness';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  duration_days: number;
  is_system: boolean;
  created_by: string | null;
  created_at: string;
};

export type UserChallenge = {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  started_at: string;
  completed_at: string | null;
  target_completion: string | null;
  created_at: string;
  challenge?: Challenge;
};

export type DailyLog = {
  id: string;
  user_id: string;
  log_date: string;
  compliance_rating: number;
  journal_entry: string;
  mood: string;
  challenges_completed: string[];
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  badge_icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
};

export type Statistics = {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_logs: number;
  total_challenges_completed: number;
  average_compliance: number;
  last_calculated: string;
};
