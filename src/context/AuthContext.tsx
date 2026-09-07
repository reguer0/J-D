'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';
import { isValidEmail, RegisterResult, LoginResult } from '@/utils/validation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => LoginResult;
  register: (name: string, email: string, password: string) => RegisterResult;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let users: (User & { password: string })[] = [
  { id: '1', name: 'Admin', email: 'admin@jd.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'Usuario', email: 'user@jd.com', password: 'user123', role: 'user' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): LoginResult => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return { ok: false, error: 'Introduce email y contraseña' };
    }

    if (!isValidEmail(normalizedEmail)) {
      return { ok: false, error: 'El formato del email no es válido' };
    }

    const found = users.find(u => u.email === normalizedEmail && u.password === password);
    if (found) {
      const { password: _, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      return { ok: true };
    }

    return { ok: false, error: 'Email o contraseña incorrectos' };
  };

  const register = (name: string, email: string, password: string): RegisterResult => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim()) {
      return { ok: false, error: 'El nombre es obligatorio' };
    }

    if (!isValidEmail(normalizedEmail)) {
      return { ok: false, error: 'El formato del email no es válido. Ejemplo: tu@email.com' };
    }

    if (password.length < 6) {
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const emailExists = users.some(u => u.email === normalizedEmail);
    if (emailExists) {
      return { ok: false, error: 'Este email ya está registrado. Prueba a iniciar sesión.' };
    }

    const newUser: User = {
      id: String(Date.now()),
      name: name.trim(),
      email: normalizedEmail,
      role: 'user',
    };
    users.push({ ...newUser, password });
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}