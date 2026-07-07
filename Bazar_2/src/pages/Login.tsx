import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase';
import { Toast } from '../components/Toast';
import { isValidEmail } from '../utils/format';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');

  const { login, register, user, isLoading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [authLoading, user, navigate, from]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !isValidEmail(value)) {
      setEmailError('Correo no válido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ message: 'Por favor completa todos los campos', type: 'error' });
      return;
    }

    if (!isValidEmail(email)) {
      setToast({ message: 'Correo electrónico inválido', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setToast({ message: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      if (!isFirebaseConfigured) {
        // Local fallback authentication
        const raw = localStorage.getItem('localUsers');
        const users = raw ? JSON.parse(raw) : [];
        const found = users.find((u: any) => u.email === email && u.password === password);
        if (found) {
          setToast({ message: 'Sesión iniciada (local)', type: 'success' });
          setTimeout(() => navigate(from, { replace: true }), 800);
        } else {
          setToast({ message: 'Usuario no encontrado (local). Regístrate primero.', type: 'error' });
        }
      } else {
        await login(email, password);
        setToast({ message: 'Bienvenido al panel administrativo', type: 'success' });
        setTimeout(() => navigate(from, { replace: true }), 1000);
      }
    } catch (error: unknown) {
      const msg = authError || (error as Error).message || 'Error al iniciar sesión';
      setToast({ message: msg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email || !password) {
      setToast({ message: 'Completa nombre, correo y contraseña', type: 'error' });
      return;
    }
    if (!isValidEmail(email)) {
      setToast({ message: 'Por favor ingresa un correo válido', type: 'error' });
      return;
    }
    if (password.length < 6) {
      setToast({ message: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
      return;
    }
    setIsLoading(true);
    try {
      if (!isFirebaseConfigured) {
        const raw = localStorage.getItem('localUsers');
        const users = raw ? JSON.parse(raw) : [];
        if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
          setToast({ message: 'El correo ya está registrado (local).', type: 'error' });
        } else {
          const newUser = { name: name.trim(), email: email.toLowerCase(), password };
          users.push(newUser);
          localStorage.setItem('localUsers', JSON.stringify(users));
          setToast({ message: 'Registro local exitoso. Ya puedes iniciar sesión.', type: 'success' });
          setIsRegistering(false);
          setName('');
          setEmail('');
          setPassword('');
        }
      } else {
        await register(email, password, name.trim());
        setToast({ message: 'Registro completado. Bienvenido.', type: 'success' });
        setIsRegistering(false);
      }
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Error al registrar';
      setToast({ message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = isRegistering ? (name && email && password && !emailError && !passwordError) : (email && password && !emailError && !passwordError);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-circle">🌿</div>
          <h1 className="brand-title">Verde Limón</h1>
          <p className="brand-subtitle">Panel Administrativo</p>
        </div>

        <form className="login-form" onSubmit={isRegistering ? handleRegister : handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <div className="input-wrapper">
                <input id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
              </div>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div className="input-wrapper">
              <input
                id="email"
                className={`form-input ${emailError ? 'error' : ''}`}
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="nombre@empresa.cl"
                disabled={isLoading}
                autoComplete="email"
              />
              {emailError && <span className="field-error">{emailError}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <input
                id="password"
                className={`form-input ${passwordError ? 'error' : ''}`}
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
              {passwordError && <span className="field-error">{passwordError}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="login-button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {isRegistering ? 'Registrando...' : 'Ingresando...'}
              </>
            ) : (
              isRegistering ? 'Registrarse' : 'Iniciar Sesión'
            )}
          </button>
        </form>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 10 }}>
          <button className="btn-ghost" onClick={() => setIsRegistering((s) => !s)}>
            {isRegistering ? 'Volver a iniciar sesión' : 'Crear una cuenta'}
          </button>
        </div>

        <div className="login-footer">
          <p className="footer-text">
            Usa las credenciales configuradas en <strong>Firebase Authentication</strong>
          </p>
          {!isFirebaseConfigured && (
            <div className="warning-box">
              ⚠️ Firebase no está configurado. Revisa tu archivo <code>.env</code>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default Login;