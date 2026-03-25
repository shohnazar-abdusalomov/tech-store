import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaImage, 
  FaStar, 
  FaDollarSign,
  FaAlignLeft,
  FaCheck,
  FaTimes,
  FaSync,
  FaExclamationCircle
} from 'react-icons/fa';

// API URL - use environment variable or fallback to localhost for development
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    rating: '',
  });
  const [images, setImages] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      showToast('Product title is required!', 'error');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast('Please enter a valid price!', 'error');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        images: images.filter(img => img.trim() !== '')
      };

      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const result = await response.json();
      const newProduct = result.data || result;
      showToast('Product created successfully!', 'success');
      
      setTimeout(() => navigate(`/product/${newProduct.id}`), 1500);
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      price: '',
      description: '',
      rating: '',
    });
    setImages(['']);
    setError(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-title-icon">
            <FaPlus />
          </span>
          Add New Product
        </h1>
        <p className="page-subtitle">Fill in the details to add a new product to your store</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              <span className="form-label-icon">
                <FaPlus />
              </span>
              Product Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              placeholder="e.g., iPhone 15 Pro Max"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label" htmlFor="price">
              <span className="form-label-icon">
                <FaDollarSign />
              </span>
              Price (USD) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className="form-input"
              placeholder="e.g., 999.99"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              <span className="form-label-icon">
                <FaAlignLeft />
              </span>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          {/* Rating */}
          <div className="form-group">
            <label className="form-label" htmlFor="rating">
              <span className="form-label-icon">
                <FaStar />
              </span>
              Rating (0-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              className="form-input"
              placeholder="e.g., 4.5"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={handleChange}
            />
            <p className="form-help">Rating should be between 0 and 5</p>
          </div>

          {/* Images */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">
                <FaImage />
              </span>
              Product Images (Optional)
            </label>
            <p className="form-help" style={{ color: 'var(--success)', marginBottom: '1rem' }}>
              ✨ If left empty, relevant images will be automatically generated based on the product title!
            </p>
            {images.map((image, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/image.jpg (optional)"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  style={{ flex: 1 }}
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeImageField(index)}
                    style={{ padding: '0.75rem' }}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={addImageField}
              style={{ marginTop: '0.5rem' }}
            >
              <FaPlus />
              Add Custom Image URL
            </button>
            <p className="form-help">Add custom image URLs if you want specific images</p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius)',
              color: 'var(--danger)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaExclamationCircle />
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                  Creating...
                </>
              ) : (
                <>
                  <FaCheck />
                  Create Product
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={handleReset}
              disabled={loading}
            >
              <FaSync />
              Reset
            </button>
          </div>
        </form>
      </div>

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

export default AddProduct;
