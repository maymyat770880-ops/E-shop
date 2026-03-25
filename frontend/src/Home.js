import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        axios.get('https://e-shop-npm.vercel.app/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    // ၁။ New Arrivals (အသစ်ဆုံး ၃ ခု)
    const newArrivals = products.slice(-3).reverse();

    const navigate = useNavigate();

    // ၂။ Popular Products (Search နဲ့ စစ်ပြီး ၆ ခုပဲပြမယ်)
    const filteredPopular = products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 6);

    return (
        <div>
            {/* Hero Section with Search */}
            <div className="hero-section text-white text-center">
                <div className="container py-5">
                    <h1 className="display-4 fw-bold mb-3">Future-Proof Your Life</h1>
                    <p className="lead mb-4 opacity-75">Curated collection of the world's finest gadgets.</p>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control form-control-lg shadow-sm rounded-pill"
                                placeholder="Search for gadgets..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Promotion Section */}
<div className="container my-5">
    <div className="p-5 text-center bg-light rounded-3 border shadow-sm" 
         style={{ background: 'linear-gradient(90deg, #e3f2fd 0%, #ffffff 100%)' }}>
        <h2 className="text-primary fw-bold">🔥 Special Summer Sale!</h2>
        <p className="lead text-muted">Get up to <span className="text-danger fw-bold">40% OFF</span> on all Premium Gadgets.</p>
        <div className="badge bg-danger p-2 mb-3">Code: CYBER2026</div>
        <div>
            <button className="btn btn-primary btn-lg px-4" onClick={() => navigate('/Shop')}>
                Shop Now
            </button>
        </div>
    </div>
</div>



        

            {/* Section 1: New Arrivals */}
            <div className="container mt-5">
                <h3 className="fw-bold mb-4">✨ New Arrivals</h3>
                <div className="row">
                    {newArrivals.map(p => (
                        <div className="col-md-4 mb-4 d-flex align-items-stretch" key={p.id}>
                            <div className="card product-card border-0 shadow-sm w-100 rounded-4">
                                <span className="badge bg-danger position-absolute m-3">New</span>
                                <img src={p.image || "https://via.placeholder.com/300x200"} className="card-img-top product-image rounded-top-4" alt={p.name} />
                                <div className="card-body d-flex flex-column">
                                    <h6 className="fw-bold mb-1">{p.name}</h6>
                                    <p className="text-primary fw-bold mb-3">${p.price}</p>

                                    <div className="mt-auto">
                                        <button className="btn btn-primary btn-sm w-100 mb-2 py-2 fw-bold" onClick={() => addToCart(p)}>Add to Cart</button>
                                        <Link to={`/product/${p.id}`} className="btn btn-outline-primary btn-sm w-100 py-2 fw-bold">View Details</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            

            {/* Section 2: Popular Products */}
            <div className="container mt-5 py-5 border-top border-bottom bg-light rounded-5">
                <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                    <h3 className="fw-bold">🔥 Popular Products</h3>
                    <Link to="/shop" className="btn btn-sm btn-primary px-3 rounded-pill">View All Shop →</Link>
                </div>
                <div className="row">
                    {filteredPopular.map(p => (
                        <div className="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch" key={p.id}>
                            <div className="card product-card border-0 shadow w-100 rounded-4">
                                <img src={p.image || "https://via.placeholder.com/300x200"} className="card-img-top product-image rounded-top-4" alt={p.name} />
                                <div className="card-body d-flex flex-column">
                                    <h6 className="fw-bold mb-2">{p.name}</h6>
                                    <p className="text-muted small flex-grow-1">{p.description}</p>
                                    <h5 className="text-primary fw-bold my-3">${p.price}</h5>

                                    <div className="mt-auto">
                                        <button className="btn btn-primary btn-sm w-100 mb-2 py-2 fw-bold" onClick={() => addToCart(p)}>Add to Cart</button>
                                        <Link to={`/product/${p.id}`} className="btn btn-outline-primary btn-sm w-100 py-2 fw-bold">View Details</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 3: Our Services */}
            <div className="container my-5 py-5 text-center">
                <h3 className="fw-bold mb-5">Our Premium Services</h3>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="service-box p-4 shadow-sm rounded-4 bg-white h-100 d-flex flex-column">
                            <h2 className="mb-3">🚚</h2>
                            <h5 className="fw-bold">Free Delivery</h5>
                            <p className="text-muted small flex-grow-1">On all orders over $500</p>
                            <Link to="/service/1" className='btn btn-outline-dark rounded-pill'>Read More</Link>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="service-box p-4 shadow-sm rounded-4 bg-white h-100 d-flex flex-column">
                            <h2 className="mb-3">🛡️</h2>
                            <h5 className="fw-bold">Secure Payment</h5>
                            <p className="text-muted small flex-grow-1">100% safe transactions</p>
                            <Link to="/service/2" className='btn btn-outline-dark rounded-pill'>Read More</Link>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="service-box p-4 shadow-sm rounded-4 bg-white h-100 d-flex flex-column">
                            <h2 className="mb-3">⭐</h2>
                            <h5 className="fw-bold">Quality Service</h5>
                            <p className="text-muted small flex-grow-1">Certified products only</p>
                            <Link to="/service/3" className='btn btn-outline-dark rounded-pill'>Read More</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;