import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Admin() {
    // --- State Variables ---
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [messages, setMessages] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // --- Authentication Check ---
    useEffect(() => {
        const auth = localStorage.getItem('isAuthenticated');
        if (auth !== 'true') {
            navigate('/login');
        }
    }, [navigate]);

    // ========== DATA FETCHING FUNCTIONS ==========
    
    // Fetch products from Supabase
    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });
            
            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };
    // Fetch orders from Supabase
    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    // Fetch messages from Supabase
    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    // Fetch all reviews from Supabase
    const fetchAllReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setAllReviews(data || []);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    // ========== PRODUCT CRUD ==========
    
    const resetForm = () => {
        setName('');
        setPrice('');
        setDescription('');
        setImage('');
        setCategory('');
        setIsEditing(false);
        setCurrentId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const productData = {
            name,
            price: parseFloat(price),
            description,
            category: category || 'Accessories',
            image: image || null
        };

        if (isEditing) {
            // Update existing product
            try {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', currentId);
                
                if (error) throw error;
                alert("Product Updated! ✅");
                resetForm();
                fetchProducts();
            } catch (err) {
                console.error("Error updating product:", err);
                alert("Failed to update product");
            }
        } else {
            // Add new product
            try {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                
                if (error) throw error;
                alert("Product Added! 🚀");
                resetForm();
                fetchProducts();
            } catch (err) {
                console.error("Error adding product:", err);
                alert("Failed to add product");
            }
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentId(product.id);
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setCategory(product.category);
        setImage(product.image);
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                alert("Deleted!");
                fetchProducts();
            } catch (err) {
                console.error("Error deleting product:", err);
                alert("Failed to delete product");
            }
        }
    };
    // ========== ORDER MANAGEMENT ==========
    
    const updateOrderStatus = async (orderId, currentStatus) => {
        const newStatus = currentStatus === 'Pending' ? 'Delivered' : 'Pending';
        
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);
            
            if (error) throw error;
            alert("Order Status Updated! ✅");
            fetchOrders();
        } catch (err) {
            console.error("Error updating order:", err);
            alert("Failed to update order status");
        }
    };

    // ========== MESSAGE MANAGEMENT ==========
    
    const markAsRead = async (id) => {
        try {
            const { error } = await supabase
                .from('contacts')
                .update({ is_read: true })
                .eq('id', id);
            
            if (error) throw error;
            fetchMessages();
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    };

    const deleteMessage = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                const { error } = await supabase
                    .from('contacts')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                fetchMessages();
            } catch (err) {
                console.error("Error deleting message:", err);
            }
        }
    };

    // ========== REVIEW MANAGEMENT ==========
    
    const deleteReview = async (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                const { error } = await supabase
                    .from('reviews')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                fetchAllReviews();
            } catch (err) {
                console.error("Error deleting review:", err);
            }
        }
    };

    // ========== INITIAL DATA LOAD ==========
    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchMessages();
        fetchAllReviews();
    }, []);

    // ========== LOGOUT ==========
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    // Filter products by search term
    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="container my-5 text-center py-5">Loading admin dashboard...</div>;
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard 🛠️</h2>
                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </div>

            <div className="row">
                {/* --- Left Column: Add Product & Manage --- */}
                <div className="col-12 col-sm-6 col-md-4 mb-4">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-dark text-white font-weight-bold">Add New Product</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <input 
                                    type="text" 
                                    className="form-control mb-2" 
                                    placeholder="Product Name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                />
                                <input 
                                    type="number" 
                                    className="form-control mb-2" 
                                    placeholder="Price" 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)} 
                                    required 
                                />
                                <textarea 
                                    className="form-control mb-2" 
                                    placeholder="Description" 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    required 
                                />
                                
                                <select 
                                    className="form-select mb-2"
                                    onChange={(e) => setCategory(e.target.value)}
                                    value={category}
                                >
                                    <option value="">-- Select Category --</option>
                                    <option value="Laptops">Laptops</option>
                                    <option value="Smartphones">Smartphones</option>
                                    <option value="Accessories">Accessories</option>
                                </select>

                                <input 
                                    type="text" 
                                    className="form-control mb-2" 
                                    placeholder="Image URL" 
                                    value={image} 
                                    onChange={(e) => setImage(e.target.value)} 
                                />
                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? "Update Product" : "Upload Product"}
                                </button>
                                {isEditing && (
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary ms-2" 
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-secondary text-white font-weight-bold">Manage Products</div>
                        <div className="card-body">
                            <input
                                type="text"
                                className="form-control mb-3"placeholder="Search products by name..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <ul className="list-group list-group-flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {filteredProducts.map(p => (
                                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span className="text-truncate" style={{ maxWidth: '150px' }}>
                                            {p.name} - ${p.price}
                                        </span>
                                        <div className='d-flex gap-2'>
                                            <button 
                                                onClick={() => handleEdit(p)} 
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => deleteProduct(p.id)} 
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Orders & Messages --- */}
                <div className="col-md-8">
                    {/* Customer Orders Table */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                            <span className="font-weight-bold">Customer Orders 📦</span>
                            <button className="btn btn-sm btn-light" onClick={fetchOrders}>Refresh</button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 text-center">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer</th>
                                            <th>Phone</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>{orders.length > 0 ? orders.map((order) => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.customer_name}</td>
                                                <td>{order.phone_number}</td>
                                                <td className="text-success fw-bold">${order.total_price}</td>
                                                <td>
                                                    <button
                                                        className={order.status === 'Pending' ? "btn btn-warning btn-sm" : "btn btn-success btn-sm"}
                                                        onClick={() => updateOrderStatus(order.id, order.status)}
                                                    >
                                                        {order.status}
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="py-4 text-muted">No orders available yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Customer Messages Table */}
                    <div className="card shadow-sm border-0 mt-4">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <span className="fw-bold">Customer Messages ✉️</span>
                            <button className="btn btn-sm btn-light" onClick={fetchMessages}>Refresh</button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr className="table-light text-center">
                                            <th style={{ width: '20%' }}>Name</th>
                                            <th style={{ width: '25%' }}>Email</th>
                                            <th style={{ width: '35%' }}>Message</th>
                                            <th style={{ width: '20%' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {messages.map((msg) => (
                                            <tr key={msg.id} style={{ backgroundColor: msg.is_read ? '#f8f9fa' : '#fff' }}>
                                                <td>{msg.name}</td>
                                                <td>{msg.email}</td>
                                                <td>{msg.message}</td>
                                                <td className="text-center">
                                                    <div className="d-flex flex-column gap-2 justify-content-center">
                                                        {!msg.is_read && (
                                                            <button
                                                                className="btn btn-sm btn-info text-white"
                                                                onClick={() => markAsRead(msg.id)}
                                                            >Mark Read
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => deleteMessage(msg.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}</tbody>
                                        </table>
                            </div>
                        </div>
                    </div>

                    {/* Customer Reviews Table */}
                    <div className="card mt-4 shadow-sm border-0">
                        <div className="card-header bg-danger text-white fw-bold">Manage Customer Reviews 💬</div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Product ID</th>
                                            <th>Rating</th>
                                            <th>Comment</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allReviews.length > 0 ? allReviews.map((rev) => (
                                            <tr key={rev.id}>
                                                <td>{rev.user_name}</td>
                                                <td>{rev.product_id}</td>
                                                <td>{rev.rating ? '⭐'.repeat(rev.rating) : '-'}</td>
                                                <td className="small text-muted" style={{ maxWidth: '200px' }}>
                                                    {rev.comment?.substring(0, 50)}...
                                                </td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger" 
                                                        onClick={() => deleteReview(rev.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">No reviews yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;