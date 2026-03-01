/**
 * Auth Context for Admin Authentication
 * Provides authentication state and methods throughout the app
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  supabaseAuth,
  signIn as authSignIn,
  signOut as authSignOut,
  getSession,
  getUser,
} from '../lib/supabase-auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let settled = false;

    function done() {
      if (!settled) {
        settled = true;
        setLoading(false);
      }
    }

    // Timeout: if Supabase hangs (e.g. stale localStorage token), unblock after 4s
    const timeout = setTimeout(done, 4000);

    // Listen for auth changes — Supabase always fires INITIAL_SESSION immediately
    const {
      data: { subscription },
    } = supabaseAuth.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        try {
          const newUser = await getUser();
          setUser(newUser);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      done();
    });

    // Also try getSession as fallback (race)
    getSession()
      .then((currentSession) => {
        if (!settled) {
          setSession(currentSession);
          if (!currentSession) done();
        }
      })
      .catch(() => done());

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { session: newSession, user: newUser } = await authSignIn(email, password);
      setSession(newSession);
      setUser(newUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await authSignOut();
      setSession(null);
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
