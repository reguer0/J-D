'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const browserClient = createClient(supabaseUrl, supabaseAnonKey);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await browserClient.auth.getSession();
      if (data.session) {
        const { data: profile } = await browserClient
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        setUser({
          id: data.session.user.id,
          name: profile?.name || data.session.user.email?.split('@')[0] || 'Usuario',
          email: data.session.user.email || '',
          role: profile?.role || 'user',
        });
      }
      setLoading(false);
    };

    loadUser();

    const { data: listener } = browserClient.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await browserClient.auth.signInWithPassword({ email, password });
    if (error) {
      return { ok: false, error: 'Email o contraseña incorrectos' };
    }

    const { data, error: profileError } = await browserClient.auth.getUser();
    if (profileError || !data.user) {
      return { ok: true }; // la sesión se carga por listener
    }

    const { data: profile } = await browserClient
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    setUser({
      id: data.user.id,
      name: profile?.name || data.user.email?.split('@')[0] || 'Usuario',
      email: data.user.email || '',
      role: profile?.role || 'user',
    });

    return { ok: true };
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await browserClient.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { ok: false, error: 'Este email ya está registrado. Prueba a iniciar sesión.' };
      }
      return { ok: false, error: error.message };
    }

    if (data.user) {
      // Crear el perfil
      const { error: profileError } = await browserClient
        .from('profiles')
        .insert({ id: data.user.id, name, email, role: 'user' });

      if (profileError) {
        // El trigger de la base de datos puede haber creado el perfil ya
      }

      setUser({
        id: data.user.id,
        name,
        email,
        role: 'user',
      });
    }

    return { ok: true };
  };

  const logout = async () => {
    await browserClient.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}