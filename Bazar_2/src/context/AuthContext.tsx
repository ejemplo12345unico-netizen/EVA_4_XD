import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { auth, isFirebaseConfigured } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const mapFirebaseAuthError = (code: string): string => {
  const errorMap: Record<string, string> = {
    'auth/user-not-found': 'Usuario no encontrado.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-email': 'Formato de correo inválido.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/email-already-in-use': 'Este correo ya está registrado.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/operation-not-allowed': 'Registro deshabilitado en la configuración.',
  };
  return errorMap[code] || 'Error de autenticación. Intenta de nuevo.';
};

const mapFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName ?? 'Administrador',
    email: firebaseUser.email ?? '',
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      console.warn('Firebase no está configurado o Auth no está disponible.');
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapFirebaseUser(firebaseUser));
      setError(null);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    
    if (!isFirebaseConfigured || !auth) {
      const msg = 'Firebase no está configurado. Revisa .env y reinicia.';
      setError(msg);
      throw new Error(msg);
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      const rawMessage = (err as Error)?.message || '';
      const message = mapFirebaseAuthError(code) || rawMessage || 'Error de autenticación. Intenta de nuevo.';
      console.error('Auth login error:', { code, rawMessage, err });
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setError(null);
    
    if (!isFirebaseConfigured || !auth) {
      const msg = 'Firebase no está configurado. Revisa .env y reinicia.';
      setError(msg);
      throw new Error(msg);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name }).catch((updateError) => {
        console.warn('No se pudo actualizar el perfil de usuario:', updateError);
      });
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      const rawMessage = (err as Error)?.message || '';
      const message = mapFirebaseAuthError(code) || rawMessage || 'Error de autenticación. Intenta de nuevo.';
      console.error('Auth register error:', { code, rawMessage, err });
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    setError(null);
    
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return;
    }

    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
