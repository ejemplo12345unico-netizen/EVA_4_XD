import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import Loading from '../../components/Loading';
import { formatCurrency } from '../../utils/format';
import '../../styles/home.css';

const PublicProducts = () => {
  const { products, loading, loadProducts } = useProducts();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">Tienda</p>
          <h1 className="page-title">Nuestros Productos</h1>
          <p className="page-subtitle">Compra productos naturales y ecológicos</p>
        </div>
        <div className="nav-actions">
          <Link to="/">Volver al inicio</Link>
        </div>
      </header>

      {loading ? (
        <Loading message="Cargando productos..." />
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              {product.imageUrl && <img className="product-image" src={product.imageUrl} alt={product.name} />}
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description?.substring(0, 100)}...</p>
                <div className="product-footer">
                  <span className="product-price">{formatCurrency(product.price)}</span>
                </div>
                <div className="controls" style={{ marginTop: 12 }}>
                  <Link to={`/producto/${product.id}`} className="btn btn-primary">Ver detalle</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProducts;
