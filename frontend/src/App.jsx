import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { FaShoppingBag, FaHome, FaPlus, FaSun, FaMoon, FaStore } from 'react-icons/fa';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <span className="logo-icon">
                <FaShoppingBag />
              </span>
              <span className="logo-text">TechStore</span>
            </Link>
            
            <div className="nav-links">
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <span className="link-icon">
                  <FaHome />
                </span>
                <span>Home</span>
              </NavLink>
              <NavLink to="/add" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <span className="link-icon">
                  <FaPlus />
                </span>
                <span>Add Product</span>
              </NavLink>
            </div>

            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <span className="theme-icon">
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </span>
            </button>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/add" element={<AddProduct />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <p className="footer-text">
            © 2024 TechStore - Built with <span className="heart-icon">❤️</span> and React
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
