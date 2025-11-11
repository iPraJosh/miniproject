import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  created_at: string;
}

export interface Device {
  id: string;
  device_name: string;
  device_type: string;
  serial_number: string;
  employee_id: string | null;
  status: string;
  assigned_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}
