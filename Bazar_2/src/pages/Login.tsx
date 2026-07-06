import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [authLoading, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const message = (error as Error).message || '';
      if (!isFirebaseConfigured) {
        setError('Firebase no está configurado. Revisa .env y reinicia la app.');
      } else if (message.includes('user-not-found')) {
        setError('Usuario no encontrado.');
      } else if (message.includes('wrong-password')) {
        setError('Contraseña incorrecta.');
      } else if (message.includes('invalid-email')) {
        setError('Correo inválido.');
      } else if (message.includes('too-many-requests')) {
        setError('Demasiados intentos. Intenta más tarde.');
      } else {
        setError(`Error al iniciar sesión: ${message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand-mark">🌿</div>
        <div className="auth-heading">
          <h1>Verde Limón</h1>
          <p>Intranet administrativa</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Correo electrónico</span>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@verdelimon.cl"
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
            />
          </label>

          {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-hint">
          <p>Ingresa con una cuenta creada en Firebase Authentication.</p>
          <p><strong>Configura usuarios válidos en Firebase</strong> antes de usar la app.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;