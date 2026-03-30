import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaStar, FaShoppingCart, FaHeart, FaShareAlt, FaCheck, FaBox,
  FaTruck, FaShieldAlt, FaSyncAlt, FaMinus, FaPlus, FaBolt
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartAnimating, setCartAnimating] = useState(false);
  const [liked, setLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const imageRef = useRef(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const result = await response.json();
      const p = result.data?.product || result.data;
      setProduct(p);
      // Fetch related products
      const allRes = await fetch(`${API_URL}/api/products`);
      if (allRes.ok) {
        const allResult = await allRes.json();
        const all = allResult.data?.products || allResult.data || [];
        setRelatedProducts(all.filter(r => r.id !== p?.id).slice(0, 4));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [fetchProduct]);

  // Load liked state from localStorage
  useEffect(() => {
    if (product) {
      const likes = JSON.parse(localStorage.getItem('likes') || '[]');
      setLiked(likes.some(l => l.id === product.id));
    }
  }, [product]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-orb" />
          <div className="loading-text">LOADING</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-state">
          <div className="error-icon"><FaBox /></div>
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/" className="btn-back-home">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage]?.url || null;

  const handleAddToCart = () => {
    if (cartAnimating) return;
    setCartAnimating(true);
    
    // Fly image to cart animation
    const imgEl = imageRef.current;
    const cartEl = document.querySelector('.cart-btn-premium:not(.likes-btn-premium)');
    if (imgEl && cartEl) {
      const imgRect = imgEl.getBoundingClientRect();
      const cartRect = cartEl.getBoundingClientRect();
      const flyEl = document.createElement('div');
      flyEl.style.cssText = `
        position: fixed;
        width: 80px; height: 80px;
        border-radius: 50%;
        overflow: hidden;
        z-index: 9999;
        left: ${imgRect.left + imgRect.width / 2 - 40}px;
        top: ${imgRect.top + imgRect.height / 2 - 40}px;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        box-shadow: 0 0 20px var(--neon-blue);
      `;
      if (product.images?.[selectedImage]?.url) {
        flyEl.innerHTML = `<img src="${product.images[selectedImage].url}" style="width:100%;height:100%;object-fit:cover" />`;
      } else {
        flyEl.style.background = 'var(--neon-blue)';
      }
      document.body.appendChild(flyEl);
      requestAnimationFrame(() => {
        flyEl.style.left = `${cartRect.left + cartRect.width / 2 - 15}px`;
        flyEl.style.top = `${cartRect.top + cartRect.height / 2 - 15}px`;
        flyEl.style.width = '30px';
        flyEl.style.height = '30px';
        flyEl.style.opacity = '0.5';
      });
      setTimeout(() => flyEl.remove(), 900);
    }

    setTimeout(() => {
      for (let i = 0; i < quantity; i++) addToCart(product);
      setAddedToCart(true);
      setCartAnimating(false);
      setTimeout(() => setAddedToCart(false), 2500);
    }, 800);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    navigate('/checkout');
  };

  const handleLike = () => {
    const likes = JSON.parse(localStorage.getItem('likes') || '[]');
    const isLiked = likes.some(l => l.id === product.id);
    if (isLiked) {
      localStorage.setItem('likes', JSON.stringify(likes.filter(l => l.id !== product.id)));
      setLiked(false);
    } else {
      localStorage.setItem('likes', JSON.stringify([...likes, product]));
      setLiked(true);
    }
    window.dispatchEvent(new Event('likesUpdated'));
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/#products">Products</Link>
          <span>/</span>
          <span>{product.title}</span>
        </nav>

        <div className="product-main-content">
          {/* Gallery Section */}
          <div className="product-gallery">
            <div className="gallery-main">
              <div className="main-image-container">
                {currentImage ? (
                  <img ref={imageRef} src={currentImage} alt={product.title} className="main-image" />
                ) : (
                  <div className="image-placeholder" ref={imageRef}>
                    <FaBox />
                    <span>No Image Available</span>
                  </div>
                )}
                <div className="image-glow" />
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="gallery-thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img.url} alt={`${product.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="product-info-section">
            <div className="product-header">
              <span className="product-category">Technology</span>
              <h1 className="product-title">{product.title}</h1>
              
              <div className="product-rating-detail">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.rating || 4.5) ? 'filled' : ''} />
                  ))}
                </div>
                <span className="rating-value">{parseFloat(product.rating || 4.5).toFixed(1)}</span>
                <span className="rating-count">(128 reviews)</span>
              </div>
            </div>

            <div className="product-price-section">
              <span className="current-price">${(parseFloat(product.price) * quantity).toLocaleString()}</span>
              <span className="original-price">${(parseFloat(product.price) * quantity * 1.2).toFixed(2)}</span>
              <span className="discount-badge">17% OFF</span>
            </div>

            <p className="product-description-detail">{product.description}</p>

            <div className="product-features">
              <div className="feature-item">
                <FaTruck /> Free Shipping
              </div>
              <div className="feature-item">
                <FaShieldAlt /> 2 Year Warranty
              </div>
              <div className="feature-item">
                <FaSyncAlt /> 30 Day Returns
              </div>
            </div>

            <div className="quantity-selector">
              <label>Quantity</label>
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <FaMinus />
                </button>
                <span className="qty-display">{quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className={`btn-add-to-cart ${addedToCart ? 'added' : ''} ${cartAnimating ? 'animating' : ''}`}
                onClick={handleAddToCart}
                disabled={cartAnimating}
              >
                <FaShoppingCart className={cartAnimating ? 'cart-icon-moving' : ''} />
                {addedToCart ? '✓ Added to Cart!' : cartAnimating ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className="btn-buy-now" onClick={handleBuyNow}>
                <FaBolt /> Buy Now
              </button>
              <button className={`btn-wishlist-detail ${liked ? 'liked' : ''}`} onClick={handleLike}>
                <FaHeart />
              </button>
              <button className="btn-share" onClick={handleShare}>
                <FaShareAlt />
              </button>
            </div>

            <div className="delivery-info">
              <div className="delivery-row">
                <FaTruck /> Free delivery by <strong>April 5, 2026</strong>
              </div>
              <div className="delivery-row">
                <FaCheck /> Order within <strong>2 hours 30 minutes</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Product Description</h3>
                <p>{product.description}</p>
                <p>
                  Experience the latest in technology with this premium device. 
                  Designed for those who demand excellence, it combines cutting-edge 
                  features with elegant design to deliver an unparalleled user experience.
                </p>
                <ul>
                  <li>Premium build quality with aerospace-grade materials</li>
                  <li>Advanced processing power for seamless multitasking</li>
                  <li>Stunning display with vivid colors and sharp details</li>
                  <li>All-day battery life with fast charging support</li>
                  <li>Enhanced security features for peace of mind</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-panel">
                <h3>Technical Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td>Brand</td>
                      <td>TechStore Pro</td>
                    </tr>
                    <tr>
                      <td>Model</td>
                      <td>TS-{id || '000'}-PRO</td>
                    </tr>
                    <tr>
                      <td>Release Year</td>
                      <td>2026</td>
                    </tr>
                    <tr>
                      <td>Warranty</td>
                      <td>2 Years Limited</td>
                    </tr>
                    <tr>
                      <td>Weight</td>
                      <td>254g</td>
                    </tr>
                    <tr>
                      <td>Dimensions</td>
                      <td>158.2 x 77.9 x 7.3 mm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <h3>Customer Reviews</h3>
                <div className="reviews-summary">
                  <div className="overall-rating">
                    <span className="rating-number">{parseFloat(product.rating || 4.5).toFixed(1)}</span>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(product.rating || 4.5) ? 'filled' : ''} />
                      ))}
                    </div>
                    <span>Based on 128 reviews</span>
                  </div>
                </div>
                <div className="reviews-list">
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">JD</div>
                      <div>
                        <h4>John Doe</h4>
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                        </div>
                      </div>
                    </div>
                    <p>Absolutely amazing product! Exceeded all my expectations. The quality is outstanding and the performance is top-notch.</p>
                  </div>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">SM</div>
                      <div>
                        <h4>Sarah Miller</h4>
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                        </div>
                      </div>
                    </div>
                    <p>Best purchase I've made this year. Fast shipping, excellent packaging, and the product itself is incredible.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h2>You Might Also Like</h2>
          <div className="related-grid">
            {relatedProducts.length > 0 ? relatedProducts.map((item) => (
              <div key={item.id} className="related-card" onClick={() => { navigate(`/product/${item.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <div className="related-image">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0].url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
                  ) : <FaBox />}
                </div>
                <h4>{item.title}</h4>
                <span className="related-price">${parseFloat(item.price).toLocaleString()}</span>
              </div>
            )) : [1,2,3,4].map(i => (
              <div key={i} className="related-card">
                <div className="related-image"><FaBox /></div>
                <h4>Related Product {i}</h4>
                <span className="related-price">—</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
