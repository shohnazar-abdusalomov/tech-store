import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBox, FaStar, FaShoppingBag, FaArrowRight, FaHeart, FaEye } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

function Category() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const result = await response.json();
      const allProducts = result.data?.products || result.data || [];
      const catLower = categoryName?.toLowerCase();
      const filtered = allProducts.filter(p =>
        p.category?.toLowerCase() === catLower ||
        p.title?.toLowerCase().includes(catLower) ||
        p.description?.toLowerCase().includes(catLower)
      );
      setProducts(filtered.length > 0 ? filtered : allProducts.slice(0, 8));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchProducts();
    const savedLikes = JSON.parse(localStorage.getItem('likes') || '[]');
    setLikedProducts(savedLikes.map(p => p.id));
    const handleLikesUpdate = () => {
      const saved = JSON.parse(localStorage.getItem('likes') || '[]');
      setLikedProducts(saved.map(p => p.id));
    };
    window.addEventListener('likesUpdated', handleLikesUpdate);
    return () => window.removeEventListener('likesUpdated', handleLikesUpdate);
  }, [fetchProducts]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedProducts(prev => [...prev, product.id]);
    setTimeout(() => setAddedProducts(prev => prev.filter(id => id !== product.id)), 2000);
  };

  const handleQtyChange = (e, product, delta) => {
    e.stopPropagation();
    const cartItem = cart.find(i => i.id === product.id);
    if (cartItem) updateQuantity(product.id, cartItem.quantity + delta);
  };

  const handleLike = (e, product) => {
    e.stopPropagation();
    const likes = JSON.parse(localStorage.getItem('likes') || '[]');
    const isLiked = likes.some(l => l.id === product.id);
    if (isLiked) {
      localStorage.setItem('likes', JSON.stringify(likes.filter(l => l.id !== product.id)));
    } else {
      localStorage.setItem('likes', JSON.stringify([...likes, product]));
    }
    setLikedProducts(prev => 
      isLiked ? prev.filter(id => id !== product.id) : [...prev, product.id]
    );
    window.dispatchEvent(new Event('likesUpdated'));
  };

  const categoryTitle = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 'All Products';

  if (loading) {
    return (
      <div className="category-page">
        <div className="loading-container">
          <div className="loading-orb" />
          <div className="loading-text">LOADING</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="error-state">
          <div className="error-icon"><FaBox /></div>
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <Link to="/" className="btn-back-home">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
        <h1>{categoryTitle}</h1>
        <p>{products.length} Products</p>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FaBox /></div>
          <h3 className="empty-state-title">No Products Found</h3>
          <p className="empty-state-text">No products in this category yet.</p>
          <Link to="/" className="btn-primary">
            <FaArrowLeft /> Browse All Products
          </Link>
        </div>
      ) : (
        <div className="category-products-grid">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="product-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="product-image-wrapper">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="product-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="product-image-placeholder">
                    <FaBox />
                    <span>No Image</span>
                  </div>
                )}
                
                <div className="product-overlay">
                  <div className="product-overlay-actions">
                    <button className="btn-quick-view" onClick={() => navigate(`/product/${product.id}`)}>
                      <FaEye /> View
                    </button>
                    <button 
                      className={`btn-wishlist ${likedProducts.includes(product.id) ? 'liked' : ''}`}
                      onClick={(e) => handleLike(e, product)}
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="product-info">
                <p className="product-category">{categoryTitle}</p>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-meta">
                  <span className="product-price">
                    ${parseFloat(product.price).toLocaleString()}
                  </span>
                  <div className="product-rating">
                    <FaStar />
                    <span>{parseFloat(product.rating || 4.5).toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="product-actions">
                  {(() => {
                    const cartItem = cart.find(i => i.id === product.id);
                    const isAdded = addedProducts.includes(product.id);
                    if (cartItem && !isAdded) {
                      return (
                        <div className="card-qty-controls" onClick={e => e.stopPropagation()}>
                          <button className="card-qty-btn" onClick={(e) => handleQtyChange(e, product, -1)}>−</button>
                          <span className="card-qty-num">{cartItem.quantity}</span>
                          <button className="card-qty-btn" onClick={(e) => handleQtyChange(e, product, 1)}>+</button>
                        </div>
                      );
                    }
                    return (
                      <button
                        className={`btn-add-cart ${isAdded ? 'added' : ''}`}
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <FaShoppingBag /> {isAdded ? 'Added!' : 'Add to Cart'}
                      </button>
                    );
                  })()}
                  <button className="btn-details" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Category;
