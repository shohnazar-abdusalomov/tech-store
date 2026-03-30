import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, FaBox, FaPlus, FaStar, FaExclamationTriangle, FaCheck, FaTimes,
  FaFire, FaArrowRight, FaRocket, FaChevronDown, FaPlay, FaMobile, FaLaptop,
  FaHeadphones, FaGamepad, FaShippingFast, FaShieldAlt, FaHeadset,
  FaSyncAlt, FaHeart, FaEye, FaBolt, FaTruck, FaCreditCard, FaClock, FaGift,
  FaClipboardList
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';

// API URL
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

// Custom cursor component — Home.jsx dan olib tashlandi, App.jsx da global

// Animated particles background
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() > 0.5 ? 200 : 270
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();

        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(220, 80%, 60%, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

// Scroll progress indicator
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-progress">
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

// Page preloader
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`preloader ${progress >= 100 ? 'hidden' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-logo">
          <span className="logo-text">TECH</span>
          <span className="logo-accent">STORE</span>
        </div>
        <div className="preloader-bar">
          <div className="preloader-progress" style={{ width: `${progress}%` }} />
        </div>
        <div className="preloader-text">LOADING</div>
      </div>
    </div>
  );
};

// Animated counter component
const AnimatedCounter = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = target / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref} className="animated-counter">
      {count}{suffix}
    </span>
  );
};

// Section reveal animation wrapper
const RevealSection = ({ children, className = '', id = '' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={ref}
      id={id}
      className={`reveal-section ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-timer">
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">Mins</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="countdown-label">Secs</span>
      </div>
    </div>
  );
};

function Home() {
  const { addToCart, cart, updateQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const [scrollHidden, setScrollHidden] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // Load liked products from localStorage
    const savedLikes = JSON.parse(localStorage.getItem('likes') || '[]');
    setLikedProducts(savedLikes.map(p => p.id));
    
    // Listen for like updates
    const handleLikesUpdate = () => {
      const savedLikes = JSON.parse(localStorage.getItem('likes') || '[]');
      setLikedProducts(savedLikes.map(p => p.id));
    };
    window.addEventListener('likesUpdated', handleLikesUpdate);
    
    // Hide scroll indicator on scroll
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollHidden(true);
      } else {
        setScrollHidden(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('likesUpdated', handleLikesUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
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

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedProducts(prev => [...prev, product.id]);
    setTimeout(() => setAddedProducts(prev => prev.filter(id => id !== product.id)), 2000);
    showToast(`${product.title} added to cart!`, 'success');
  };

  const handleQtyChange = (e, product, delta) => {
    e.stopPropagation();
    const cartItem = cart.find(i => i.id === product.id);
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + delta);
    }
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

  const scrollToExplore = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/category/${categoryTitle.toLowerCase()}`);
  };

  const handleGrabDeal = (e, deal) => {
    e.stopPropagation();
    // Create a product from deal data
    const product = {
      id: `deal-${deal.id}`,
      title: deal.title,
      price: deal.price,
      description: `Flash deal! ${deal.discount}% off`,
      images: [{ url: '', product_id: `deal-${deal.id}` }]
    };
    addToCart(product);
    showToast(`${deal.title} added to cart!`, 'success');
  };

  // Categories data
  const categories = [
    { id: 1, icon: <FaMobile />, title: 'Phones', count: '156 Products' },
    { id: 2, icon: <FaLaptop />, title: 'Laptops', count: '89 Products' },
    { id: 3, icon: <FaHeadphones />, title: 'Audio', count: '234 Products' },
    { id: 4, icon: <FaGamepad />, title: 'Gaming', count: '178 Products' },
    { id: 5, icon: <FaClipboardList />, title: 'Wearables', count: '67 Products' },
  ];

  // Why Choose Us data
  const whyChooseUs = [
    { icon: <FaTruck />, title: 'Free Shipping', description: 'Free delivery on orders over $100' },
    { icon: <FaShieldAlt />, title: '2 Year Warranty', description: 'Extended manufacturer warranty' },
    { icon: <FaSyncAlt />, title: 'Easy Returns', description: '30-day hassle-free returns' },
    { icon: <FaHeadset />, title: '24/7 Support', description: 'Round-the-clock assistance' },
  ];

  // Testimonials data
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Tech Enthusiast', text: 'Absolutely love the product quality! The shipping was incredibly fast and the customer service exceeded my expectations.' },
    { name: 'Michael Chen', role: 'Software Engineer', text: 'Best tech store I\'ve ever shopped at. The prices are competitive and the products are genuine.' },
    { name: 'Emily Rodriguez', role: 'Digital Creator', text: 'The unboxing experience was premium. Every detail was thoughtfully designed, from packaging to presentation.' },
  ];

  // Featured Deals data
  const deals = [
    { id: 1, title: 'ProMax Ultra Smartphone', price: 999, originalPrice: 1299, discount: 23, sold: 156, stock: 200, image: '📱', endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
    { id: 2, title: 'Quantum X Laptop', price: 1499, originalPrice: 1999, discount: 25, sold: 89, stock: 150, image: '💻', endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
    { id: 3, title: 'NeoPods Pro Max', price: 249, originalPrice: 349, discount: 29, sold: 234, stock: 300, image: '🎧', endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
  ];

  // Product Showcase data with real images
  const showcases = [
    {
      tag: 'New Arrival',
      title: 'iPhone 17 Pro Max',
      description: 'The most powerful iPhone ever. Featuring the A19 Ultra chip, a revolutionary camera system with 200MP sensor, and all-day battery life that goes beyond.',
      features: ['A19 Ultra Chip', '200MP Camera', '48hr Battery'],
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=600&fit=crop',
      youtubeUrl: 'https://www.youtube.com/watch?v=FT3ODSg1GFE',
      slug: 'iphone-17-pro-max',
      color: 'blue'
    },
    {
      tag: 'Coming Soon',
      title: 'MacBook Pro M4',
      description: 'Supercharged by M4. The first laptop built from the ground up for AI. Incredible performance meets unprecedented efficiency.',
      features: ['M4 Max Chip', '48hr Battery', '8K Display'],
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
      youtubeUrl: 'https://www.youtube.com/watch?v=6vMpSL4VUiE',
      slug: 'macbook-pro-m4',
      color: 'purple'
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-orb" />
        <div className="loading-text">LOADING</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <ParticleBackground />
      <ScrollProgress />
      <Preloader onComplete={() => {}} />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-gradient" />
        <div className="hero-grid-bg" />
        <div className="hero-visual">
          <div className="floating-shapes">
            <div className="shape shape-1" />
            <div className="shape shape-2" />
            <div className="shape shape-3" />
            <div className="shape shape-4" />
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <FaRocket />
            <span>Next Generation Technology</span>
          </div>
          
          <h1 className="hero-title">
            <span className="hero-title-line">Experience the</span>
            <span className="hero-title-line"><span className="gradient-text">Future of Tech</span></span>
          </h1>
          
          <p className="hero-description">
            Discover premium gadgets, cutting-edge smartphones, and revolutionary devices 
            that transform how you live, work, and play.
          </p>
          
          <div className="hero-actions">
            <button onClick={scrollToProducts} className="btn-hero-primary">
              <FaBolt />
              <span>Shop Now</span>
              <div className="btn-glow" />
            </button>
            <button onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')} className="btn-hero-secondary">
              <FaPlay />
              <span>Watch Demo</span>
            </button>
          </div>
          
          <div className={`hero-scroll-indicator ${scrollHidden ? 'hidden' : ''}`} onClick={scrollToExplore}>
            <span>Scroll to explore</span>
            <FaChevronDown className="scroll-icon" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <RevealSection id="categories" className="categories-section">
        <div className="section-header">
          <span className="section-tag">Browse</span>
          <h2 className="section-title">Shop by <span className="gradient-text">Category</span></h2>
          <p className="section-description">
            Find exactly what you're looking for with our curated collections
          </p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className="category-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCategoryClick(category.title)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3 className="category-title">{category.title}</h3>
              <p className="category-count">{category.count}</p>
              <div className="category-glow" />
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Featured Products Section */}
      <RevealSection id="products" className="featured-section">
        <div className="section-header">
          <span className="section-tag">Featured</span>
          <h2 className="section-title">Trending <span className="gradient-text">Products</span></h2>
          <p className="section-description">
            Handpicked selection of the hottest tech gadgets
          </p>
        </div>
        
        {error ? (
          <div className="error-state">
            <div className="error-icon"><FaExclamationTriangle /></div>
            <div className="error-title">Error Loading Products</div>
            <div className="error-message">{error}</div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FaBox /></div>
            <h3 className="empty-state-title">No Products Yet</h3>
            <p className="empty-state-text">Start building your collection today!</p>
            <Link to="/add" className="btn-primary">
              <FaPlus /> Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.slice(0, 8).map((product, index) => (
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
                  
                  {product.rating >= 4.5 && (
                    <div className="product-badge">
                      <FaFire /> Hot
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
                  <p className="product-category">Technology</p>
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
      </RevealSection>

      {/* Top Deals Section */}
      <RevealSection id="deals" className="deals-section">
        <div className="section-header">
          <span className="section-tag">Limited Time</span>
          <h2 className="section-title">Flash <span className="gradient-text">Deals</span></h2>
          <p className="section-description">
            Grab these exclusive offers before they're gone
          </p>
        </div>
        
        <div className="deals-grid">
          {deals.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="deal-badge">
                <FaFire /> SALE
              </div>
              
              <div className="deal-content">
                <div className="deal-product-image">
                  <span style={{ fontSize: '5rem' }}>{deal.image}</span>
                </div>
                
                <h3 className="deal-title">{deal.title}</h3>
                
                <div className="deal-prices">
                  <span className="deal-price">${deal.price}</span>
                  <span className="deal-original-price">${deal.originalPrice}</span>
                  <span className="deal-discount">-{deal.discount}%</span>
                </div>
                
                <CountdownTimer targetDate={deal.endDate} />
                
                <div className="deal-progress">
                  <div className="deal-progress-header">
                    <span>Sold</span>
                    <span>{Math.round((deal.sold / deal.stock) * 100)}%</span>
                  </div>
                  <div className="deal-progress-bar">
                    <div 
                      className="deal-progress-fill" 
                      style={{ width: `${(deal.sold / deal.stock) * 100}%` }}
                    />
                  </div>
                </div>
                
                <button className="btn-deal" onClick={(e) => handleGrabDeal(e, deal)}>
                  <FaBolt /> Grab This Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Product Showcase Section */}
      <RevealSection className="showcase-section">
        <div className="showcase-container">
          {showcases.map((item, index) => (
            <div key={index} className="showcase-item">
              <div className="showcase-visual">
                <div className="showcase-image-container">
                  <div className="showcase-glow blue" />
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="showcase-image"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1rem' }}
                  />
                </div>
              </div>
              
              <div className="showcase-content">
                <span className="showcase-tag">{item.tag}</span>
                <h2 className="showcase-title">{item.title}</h2>
                <p className="showcase-description">{item.description}</p>
                
                <div className="showcase-features">
                  {item.features.map((feature, i) => (
                    <div key={i} className="showcase-feature">
                      <FaCheck /> <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="showcase-actions">
                  <button 
                    className="btn-hero-primary"
                    onClick={() => {
                      // Find product by title keyword
                      const keyword = item.title.toLowerCase().includes('iphone') ? 'iphone' : 'macbook';
                      const found = products.find(p => p.title.toLowerCase().includes(keyword));
                      if (found) navigate(`/product/${found.id}`);
                      else navigate('/category/' + (keyword === 'iphone' ? 'phones' : 'laptops'));
                    }}
                  >
                    <span>Learn More</span>
                    <div className="btn-glow" />
                  </button>
                  <button 
                    className="btn-hero-secondary"
                    onClick={() => window.open(item.youtubeUrl, '_blank')}
                  >
                    <FaPlay />
                    <span>Watch Video</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Why Choose Us Section */}
      <RevealSection className="why-section">
        <div className="section-header">
          <span className="section-tag">Why Us</span>
          <h2 className="section-title">The TechStore <span className="gradient-text">Advantage</span></h2>
          <p className="section-description">
            Premium experience with every purchase
          </p>
        </div>
        
        <div className="why-grid">
          {whyChooseUs.map((item, index) => (
            <div key={index} className="why-card">
              <div className="why-icon">{item.icon}</div>
              <h3 className="why-title">{item.title}</h3>
              <p className="why-description">{item.description}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Testimonials Section */}
      <RevealSection className="testimonials-section">
        <div className="section-header">
          <span className="section-tag">Reviews</span>
          <h2 className="section-title">What Our <span className="gradient-text">Customers Say</span></h2>
          <p className="section-description">
            Join thousands of satisfied customers worldwide
          </p>
        </div>
        
        <div className="testimonials-slider">
          <div className="testimonials-track">
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Newsletter Section */}
      <RevealSection className="newsletter-section">
        <div className="newsletter-container">
          <span className="section-tag">Newsletter</span>
          <h2 className="section-title">Stay in the <span className="gradient-text">Loop</span></h2>
          <p className="section-description">
            Subscribe to get exclusive offers, latest tech news, and more.
          </p>
          
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); showToast('Thanks for subscribing!', 'success'); }}>
            <input 
              type="email" 
              className="newsletter-input" 
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="btn-newsletter">
              Subscribe
            </button>
          </form>
        </div>
      </RevealSection>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-futuristic toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' ? <FaCheck /> : <FaTimes />}
          </div>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default Home;
