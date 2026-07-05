import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { auth, isFirebaseConfigured } from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const mapFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName ?? 'Administrador',
    email: firebaseUser.email ?? '',
  };
};

const LOCAL_AUTH_KEY = 'verde-limon-auth';
const LOCAL_USERS = [{
  email: 'admin@verdelimon.cl',
  password: 'admin123',
  name: 'Administrador',
}];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(mapFirebaseUser(firebaseUser));
        setIsLoading(false);
      });
      return unsubscribe;
    }

    const saved = localStorage.getItem(LOCAL_AUTH_KEY);
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, password);
      return;
    }

    const match = LOCAL_USERS.find((item) => item.email === email && item.password === password);
    if (!match) {
      throw new Error('auth/invalid-credentials');
    }

    const localUser: User = {
      id: 'local-admin',
      name: match.name,
      email: match.email,
    };
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
    setUser(localUser);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
      return;
    }

    localStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};