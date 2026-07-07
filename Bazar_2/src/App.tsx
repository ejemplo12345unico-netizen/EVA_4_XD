import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { isFirebaseConfigured } from './firebase';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import ProductDetail from './pages/Products/ProductDetail';
import ContactList from './pages/Contacts/ContactList';
import ContactForm from './pages/Contacts/ContactForm';
import AdminLayout from './components/AdminLayout';
import PublicProducts from './pages/Products/PublicProducts';
import PublicProductDetail from './pages/Products/PublicProductDetail';
import About from './pages/About';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="page-container">Cargando...</div>;
  }

  return user ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function App() {
  const firebaseWarning = !isFirebaseConfigured ? (
    <div className="firebase-warning" style={{ background: '#fff4e5', padding: 12, borderRadius: 6, margin: 12, border: '1px solid #ffd9a8' }}>
      <strong>Atención:</strong> Firebase no está configurado.
      <div style={{ marginTop: 8 }}>
        Copia `.env.example` a `.env` y completa las variables de Firebase.
      </div>
      <pre style={{ marginTop: 8, background: '#fff', padding: 8, borderRadius: 4 }}>
        <code>cp .env.example .env</code>
      </pre>
    </div>
  ) : null;

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        {firebaseWarning}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contacto" element={<ContactForm />} />
          <Route path="/tienda" element={<PublicProducts />} />
          <Route path="/producto/:id" element={<PublicProductDetail />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/productos" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/productos/nuevo" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
          <Route path="/productos/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/productos/editar/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
          <Route path="/contactos" element={<ProtectedRoute><ContactList /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;