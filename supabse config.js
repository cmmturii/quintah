/**
 * SunUp Collections — Supabase Config
 * ─────────────────────────────────────
 * Include this ONCE per page, before any other script that uses Supabase.
 *
 * HOW TO USE:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="../supabase-config.js"></script>
 *
 * Then in your page scripts, use:  window._sb  (NOT  const supabase = ...)
 *
 * Example:
 *   const { data, error } = await window._sb.auth.getSession();
 */

// ──────────────────────────────────────────────
//  PASTE YOUR KEYS HERE
// ──────────────────────────────────────────────
const SUPABASE_URL      = 'https://azwcxezzzljbjgojwtax.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6d2N4ZXp6emxqYmpnb2p3dGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTk2NTQsImV4cCI6MjA4NzY5NTY1NH0.wFrC32vU0MWbp-otIif5WdlCemeIDXEa2DyLXrl1OEI';

// ──────────────────────────────────────────────
//  SAFE SINGLETON — prevents "already declared" error
//  when the script is accidentally loaded twice
// ──────────────────────────────────────────────
if (!window._sb) {
  window._sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession:   true,
      detectSessionInUrl: true
    }
  });
}

// Expose shorthand helpers used across pages
window.SunUpAuth = {

  /** Get current logged-in user (null if guest) */
  async getUser() {
    const { data: { user } } = await window._sb.auth.getUser();
    return user;
  },

  /** Get user role from profiles table ('admin' | 'user' | null) */
  async getRole() {
    const user = await this.getUser();
    if (!user) return null;
    const { data } = await window._sb.from('profiles').select('role').eq('id', user.id).single();
    return data?.role || 'user';
  },

  /** Check if current user is admin */
  async isAdmin() {
    const role = await this.getRole();
    return role === 'admin';
  },

  /** Sign in with email + password */
  async signIn(email, password) {
    return await window._sb.auth.signInWithPassword({ email, password });
  },

  /** Sign up */
  async signUp(email, password, meta = {}) {
    return await window._sb.auth.signUp({ email, password, options: { data: meta } });
  },

  /** Google OAuth */
  async signInWithGoogle() {
    return await window._sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  },

  /** Sign out */
  async signOut() {
    await window._sb.auth.signOut();
    window.location.reload();
  },

  /** Get full session */
  async getSession() {
    const { data: { session } } = await window._sb.auth.getSession();
    return session;
  }
};

console.log('✅ Supabase connected →', SUPABASE_URL);