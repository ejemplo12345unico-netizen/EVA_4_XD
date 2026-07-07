import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/format';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, loading, loadProducts } = useProducts();

  useEffect(() => {
    const load = async () => {
      await loadProducts();
    };
    load();
  }, [loadProducts]);

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">Verde Limón</span>
          </div>
          <nav className="nav-links">
            <a href="#productos">Productos</a>
            <a href="#about">Sobre Nosotros</a>
            <a href="#contact">Contacto</a>
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="btn-admin">
                Panel Admin
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-login">
                Acceso Admin
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Productos Naturales para tu Bienestar</h1>
          <p className="hero-subtitle">
            Descubre nuestra colección de artículos 100% naturales y ecológicos
          </p>
          <button
            onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-cta"
          >
            Explorar Productos
          </button>
        </div>
        <div className="hero-image">
          <div className="hero-gradient"></div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="productos" className="featured-section">
        <div className="section-header">
          <h2>Nuestros Productos</h2>
          <p>Selección premium de artículos naturales</p>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="product-skeleton"></div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                ) : (
                  <div className="product-image-placeholder">
                    <span>📦</span>
                  </div>
                )}
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description.substring(0, 80)}...</p>
                  <div className="product-footer">
                    <span className="product-price">{formatCurrency(product.price)}</span>
                    {product.stock > 0 ? (
                      <span className="stock-badge in-stock">En Stock</span>
                    ) : (
                      <span className="stock-badge out-of-stock">Agotado</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No hay productos disponibles en este momento</p>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>Sobre Verde Limón</h2>
            <p>
              Somos una empresa comprometida con el bienestar natural y la sostenibilidad.
              Nuestros productos son cuidadosamente seleccionados para garantizar la máxima
              calidad y autenticidad.
            </p>
            <ul className="about-list">
              <li>✓ Productos 100% naturales y orgánicos</li>
              <li>✓ Proveedores certificados</li>
              <li>✓ Empaques ecológicos</li>
              <li>✓ Envío rápido y seguro</li>
            </ul>
          </div>
          <div className="about-image">
            <div className="about-card">
              <span className="big-icon">🌱</span>
              <p>Naturaleza pura en cada producto</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <h2>¿Tienes preguntas?</h2>
          <p>Contáctanos y te ayudaremos a encontrar el producto perfecto para ti</p>
          <button
            onClick={() => navigate(user ? '/contactos' : '/login')}
            className="btn-contact"
          >
            {user ? 'Ver Contactos' : 'Enviar Mensaje'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Verde Limón</h4>
            <p>Productos naturales de calidad</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><a href="#productos">Productos</a></li>
              <li><a href="#about">Sobre Nosotros</a></li>
              <li><a href="#contact">Contacto</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>info@verdelimon.cl</p>
            <p>+56 9 XXXX XXXX</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Verde Limón. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
