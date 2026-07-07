import { useNavigate } from 'react-router-dom';
import '../styles/access-admin.css';

const AccessAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="access-admin-container">
      <div className="access-card">
        <div className="access-header">
          <div className="logo-circle">🌿</div>
          <h1>Verde Limón</h1>
          <p>Panel Administrativo</p>
        </div>

        <div className="access-content">
          <h2>¿Eres Administrador?</h2>
          <p className="access-subtitle">
            Accede al panel de control para gestionar productos, contactos y más.
          </p>

          <div className="button-group">
            <button
              onClick={() => navigate('/login')}
              className="btn-access btn-login-access"
            >
              <span className="btn-icon">🔐</span>
              <span>Iniciar Sesión</span>
            </button>

            <button
              onClick={() => navigate('/register')}
              className="btn-access btn-register-access"
            >
              <span className="btn-icon">✨</span>
              <span>Crear Cuenta</span>
            </button>
          </div>

          <div className="access-footer">
            <p>¿No tienes cuenta? Crea una nueva para acceder al panel.</p>
          </div>
        </div>

        <button
          onClick={() => window.history.back()}
          className="btn-back"
        >
          ← Volver a la tienda
        </button>
      </div>
    </div>
  );
};

export default AccessAdmin;
