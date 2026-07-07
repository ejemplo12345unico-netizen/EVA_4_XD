import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../hooks/useProducts';
import Loading from '../../components/Loading';
import { formatCurrency } from '../../utils/format';

const ProductList = () => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const { user, logout } = useAuth();
  const { products, loading, error, loadProducts, removeProduct } = useProducts();

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await removeProduct(id);
    } catch {
      // handled in hook
    }
  };

  const filteredProducts = useMemo(
    () => products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterCategory || p.category === filterCategory),
    ),
    [products, search, filterCategory],
  );

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products],
  );

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">Inventario</p>
          <h1 className="page-title">Gestión de Productos</h1>
          <p className="page-subtitle">Organiza catálogo, stock y detalles de cada producto.</p>
        </div>
        <div className="nav-actions">
          <span>Bienvenido, <strong>{user?.name}</strong></span>
          <button onClick={logout} className="btn btn-danger">Cerrar Sesión</button>
        </div>
      </header>

      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="panel-header">
          <h2>Productos</h2>
          <Link to="/productos/nuevo" className="btn btn-primary">
            + Nuevo Producto
          </Link>
        </div>

        <div className="toolbar">
          <input
            className="form-input"
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '320px' }}
          />
          <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ maxWidth: '240px' }}>
            <option value="">Todas las categorías</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <Loading message="Cargando productos..." />
      ) : (
        <>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card card">
                {product.imageUrl && <img className="product-image" src={product.imageUrl} alt={product.name} />}
                <h3 style={{ margin: '0' }}>{product.name}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{product.category}</p>
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{formatCurrency(product.price)}</strong>
                  <span className="badge">Stock: {product.stock}</span>
                </div>
                <div className="controls" style={{ marginTop: '12px' }}>
                  <Link to={`/productos/${product.id}`} className="btn btn-primary" style={{ flex: 1 }}>Ver Detalle</Link>
                  <Link to={`/productos/editar/${product.id}`} className="btn btn-accent" style={{ flex: 1 }}>Editar</Link>
                  <button onClick={() => handleDelete(product.id)} className="btn btn-danger" style={{ flex: 1 }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && <p className="empty-state">No se encontraron productos</p>}
        </>
      )}

      {error && <p className="empty-state">{error}</p>}
    </div>
  );
};

export default ProductList;