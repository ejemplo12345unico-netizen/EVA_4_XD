import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import Loading from '../../components/Loading';
import { formatCurrency } from '../../utils/format';
import '../../styles/home.css';
import { useCart } from '../../context/CartContext';

const PublicProductDetail = () => {
  const { id } = useParams();
  const { getProduct } = useProducts();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const p = await getProduct(id);
      setProduct(p);
      setLoading(false);
    };
    load();
  }, [id, getProduct]);

  if (loading) return <Loading message="Cargando producto..." />;
  if (!product) return <div className="page-container"><p className="empty-state">Producto no encontrado</p></div>;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">Producto</p>
          <h1 className="page-title">{product.name}</h1>
        </div>
        <div className="nav-actions">
          <Link to="/tienda">Volver a la tienda</Link>
        </div>
      </header>

      <div className="panel">
        <div style={{ display: 'flex', gap: 24 }}>
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: 360, borderRadius: 12 }} />}
          <div>
            <p style={{ color: '#666' }}>{product.category}</p>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              <strong style={{ fontSize: 20 }}>{formatCurrency(product.price)}</strong>
              <button className="btn btn-accent" onClick={() => add(product, 1)} disabled={product.stock <= 0}>Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProductDetail;
