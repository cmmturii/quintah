/**
 * Opulent Collections — Supabase Config
 * ─────────────────────────────────────
 * Include this ONCE per page, before any other script that uses Supabase.
 *
 * HOW TO USE:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="../supabase-config.js"></script>
 *
 * Then in your page scripts, use:  window._sb
 *
 * SECURITY NOTE:
 *   The ANON key below is safe to be public IF Supabase Row Level Security (RLS)
 *   is enabled on all tables. See SECURITY_FIXES_SUMMARY.md for the required SQL.
 *
 *   The SERVICE_KEY (service_role) must NEVER be in client-side code.
 *   Use Supabase Edge Functions for any operations requiring elevated privileges.
 */

const SUPABASE_URL      = 'https://azwcxezzzljbjgojwtax.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6d2N4ZXp6emxqYmpnb2p3dGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTk2NTQsImV4cCI6MjA4NzY5NTY1NH0.wFrC32vU0MWbp-otIif5WdlCemeIDXEa2DyLXrl1OEI';

// Safe singleton — prevents "already declared" error if script loads twice
if (!window._sb) {
  window._sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken:   true,
      persistSession:     true,
      detectSessionInUrl: true
    }
  });
}

// Shorthand auth helpers used across pages
window.OpulentAuth = {

  async getUser() {
    const { data: { user } } = await window._sb.auth.getUser();
    return user;
  },

  async getRole() {
    const user = await this.getUser();
    if (!user) return null;
    const { data } = await window._sb
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    return data?.role || 'user';
  },

  async isAdmin() {
    const role = await this.getRole();
    return role === 'admin';
  },

  async signIn(email, password) {
    return await window._sb.auth.signInWithPassword({ email, password });
  },

  async signUp(email, password, meta = {}) {
    return await window._sb.auth.signUp({ email, password, options: { data: meta } });
  },

  async signInWithGoogle() {
    return await window._sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  },

  async signOut() {
    await window._sb.auth.signOut();
    window.location.reload();
  },

  async getSession() {
    const { data: { session } } = await window._sb.auth.getSession();
    return session;
  }
};