import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaBox, 
  FaPlus, 
  FaTrash, 
  FaStar, 
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaFire,
  FaArrowRight
} from 'react-icons/fa';

// API URL - use environment variable or fallback to localhost for development
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const result = await response.json();
      setProducts(result.data?.products || result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts(products.filter(p => p.id !== id));
      setDeleteModal({ show: false, product: null });
      showToast('Product deleted successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FaExclamationTriangle />
        </div>
        <div className="empty-title">Error Loading Products</div>
        <div className="empty-text">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">
            <FaShoppingBag />
          </span>
          TechStore Products
        </h1>
        <p className="page-subtitle">Discover our amazing collection of tech products</p>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaBox />
          </div>
          <div className="empty-title">No Products Found</div>
          <div className="empty-text">Start by adding your first product!</div>
          <Link to="/add" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            <FaPlus />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="product-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="product-image-container">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const placeholder = e.target.nextSibling;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div
                  className="image-placeholder"
                  style={{ display: 'none' }}
                >
                  <FaBox />
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>No Image</span>
                </div>
                {product.rating >= 4.5 && (
                  <span className="product-badge">
                    <FaFire style={{ marginRight: '4px' }} />
                    Hot
                  </span>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-meta">
                  <span className="product-price">${parseFloat(product.price).toLocaleString()}</span>
                  <div className="product-rating">
                    <span className="rating-star">
                      <FaStar />
                    </span>
                    <span>{parseFloat(product.rating).toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <FaArrowRight />
                    View Details
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteModal({ show: true, product })}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ show: false, product: null })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              <FaExclamationTriangle />
              Delete Product
            </h2>
            <p className="modal-text">
              Are you sure you want to delete <strong>{deleteModal.product.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteModal({ show: false, product: null })}
              >
                <FaTimes />
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteModal.product.id)}
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <FaCheck /> : <FaTimes />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Home;
