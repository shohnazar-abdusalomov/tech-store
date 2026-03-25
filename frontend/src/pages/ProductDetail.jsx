import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaTrash, 
  FaStar, 
  FaCalendar, 
  FaImages, 
  FaHashtag,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaMobileAlt
} from 'react-icons/fa';

// API URL - use environment variable or fallback to localhost for development
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const result = await response.json();
      setProduct(result.data || result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      
      showToast('Product deleted successfully!', 'success');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FaExclamationTriangle />
        </div>
        <div className="empty-title">Product Not Found</div>
        <div className="empty-text">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1.5rem' }}>
          <FaArrowLeft />
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft />
        Back to Products
      </button>

      <div className="detail-container">
        <div className="detail-header">
          <div className="detail-image-section">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.title}
                  className="detail-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const placeholder = e.target.nextSibling;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
                <div className="image-placeholder" style={{ fontSize: '8rem', display: 'none' }}>
                  <FaMobileAlt />
                  <span style={{ fontSize: '1rem', marginTop: '0.5rem' }}>Image not available</span>
                </div>
              </>
            ) : (
              <div className="image-placeholder" style={{ fontSize: '8rem' }}>
                <FaMobileAlt />
                <span style={{ fontSize: '1rem', marginTop: '0.5rem' }}>No images</span>
              </div>
            )}
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{product.title}</h1>
            
            <div className="detail-price">
              ${parseFloat(product.price).toLocaleString()}
            </div>

            <div className="detail-rating">
              <span className="rating-score">
                <FaStar />
                {parseFloat(product.rating).toFixed(1)}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {product.rating >= 4.5 ? 'Excellent!' : product.rating >= 4 ? 'Very Good' : 'Good'}
              </span>
            </div>

            <p className="detail-description">{product.description}</p>

            <div className="detail-meta">
              <span className="meta-tag">
                <FaCalendar />
                {formatDate(product.created_at)}
              </span>
              {product.images?.length > 0 && (
                <span className="meta-tag">
                  <FaImages />
                  {product.images.length} image(s)
                </span>
              )}
              <span className="meta-tag">
                <FaHashtag />
                ID: {product.id}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-danger"
                onClick={() => setDeleteModal(true)}
              >
                <FaTrash />
                Delete Product
              </button>
            </div>
          </div>
        </div>

        {product.images && product.images.length > 1 && (
          <div className="detail-images">
            <h3 className="images-title">
              <FaImages />
              Product Images ({product.images.length})
            </h3>
            <div className="images-grid">
              {product.images.map((image, index) => (
                <img
                  key={image.id || index}
                  src={image.url}
                  alt={`${product.title} - Image ${index + 1}`}
                  className={`mini-image ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    e.target.style.opacity = '0.3';
                    e.target.title = 'Image failed to load';
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              <FaExclamationTriangle />
              Delete Product
            </h2>
            <p className="modal-text">
              Are you sure you want to delete <strong>{product.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteModal(false)}>
                <FaTimes />
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
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

export default ProductDetail;
