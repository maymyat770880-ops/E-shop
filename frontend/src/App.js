import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import Home from './Home';
import Admin from './Admin';
import Login from './Login';
import Contact from './Contact';
import { useCart } from './CartContext';
import CartPage from './CartPage';
import Checkout from './Checkout';
import Shop from './Shop';
import ProductDetail from './ProductDetail';
import ServiceDetail from './ServiceDetail';
import User from './User';
import ThankYou from './ThankYou';

function App() {
  const { cartItems, addToCart } = useCart();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUserData(JSON.parse(loggedInUser));
    }
  }, []);

  

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUserData(null);
    alert("Logged out successfully");
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top py-3 shadow-sm border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            <span style={{ color: '#0062ff' }}>CYBER</span> GADGETS
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto align-items-center">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Home</NavLink>
              <NavLink to="/shop" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Shop</NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Contact Us</NavLink>

              <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-link active-link position-relative ms-2 me-3" : "nav-link position-relative ms-2 me-3"}>
                Cart 🛒
                {cartItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                    {cartItems.length}
                  </span>
                )}

              </NavLink>
              <NavLink to="/Login" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>Admin</NavLink>

              {/* Login/Logout Logic */}
              {userData ? (
                <div className="d-flex align-items-center ms-lg-3">
                  <span className="me-3 fw-bold text-primary">Hi, {userData.name}</span>
                  <button className="btn btn-outline-danger px-4 py-2 fw-bold" style={{ borderRadius: '10px' }} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link className="btn btn-dark px-4 py-2 ms-2 fw-bold" style={{ borderRadius: '10px' }} to="/User">
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path='/product/:id' element={<ProductDetail addToCart={addToCart} />} />
          <Route path='/service/:id' element={<ServiceDetail />} />
          <Route path='/User' element={<User />} />
          <Route path='/thank-you' element={<ThankYou/>}/>
        </Routes>
      </div>

      {/* Footer (သင်အလိုရှိတဲ့ ပထမပုံစံအတိုင်း ပြန်ပြင်ထားပါတယ်) */}

      {/* Footer အသစ် - ပိုပြီး Compact ဖြစ်အောင် ပြင်ထားပါတယ် */}
      <footer className="bg-dark text-white pt-4 pb-2 mt-auto">
        <div className="container">
          <div className="row">
            {/* Brand Section */}
            <div className="col-md-4 mb-3">
              <h6 className="fw-bold text-white mb-2">CYBER GADGETS</h6>
              <p style={{ fontSize: '13px' }} className="text-white-50">
                Providing premium tech accessories and gadgets with the best quality.
              </p>
            </div>

            {/* Quick Links Section */}
            <div className="col-md-4 mb-3 text-center">
              <h6 className="fw-bold text-white mb-2">Quick Links</h6>
              <div className="d-flex justify-content-center gap-3" style={{ fontSize: '13px' }}>
                <Link className="text-white-50 text-decoration-none" to="/">Home</Link>
                <Link className="text-white-50 text-decoration-none" to="/shop">Shop</Link>
                <Link className="text-white-50 text-decoration-none" to="/contact">Contact</Link>
                <Link className="text-white-50 text-decoration-none" to="/login">Admin</Link>
              </div>
            </div>

            {/* About/Copyright Section */}
            <div className="col-md-4 mb-3 text-md-end text-center">
              <h6 className="fw-bold text-white mb-2">Connect</h6>
              <p style={{ fontSize: '12px' }} className="text-white-50 mb-0">
                &copy; 2026 May Myat Noe. All rights reserved.
              </p>
            </div>
          </div>

          {/* Line အသေးလေးတစ်ခု ထပ်ထည့်မယ် */}
          <hr className="bg-secondary mt-2 mb-2" style={{ opacity: '0.2' }} />
        </div>
      </footer>
    </div>
  );
}

export default App;