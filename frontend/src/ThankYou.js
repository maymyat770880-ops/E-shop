import React from 'react';
import { useNavigate } from 'react-router-dom';

function ThankYou() {
    const navigate = useNavigate();
    const orderId = Math.floor(Math.random() * 90000) + 10000;

    return (
        <div className="container mt-5 mb-5 text-center py-5 shadow-sm rounded bg-white border">
            <div className="mb-4">
                <div className="display-1 text-success">
                    <i className="bi bi-check-circle-fill"></i> ✅
                </div>
            </div>
            
            <h2 className="fw-bold text-dark">Thank You for Your Order!</h2>
            <p className="text-muted mt-3">Your order has been placed successfully.</p>
            
            <div className="alert alert-light border d-inline-block px-4 mt-2">
                Order ID: <strong className="text-primary">#CG-{orderId}</strong>
            </div>

            <div className="mt-4">
                <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
                    We appreciate your business! You will receive an order confirmation email shortly with your order details and tracking information.
                </p>
            </div>

            <button 
                className="btn btn-primary mt-4 px-5 py-2 fw-bold shadow-sm" 
                style={{ borderRadius: '8px', backgroundColor: '#0062ff', border: 'none' }}
                onClick={() => navigate('/')}
            >
                Continue Shopping
            </button>
        </div>
    );
}

export default ThankYou;




