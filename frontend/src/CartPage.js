import React from 'react';
import { useCart } from './CartContext'; // Context ချိတ်ဆက်ရန်
import { useNavigate } from 'react-router-dom';

function CartPage() {
    const { cartItems, removeFromCart } = useCart(); // ခြင်းတောင်းထဲက data တွေယူမယ်
    const navigate = useNavigate();

    return (
        <div className="container mt-5" style={{ minHeight: '80vh' }}>
            <h2 className="mb-4">Shopping Cart 🛒</h2>
            
            {cartItems.length === 0 ? (
                <div className="alert alert-info">Your shopping cart is empty. Start adding some gadgets!🛒</div>
            ) : (
                <div className="row">
                    <div className="col-md-8">
                        {cartItems.map((item, index) => (
                            <div key={index} className="card mb-3 shadow-sm">
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img src={item.image} alt={item.name} style={{ width: '80px', marginRight: '15px' }} />
                                        <div>
                                            <h5 className="card-title mb-0">{item.name}</h5>
                                            <p className="text-muted mb-0">${item.price}</p>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* စုစုပေါင်း ကျသင့်ငွေ ပြမည့်အပိုင်း */}
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4>Order Summary</h4>
                                <hr />
                                <p className="d-flex justify-content-between">
                                    <span>Total Items:</span>
                                    <span>{cartItems.length}</span>
                                </p>
                                <h5 className="d-flex justify-content-between text-primary">
                                    <span>Total Price:</span>
                                    <span>${cartItems.reduce((acc, item) => acc +Number (item.price), 0)}</span>
                                </h5>
                                <button className="btn btn-success w-100 mt-3" onClick={()=> navigate('/checkout')}>Checkout Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage; // ဒါလေး မပါရင် error ပြန်တက်ပါလိမ့်မယ်