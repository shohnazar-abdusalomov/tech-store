import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBox, FaStar, FaPlus, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    rating: '4.5',
    category: 'phones'
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: reader.result,
            file: file
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageRemove = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        rating: parseFloat(formData.rating),
        category: formData.category,
        images: images.map((img) => ({ url: img.url }))
      };

      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || `Server error: ${response.status}`);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="add-product-page">
        <div className="success-message">
          <div className="success-icon-large">
            <FaCheck />
          </div>
          <h2>Product Created Successfully!</h2>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <div className="page-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Store
          </Link>
          <h1>Add New Product</h1>
          <p className="page-subtitle">Create a new product listing for your store</p>
        </div>

        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Product Information</h2>
            
            <div className="form-group">
              <label htmlFor="title">Product Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}>
                <option value="phones">Phones</option>
                <option value="laptops">Laptops</option>
                <option value="audio">Audio</option>
                <option value="gaming">Gaming</option>
                <option value="wearables">Wearables</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <div className="rating-input">
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="5"
                  />
                  <div className="stars-preview">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(formData.rating) ? 'filled' : ''} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="6"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Product Images</h2>
            
            <div className="image-upload-area">
              <div className="image-preview-grid">
                {images.map((img) => (
                  <div key={img.id} className="image-preview">
                    <img src={img.url} alt="Product preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => handleImageRemove(img.id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                
                <label className="add-image-btn">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageAdd}
                    hidden
                  />
                  <FaPlus />
                  <span>Add Images</span>
                </label>
              </div>
              <p className="upload-hint">Upload product images (PNG, JPG, GIF up to 5MB each)</p>
            </div>
          </div>

          {error && (
            <div className="error-message-form">
              <FaTimes /> {error}
            </div>
          )}

          <div className="form-actions">
            <Link to="/" className="btn-cancel">
              Cancel
            </Link>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus /> Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
