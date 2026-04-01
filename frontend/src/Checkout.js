import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import { supabase } from './supabaseClient';

function Checkout() {
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Form states
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    // Promo Code states
    const [promoCode, setPromoCode] = useState('');
    const [discountRate, setDiscountRate] = useState(0);

    const items = cartItems || [];
    
    // စျေးနှုန်းတွက်ချက်မှုများ
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);
    const discountAmount = subtotal * discountRate;
    const finalTotal = subtotal - discountAmount;

    // Promo Code စစ်ဆေးသည့် Function
    const handleApplyPromo = () => {
        if (promoCode === 'CYBER2026') {
            setDiscountRate(0.40); // 40% OFF
            alert("Promo Code Applied! You got 40% Discount.");
        } else {
            setDiscountRate(0);
            alert("Invalid Promo Code!");
        }
    };

    const handleOrder = async (e) => {
        e.preventDefault();

        if (items.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setLoading(true);

        try {
            // Order ကို Supabase မှာ သိမ်းမယ်
            const { data, error } = await supabase
                .from('orders')
                .insert([
                    {
                        customer_name: fullName,
                        phone_number: phoneNumber,
                        address: address,
                        total_price: finalTotal,
                        status: 'Pending',
                        created_at: new Date().toISOString()
                    }
                ])
                .select();

            if (error) throw error;

            console.log('Order saved:', data);
            clearCart(); // Cart ရှင်းမယ်
            navigate('/thank-you'); // Thank You Page ကိုသွားမယ်
            
        } catch (err) {
            console.error("Error placing order:", err);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Shipping Information 🚚</h2>
            
            <div className="row">
                <div className="col-md-7">
                    <form className="card p-4 shadow-sm border-0" onSubmit={handleOrder}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Full Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Phone Number</label>
                            <input 
                                type="tel" 
                                className="form-control" 
                                value={phoneNumber} 
                                onChange={(e) => setPhoneNumber(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Shipping Address</label>
                            <textarea 
                                className="form-control" 
                                rows="3" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                required
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-success w-100 py-2 fw-bold shadow-sm"
                            disabled={loading}
                        >
                            {loading ? 'Placing Order...' : 'Confirm & Place Order'}
                        </button>
                    </form>
                </div>

                <div className="col-md-5">
                    <div className="card p-4 shadow-sm border-0 bg-light">
                        <h4 className="mb-3 fw-bold">Order Summary</h4>
                        
                        {/* Cart Items List */}
                        {items.length > 0 && (
                            <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {items.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-2 border-bottom pb-1">
                                        <span>{item.name} x {item.quantity || 1}</span>
                                        <span>{(Number(item.price) * (item.quantity || 1)).toLocaleString()} Ks</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="input-group mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Promo Code (CYBER2026)" 
                                value={promoCode} 
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <button 
                                className="btn btn-dark" 
                                type="button" 
                                onClick={handleApplyPromo}
                            >
                                Apply
                            </button>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span>{subtotal.toLocaleString()} Ks</span>
                        </div>
                        
                        {discountRate > 0 && (
                            <div className="d-flex justify-content-between mb-2 text-danger">
                                <span>Discount (40%):</span>
                                <span>-{discountAmount.toLocaleString()} Ks</span>
                                </div>
                        )}
                        
                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                            <strong className="fs-5">Total Amount:</strong>
                            <strong className="fs-5 text-primary">{finalTotal.toLocaleString()} Ks</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;