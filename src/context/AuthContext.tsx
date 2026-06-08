import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AuthUser, UserRole } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchUserRole(userId: string): Promise<UserRole> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  return (data?.role as UserRole) ?? 'customer';
}

async function buildAuthUser(supabaseUser: User): Promise<AuthUser> {
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, phone, avatar_url')
    .eq('id', supabaseUser.id)
    .single();

  const role = await fetchUserRole(supabaseUser.id);

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    fullName: profile?.full_name ?? supabaseUser.user_metadata?.full_name ?? null,
    phone: profile?.phone ?? null,
    avatarUrl: profile?.avatar_url ?? supabaseUser.user_metadata?.avatar_url ?? null,
    role,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (supabaseUser: User | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }
    const authUser = await buildAuthUser(supabaseUser);
    setUser(authUser);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      loadUser(session?.user ?? null).finally(() => setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      loadUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [loadUser]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error as Error | null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const isRole = (role: UserRole) => user?.role === role;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithGoogle, signOut, isRole, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
