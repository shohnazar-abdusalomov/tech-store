import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { FaShoppingBag, FaPlus, FaSun, FaMoon, FaStore, FaShoppingCart, FaBars, FaTimes, FaBox, FaHeart } from 'react-icons/fa';
import { CartContext } from './context/CartContext';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Category from './pages/Category';
import './App.css';

function GlobalCursor() {
  const ref = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    if (isTouch) {
      // Mobile: touch ripple
      const onTouch = (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        el.style.left = touch.clientX + 'px';
        el.style.top = touch.clientY + 'px';
        el.classList.add('touch-active');
      };
      const onTouchEnd = () => el.classList.remove('touch-active');
      window.addEventListener('touchstart', onTouch, { passive: true });
      window.addEventListener('touchmove', onTouch, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
      return () => {
        window.removeEventListener('touchstart', onTouch);
        window.removeEventListener('touchmove', onTouch);
        window.removeEventListener('touchend', onTouchEnd);
      };
    } else {
      // Desktop: mouse cursor
      const onMove = (e) => {
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
      };
      const onOver = (e) => {
        setHovering(!!e.target.closest('a,button,[role="button"],.product-card,.category-card,.deal-card,.why-card,.testimonial-card'));
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseover', onOver);
      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseover', onOver);
      };
    }
  }, []);

  return <div ref={ref} className={`custom-cursor${hovering ? ' hovering' : ''}`} />;
}

function NavBar({ scrolled, theme, setTheme, menuOpen, setMenuOpen, setCartOpen, setLikesOpen, likedProducts, getCartCount }) {
  const location = useLocation();
  const [scrollSection, setScrollSection] = useState('home');
  const activeSection = location.pathname !== '/' ? '' : scrollSection;

  useEffect(() => {
    if (location.pathname !== '/') return;
    setScrollSection('home');
    const handleScroll = () => {
      const sections = ['deals', 'products', 'categories'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setScrollSection(id);
            return;
          }
        }
      }
      setScrollSection('home');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const goHome = () => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar-premium ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container-premium">
        <Link to="/" className="nav-logo-premium" onClick={goHome}>
          <span className="logo-icon-premium"><FaStore /></span>
          <span className="logo-text-premium">TECH</span>
          <span className="logo-accent-premium">STORE</span>
        </Link>

        <div className={`nav-menu-premium ${menuOpen ? 'active' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link-premium${isActive && activeSection === 'home' ? ' nav-active' : ''}`
            }
            onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >Home</NavLink>
          <button
            className={`nav-link-premium${activeSection === 'categories' ? ' nav-active' : ''}`}
            onClick={() => scrollTo('categories')}
          >Categories</button>
          <button
            className={`nav-link-premium${activeSection === 'products' ? ' nav-active' : ''}`}
            onClick={() => scrollTo('products')}
          >Products</button>
          <button
            className={`nav-link-premium${activeSection === 'deals' ? ' nav-active' : ''}`}
            onClick={() => scrollTo('deals')}
          >Deals</button>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `nav-link-premium nav-link-cta-premium${isActive ? ' nav-active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          ><FaPlus /> Add Product</NavLink>
        </div>

        <div className="nav-actions-premium">
          <button className="theme-toggle-premium" onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">
            <span className="theme-icon-premium">{theme === 'light' ? <FaMoon /> : <FaSun />}</span>
          </button>
          <button className="cart-btn-premium likes-btn-premium" onClick={() => { setLikesOpen(o => !o); setCartOpen(false); }} aria-label="View liked products">
            <FaHeart />
            {likedProducts.length > 0 && <span className="likes-badge-premium">{likedProducts.length}</span>}
          </button>
          <button className="cart-btn-premium" onClick={() => { setCartOpen(o => !o); setLikesOpen(false); }} aria-label="Open cart">
            <FaShoppingCart />
            {getCartCount() > 0 && <span className="cart-badge-premium">{getCartCount()}</span>}
          </button>
          <button className="hamburger-premium" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [likedProducts, setLikedProducts] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadLikes = () => {
      const saved = JSON.parse(localStorage.getItem('likes') || '[]');
      setLikedProducts(saved);
    };
    loadLikes();
    window.addEventListener('likesUpdated', loadLikes);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('likesUpdated', loadLikes);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const cartValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    cartOpen,
    setCartOpen
  };

  const removeLike = (productId) => {
    const updated = likedProducts.filter(p => p.id !== productId);
    localStorage.setItem('likes', JSON.stringify(updated));
    setLikedProducts(updated);
    window.dispatchEvent(new Event('likesUpdated'));
  };

  return (
    <CartContext.Provider value={cartValue}>
      <Router>
        <div className="app">
          <GlobalCursor />
          <NavBar
            scrolled={scrolled}
            theme={theme}
            setTheme={setTheme}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            cartOpen={cartOpen}
            setCartOpen={setCartOpen}
            likesOpen={likesOpen}
            setLikesOpen={setLikesOpen}
            likedProducts={likedProducts}
            getCartCount={getCartCount}
          />

          {/* Fullscreen Mobile Menu */}
          <div className={`mobile-menu-overlay ${menuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-content">
              <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/#categories" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Categories</Link>
              <Link to="/#products" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Products</Link>
              <Link to="/#deals" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Deals</Link>
              <Link to="/#about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/#contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>
              <Link to="/add" className="mobile-nav-link mobile-nav-cta" onClick={() => setMenuOpen(false)}>
                <FaPlus /> Add Product
              </Link>
            </div>
          </div>

          <main className="main-content-premium">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/add" element={<AddProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/category/:categoryName" element={<Category />} />
            </Routes>
          </main>

          <footer className="footer-premium">
            <div className="footer-content-premium">
              <div className="footer-brand-premium">
                <div className="footer-logo-premium">
                  <span className="logo-icon-premium">
                    <FaStore />
                  </span>
                  <span className="logo-text-premium">TECH</span>
                  <span className="logo-accent-premium">STORE</span>
                </div>
                <p className="footer-tagline-premium">Building the future of technology shopping experience.</p>
              </div>

              <div className="footer-links-premium">
                <div className="footer-column-premium">
                  <h4>Shop</h4>
                  <Link to="/#categories">Categories</Link>
                  <Link to="/#products">Products</Link>
                  <Link to="/#deals">Deals</Link>
                  <Link to="/#new-arrivals">New Arrivals</Link>
                </div>
                <div className="footer-column-premium">
                  <h4>Support</h4>
                  <a href="#">Help Center</a>
                  <a href="#">Track Order</a>
                  <a href="#">Returns</a>
                  <a href="#">Warranty</a>
                </div>
                <div className="footer-column-premium">
                  <h4>Company</h4>
                  <Link to="/#about">About Us</Link>
                  <a href="#">Careers</a>
                  <a href="#">Press</a>
                  <a href="#">Contact</a>
                </div>
              </div>

              <div className="footer-bottom-premium">
                <p>&copy; 2026 TechStore. All rights reserved.</p>
                <div className="footer-social-premium">
                  <a href="#" className="social-link-premium" aria-label="Twitter">ð•</a>
                  <a href="#" className="social-link-premium" aria-label="LinkedIn">in</a>
                  <a href="#" className="social-link-premium" aria-label="GitHub">GH</a>
                </div>
              </div>
            </div>
          </footer>

          {/* Cart Sidebar */}
          <div className={`cart-sidebar ${cartOpen ? 'active' : ''}`}>
            <div className="cart-sidebar-header">
              <h3>Shopping Cart</h3>
              <button className="cart-close-btn" onClick={() => setCartOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="cart-sidebar-content">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <FaShoppingBag />
                  <p>Your cart is empty</p>
                  <button onClick={() => setCartOpen(false)}>Continue Shopping</button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                          {item.images && item.images[0] ? (
                            <img src={item.images[0].url} alt={item.title} />
                          ) : (
                            <FaBox />
                          )}
                        </div>
                        <div className="cart-item-details">
                          <h4>{item.title}</h4>
                          <p className="cart-item-price">${parseFloat(item.price).toLocaleString()}</p>
                          <div className="cart-item-quantity">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                        <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-sidebar-footer">
                    <div className="cart-total">
                      <span>Total</span>
                      <span>${getCartTotal().toLocaleString()}</span>
                    </div>
                    <Link to="/checkout" className="checkout-btn" onClick={() => setCartOpen(false)}>
                      Checkout
                    </Link>
                    <Link to="/cart" className="view-cart-btn" onClick={() => setCartOpen(false)}>
                      View Cart
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={`cart-overlay ${cartOpen || likesOpen ? 'active' : ''}`} onClick={() => { setCartOpen(false); setLikesOpen(false); }} />

          {/* Likes Sidebar */}
          <div className={`cart-sidebar likes-sidebar ${likesOpen ? 'active' : ''}`}>
            <div className="cart-sidebar-header">
              <h3>Liked Products</h3>
              <button className="cart-close-btn" onClick={() => setLikesOpen(false)}><FaTimes /></button>
            </div>
            <div className="cart-sidebar-content">
              {likedProducts.length === 0 ? (
                <div className="cart-empty">
                  <FaHeart />
                  <p>No liked products yet</p>
                  <button onClick={() => setLikesOpen(false)}>Browse Products</button>
                </div>
              ) : (
                <div className="cart-items">
                  {likedProducts.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0].url} alt={item.title} />
                        ) : <FaBox />}
                      </div>
                      <div className="cart-item-details">
                        <h4>{item.title}</h4>
                        <p className="cart-item-price">${parseFloat(item.price).toLocaleString()}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <Link
                            to={`/product/${item.id}`}
                            className="btn-quick-view"
                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                            onClick={() => setLikesOpen(false)}
                          >
                            View
                          </Link>
                          <button
                            onClick={() => { addToCart(item); }}
                            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', background: 'var(--neon-blue)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeLike(item.id)}>
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Router>
    </CartContext.Provider>
  );
}

export default App;



