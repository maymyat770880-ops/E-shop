import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';


function Shop() {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    const { addToCart } = useCart();
    const [searchTerm,setSearchTerm] = useState("");

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    // Category Filter လုပ်တဲ့ Logic
    const filteredProducts = products.filter(product => {
    // ၁။ Category ကို စစ်တယ်
    const matchesCategory = filter === "All" || product.category === filter;
    
    // ၂။ Search Term ကို စစ်တယ် (စာလုံး အကြီးအသေး မရွေးအောင် toLowerCase သုံးမယ်)
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
});

    return (
       <div className="container my-5">
    <h2 className="fw-bold text-center mb-4">Our Tech Store</h2>
    
    <div className="row justify-content-center mb-4">
        <div className="col-md-6">
            {/* ဒီ div တစ်ခုတည်းမှာပဲ အကုန်စုထည့်လိုက်ပါမယ် */}
            <div className="input-group shadow-sm" style={{ borderRadius: '25px', overflow: 'hidden', border: '2px solid #007bff' }}>
                {/* ၁။ မှန်ဘီလူး Icon အပိုင်း */}
                <span className="input-group-text bg-white border-0" style={{ paddingLeft: '20px' }}>
                    <i className="bi bi-search text-primary"></i> 
                </span>
                
                {/* ၂။ Search ရိုက်မယ့် Input အပိုင်း (ဘောင်တွေကို ဖျောက်ထားပါတယ်) */}
                <input 
                    type="text" 
                    className="form-control border-0" 
                    placeholder="🔍Search for products..." 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ 
                        padding: '12px 20px 12px 0',
                        boxShadow: 'none' // Click နှိပ်ရင် ဘောင်အမည်းကြီး မပေါ်အောင်လို့ပါ
                    }}
                />
            </div>
        </div>
    </div>
    
    {/* ဒီအောက်မှာ Category ခလုတ်တွေ ဆက်ရှိပါလိမ့်မယ် */}


            {/* Category Filter Buttons - ဒီမှာပဲ ထားပါမယ် */}
            <div className="text-center mb-5">
                {['All', 'Laptops', 'Smartphones', 'Accessories'].map(cat => (
                    <button 
                        key={cat}
                        className={`btn mx-2 rounded-pill px-4 ${filter === cat ? 'btn-primary' : 'btn-outline-primary'}`} 
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="row">
                <div className="col-12 mb-3">
                    <span className="text-muted">{filteredProducts.length} Products Available</span>
                </div>
                
                {filteredProducts.map(p => (
                    <div className="col-lg-3 col-md-6 mb-4 d-flex align-items-stretch" key={p.id}>
                        <div className="card product-card border-0 shadow-sm w-100 rounded-4">
                            <img src={p.image || "https://via.placeholder.com/300x200"} className="card-img-top product-image rounded-top-4" alt={p.name} />
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
                ))}
            </div>
        </div>
    );
}

export default Shop;