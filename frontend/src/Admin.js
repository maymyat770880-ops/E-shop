import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
    // --- State Variables ---
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [messages, setMessages] = useState([]); // Customer Messages သိမ်းရန်



    const navigate = useNavigate();

    // --- Authentication Check ---
    useEffect(() => {
        const auth = localStorage.getItem('isAuthenticated');
        if (auth !== 'true') {
            navigate('/login');
        }
    }, [navigate]);

    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const handleEdit = (product) => {
        setIsEditing(true);         // Editing mode ထဲ ဝင်သွားပြီလို့ မှတ်မယ်
        setCurrentId(product.id);   // ဘယ် ID ကို ပြင်မှာလဲဆိုတာ မှတ်ထားမယ်

        // အောက်က နာမည်တွေက နင့်ရဲ့ Form input state နာမည်တွေနဲ့ တူရမယ်နော်
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setCategory(product.category);
        setImage(product.image);
    };

    const [searchTerm, setSearchTerm] = useState("");


    const [allReviews, setAllReviews] = useState([]);
    const fetchAllReviews = async () => {
    const res = await axios.get('https://e-shop-npm.vercel.app/api/all-reviews');
    setAllReviews(res.data);
};
const deleteReview = async (id) => {
    if(window.confirm("Are you sure you want to delete this review?")) {
        await axios.delete(`https://e-shop-npm.vercel.app/api/reviews/${id}`);
        fetchAllReviews(); // list ကို refresh လုပ်မယ်
    }
};
useEffect(()=>{
    fetchAllReviews();
},[]);


    const updateOrderStatus = async (orderId, currentStatus) => {
        const newStatus = currentStatus === 'Pending' ? 'Delivered' : 'Pending';

        try {
            const response = await fetch(`https://e-shop-npm.vercel.app/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                alert("Order Status Updated! ✅");
                fetchOrders(); // ဇယားကို Refresh ပြန်လုပ်ဖို့ (နင့်ဆီမှာ order ခေါ်တဲ့ function နာမည် စစ်ပေးပါ)
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // --- Data Fetching Functions ---
    const fetchProducts = () => {
        axios.get('https://e-shop-npm.vercel.app/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error fetching products:", err));
    };

    const fetchOrders = () => {
        axios.get('https://e-shop-npm.vercel.app/api/orders')
            .then(res => setOrders(res.data))
            .catch(err => console.error("Error fetching orders:", err));
    };

    const fetchMessages = () => {
        axios.get('https://e-shop-npm.vercel.app/api/messages')
            .then(res => setMessages(res.data))
            .catch(err => console.error("Error fetching messages:", err));
    };

    // Page စဖွင့်တာနဲ့ အချက်အလက်အားလုံးကို ယူမယ်
    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchMessages();
    }, []);

    const resetForm = () => {
        setName('');
        setPrice('');
        setDescription('');
        setImage('');
        setIsEditing(false);
        setCurrentId(null);
    };

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = { name, price, description, category, image };


        if (isEditing) {
            // --- (၁) Edit လုပ်မည့်အပိုင်း (PUT) ---
            try {
                const response = await fetch(`https://e-shop-npm.vercel.app/api/products/${currentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
                if (response.ok) {
                    alert("Product Updated! ✅");
                    resetForm();
                    fetchProducts(); // Shop မှာ ချက်ချင်းပြောင်းသွားအောင်
                }
            } catch (err) { console.log(err); }

        } else {
            // --- (၂) ဒီနေရာမှာ နင့်ရဲ့ မူရင်း Upload code ကို ထည့်ရမှာပါ (POST) ---
            try {
                const response = await fetch('https://e-shop-npm.vercel.app/api/products', {
                    method: 'POST', // အသစ်ထည့်တာဖြစ်လို့ POST သုံးထားတာကို ရှာပါ
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
                if (response.ok) {
                    alert("Product Added! 🚀");
                    resetForm();
                    fetchProducts();
                }
            } catch (err) { console.log(err); }
        }
    };

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            axios.delete(`https://e-shop-npm.vercel.app/api/products/${id}`)
                .then(() => {
                    alert("Deleted!");
                    fetchProducts();
                })
                .catch(err => console.error("Error deleting product:", err));
        }
    };

    // Mark as Read လုပ်ဖို့
    const markAsRead = async (id) => {
        try {
            const response = await fetch(`https://e-shop-npm.vercel.app/api/contacts/${id}/read`, { method: 'PUT' });
            if (response.ok) fetchMessages(); // data ပြန်ခေါ်ဖို့
        } catch (err) { console.log(err); }
    };

    // Message ဖျက်ဖို့
    const deleteMessage = async (id) => {
        if (window.confirm("Are you sure you want to delete this?")) {
            try {
                const response = await fetch(`https://e-shop-npm.vercel.app/api/contacts/${id}`, { method: 'DELETE' });
                if (response.ok) fetchMessages();
            } catch (err) { console.log(err); }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

     // ပစ္စည်းနာမည်နဲ့ တိုက်စစ်ပြီး Filter လုပ်တာ
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    

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
                                <input type="text" className="form-control mb-2" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                <input type="number" className="form-control mb-2" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                <textarea className="form-control mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                {/* Product Name, Price, Description တွေရဲ့ အောက်နားမှာ ဒါလေး ထည့်ပါ */}

                                <select 
                                   
                                    className='form-select mb-2'
                                    onChange={(e) => setCategory(e.target.value)}
                                   value={category}
                                >
                                    <option value="">-- Select Category --</option>
                                    <option value="Laptops">Laptops</option>
                                    <option value="Smartphones">Smartphones</option>
                                    <option value="Accessories">Accessories</option>
                                </select>



                                <input type="text" className="form-control mb-2" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? "Update Product" : "Upload Product"}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-secondary text-white font-weight-bold">Manage Products</div>
                        <ul className="list-group list-group-flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Search products by name..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {filteredProducts.map(p => (
                                <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span className="text-truncate" style={{ maxWidth: '150px' }}>{p.name} - ${p.price}</span>
                                    <button onClick={() => deleteProduct(p.id)} className="btn btn-sm btn-danger me-2">Delete</button>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(p)}
                                    >
                                        Edit
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>



                </div>

                {/* --- Right Column: Orders & Messages --- */}
                <div className="col-md-7">
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length > 0 ? orders.map((order) => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.customer_name}</td>
                                                <td>{order.phone_number}</td>
                                                <td className="text-success fw-bold">${order.total_price}</td>
                                                <td>
                                                    <button
                                                        className={order.status === 'Pending' ? "btn btn-warning" : "btn btn-success"}
                                                        onClick={() => updateOrderStatus(order.id, order.status)}
                                                    >
                                                        {order.status}
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="py-4 text-muted">No orders available yet.</td>
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
                                                            >
                                                                Mark Read
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
                                        ))}
                                    </tbody>
                                </table>


                            </div>
                        </div>
                    </div>


                    <div className="card mt-4 shadow-sm border-0">
    <div className="card-header bg-danger text-white fw-bold">Manage Customer Reviews 💬</div>
    <div className="card-body">
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Comment</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {allReviews.map((rev) => (
                    <tr key={rev.id}>
                        <td>{rev.user_name}</td>
                        <td className="small text-muted">{rev.comment}</td>
                        <td>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteReview(rev.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>



                </div>
            </div>
        </div>

    );
}

export default Admin;