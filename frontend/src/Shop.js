import React, { useEffect, useState } from 'react';
import './App.css';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Shop() {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    // Supabase ကနေ data fetch လုပ်မယ်
    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*');

                if (error) throw error;
                console.log('Shop products:', data);
                setProducts(data || []);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Category Filter + Search Filter
    const filteredProducts = products.filter(product => {
        // ၁။ Category စစ်တယ်
        const matchesCategory = filter === "All" || product.category === filter;
        // ၂။ Search Term စစ်တယ်
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Loading State
    if (loading) {
        return (
            <div className="container my-5 text-center py-5">
                <h3>Loading products...</h3>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <h2 className="fw-bold text-center mb-4">Our Tech Store</h2>

            {/* Search Bar */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <div className="input-group shadow-sm" style={{ borderRadius: '25px', overflow: 'hidden', border: '2px solid #007bff' }}>
                        <span className="input-group-text bg-white border-0" style={{ paddingLeft: '20px' }}>
                            <i className="bi bi-search text-primary"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-0"
                            placeholder="🔍 Search for products..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '12px 20px 12px 0',
                                boxShadow: 'none'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Category Filter Buttons */}
            {/* Category Filter Buttons */}
            <div className="text-center mb-5">
                <div className="category-buttons">
                    {['All', 'Laptops', 'Smartphones', 'Accessories'].map(cat => (
                        <button
                            key={cat}
                            className={`btn ${filter === cat ? 'btn-primary' : 'btn-outline-primary'} rounded-pill`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="row">
                <div className="col-12 mb-3">
                    <span className="text-muted">{filteredProducts.length} Products Available</span>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">No products found. Try a different search term or category.</p>
                    </div>
                ) : (
                    filteredProducts.map(p => (
                        <div className="col-lg-3 col-md-6 mb-4 d-flex align-items-stretch" key={p.id}>
                            <div className="card product-card border-0 shadow-sm w-100 rounded-4">
                                <img
                                    src={p.image || "https://via.placeholder.com/300x200"}
                                    className="card-img-top product-image rounded-top-4"
                                    alt={p.name}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h6 className="fw-bold mb-1">{p.name}</h6>
                                    <p className="text-muted small mb-2">{p.category}</p>
                                    <h5 className="text-primary fw-bold mb-3">${p.price}</h5>

                                    <div className="mt-auto">
                                        <button
                                            className="btn btn-primary btn-sm w-100 mb-2 py-2 fw-bold"
                                            onClick={() => addToCart(p)}
                                        >
                                            Add to Cart
                                        </button>
                                        <Link
                                            to={`/product/${p.id}`}
                                            className="btn btn-outline-primary btn-sm w-100 py-2 fw-bold"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Shop;