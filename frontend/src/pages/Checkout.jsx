import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaCheck, FaArrowLeft, FaArrowRight, FaCreditCard, FaLock, FaShippingFast, FaBox } from 'react-icons/fa';

function Checkout() {
  const { cart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderNumber] = useState(() => Date.now().toString().slice(-8));
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [orderComplete, setOrderComplete] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = () => {
    setOrderComplete(true);
    setTimeout(() => {
      navigate('/');
    }, 5000);
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <FaBox />
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart to checkout.</p>
          <Link to="/" className="btn-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">
            <FaCheck />
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <p className="order-number">Order #TS-{orderNumber}</p>
          <p className="redirect-text">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Store
          </Link>
          <h1>Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Information</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Shipping</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Payment</span>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            {/* Step 1: Information */}
            {step === 1 && (
              <div className="checkout-step">
                <h2>Contact Information</h2>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
                
                <h2>Shipping Address</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Tech Street"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="San Francisco"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="CA"
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="94102"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Country</label>
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>France</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="checkout-step">
                <h2>Shipping Method</h2>
                
                <div className="shipping-options">
                  <label className="shipping-option selected">
                    <input type="radio" name="shipping" defaultChecked />
                    <div className="shipping-info">
                      <FaShippingFast />
                      <div>
                        <h4>Free Shipping</h4>
                        <p>Delivery in 5-7 business days</p>
                      </div>
                    </div>
                    <span className="shipping-price">Free</span>
                  </label>
                  
                  <label className="shipping-option">
                    <input type="radio" name="shipping" />
                    <div className="shipping-info">
                      <FaShippingFast />
                      <div>
                        <h4>Express Shipping</h4>
                        <p>Delivery in 2-3 business days</p>
                      </div>
                    </div>
                    <span className="shipping-price">$14.99</span>
                  </label>
                  
                  <label className="shipping-option">
                    <input type="radio" name="shipping" />
                    <div className="shipping-info">
                      <FaShippingFast />
                      <div>
                        <h4>Next Day Delivery</h4>
                        <p>Delivery tomorrow by 12 PM</p>
                      </div>
                    </div>
                    <span className="shipping-price">$29.99</span>
                  </label>
                </div>

                <div className="delivery-summary">
                  <h3>Delivery Address</h3>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.state} {formData.zip}</p>
                  <p>{formData.country}</p>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="checkout-step">
                <h2>Payment Method</h2>
                
                <div className="payment-methods">
                  <label className="payment-method selected">
                    <input type="radio" name="payment" defaultChecked />
                    <FaCreditCard />
                    <span>Credit Card</span>
                  </label>
                </div>
                
                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="secure-badge">
                  <FaLock /> Your payment is secure and encrypted
                </div>
              </div>
            )}

            <div className="checkout-actions">
              {step > 1 && (
                <button className="btn-back" onClick={handlePrevStep}>
                  <FaArrowLeft /> Back
                </button>
              )}
              {step < 3 ? (
                <button className="btn-next" onClick={handleNextStep}>
                  Continue <FaArrowRight />
                </button>
              ) : (
                <button className="btn-place-order" onClick={handlePlaceOrder}>
                  Place Order
                </button>
              )}
            </div>
          </div>

          <div className="checkout-summary-section">
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-image">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0].url} alt={item.title} />
                      ) : (
                        <FaBox />
                      )}
                      <span className="item-qty">{item.quantity}</span>
                    </div>
                    <div className="summary-item-info">
                      <p className="item-title">{item.title}</p>
                    </div>
                    <span className="item-price">
                      ${(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getCartTotal().toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">Free</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="summary-divider" />
              
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
