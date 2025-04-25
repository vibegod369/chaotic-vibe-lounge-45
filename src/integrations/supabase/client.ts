
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qolbhenjvoxizxdanrdi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGJoZW5qdm94aXp4ZGFucmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mjg0MzksImV4cCI6MjA2MDIwNDQzOX0.SjCA2IhbGsKLuWMrnvT9B5IvFMOCviIo9WEHY9ezN8I";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
