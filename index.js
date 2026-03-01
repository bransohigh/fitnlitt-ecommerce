// Hostinger entry point (CommonJS) — Passenger loads this via require()

// Load .env if it exists
try { require('dotenv').config(); } catch (_) {}

// Fallback: set env vars directly if .env is missing (Hostinger Passenger clears files)
const defaults = {
  NEXT_PUBLIC_SUPABASE_URL:    'https://ibbzpkmsyjlvlosataho.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliYnpwa21zeWpsdmxvc2F0YWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzU3NTgsImV4cCI6MjA4Njk1MTc1OH0.FrkKKOx_2fHkC2HJ5WrBODoVSggGOztToD1Xn2sxU2k',
  VITE_SUPABASE_URL:           'https://ibbzpkmsyjlvlosataho.supabase.co',
  VITE_SUPABASE_ANON_KEY:      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliYnpwa21zeWpsdmxvc2F0YWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzU3NTgsImV4cCI6MjA4Njk1MTc1OH0.FrkKKOx_2fHkC2HJ5WrBODoVSggGOztToD1Xn2sxU2k',
  SUPABASE_SERVICE_ROLE_KEY:   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliYnpwa21zeWpsdmxvc2F0YWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM3NTc1OCwiZXhwIjoyMDg2OTUxNzU4fQ.dF0LvzAkKIDV99BvAUsTJidtbexUWzzFJSfyanh8IkE',
  API_PORT: '3001',
};
for (const [key, val] of Object.entries(defaults)) {
  if (!process.env[key]) process.env[key] = val;
}

require('./server/index.js');
