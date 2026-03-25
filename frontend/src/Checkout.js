


// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { CartContext } from './CartContext';

// function Checkout() {
//     const [fullName, setFullName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [address, setAddress] = useState('');
//     const [isSuccess,setIsSuccess] = useState(false);

//     if (response.status === 200 || response.status === 201) {
//     setIsSuccess(true); // Success message ပြဖို့ state ကို true လုပ်မယ်
//     clearCart();
    
//     // ၃ စက္ကန့်နေရင် Home ကို ပြန်သွားမယ်
//     setTimeout(() => {
//         navigate('/');
//     }, 3000);
// }
    
//     // Promo Code အတွက် state အသစ်များ
//     const [promoCode, setPromoCode] = useState('');
//     const [discountRate, setDiscountRate] = useState(0); // 0 ဆိုရင် discount မရှိသေးဘူး

//     const { cartItems, clearCart } = useContext(CartContext);
//     const navigate = useNavigate();

//     const items = cartItems || [];
    
//     // ၁။ မူရင်း စုစုပေါင်းစျေးနှုန်း (Subtotal)
//     const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
    
//     // ၂။ Discount ပမာဏကို တွက်ချက်ခြင်း
//     const discountAmount = subtotal * discountRate;
    
//     // ၃။ Discount နှုတ်ပြီးသား အမှန်တကယ်ပေးရမည့်စျေး (Final Total)
//     const finalTotal = subtotal - discountAmount;

//     // Promo Code စစ်ဆေးသည့် Function
//     const handleApplyPromo = () => {
//         if (promoCode === 'CYBER2026') {
//             setDiscountRate(0.40); // 40% OFF
//             alert("Promo Code Applied! You got 40% Discount.");
//         } else {
//             setDiscountRate(0);
//             alert("Invalid Promo Code!");
//         }
//     };

//     const handleOrder = async (e) => {
//         e.preventDefault();

//         if (items.length === 0) {
//             alert("Your cart is empty!");
//             return;
//         }

//         try {
//             // Backend ကို data ပို့တဲ့အခါ finalTotal (discount နှုတ်ပြီးသား) ကို ပို့ပေးရပါမယ်
//             const response = await axios.post('http://localhost:5000/api/orders', {
//                 name: fullName,
//                 phone: phoneNumber,
//                 address: address,
//                 total: finalTotal // ဒီမှာ finalTotal ကို သုံးထားပါတယ်
//             });

//             if (response.status === 200 || response.status === 201) {
//                 alert('Order Placed Successfully!');
//                 clearCart();
//                 navigate('/');
//             }
//         } catch (err) {
//             console.error("Error placing order:", err);
//             alert('Something went wrong. Please check your backend connection.');
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h2 className="mb-4">Shipping Information 🚚</h2>
            
//             <div className="row">
//                 <div className="col-md-7">
//                     <form className="card p-4 shadow-sm" onSubmit={handleOrder}>
//                         <div className="mb-3">
//                             <label className="form-label font-weight-bold">Full Name</label>
//                             <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
//                         </div>
//                         <div className="mb-3">
//                             <label className="form-label font-weight-bold">Phone Number</label>
//                             <input type="tel" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
//                         </div>
//                         <div className="mb-3">
//                             <label className="form-label font-weight-bold">Shipping Address</label>
//                             <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
//                         </div>
//                         <button type="submit" className="btn btn-primary w-100 py-2">Place Order</button>
//                     </form>
//                 </div>

//                 <div className="col-md-5">
//                     <div className="card p-4 shadow-sm">
//                         <h4 className="mb-3">Order Summary</h4>
                        
//                         {/* Promo Code Input Section */}
//                         <div className="input-group mb-3">
//                             <input 
//                                 type="text" 
//                                 className="form-control" 
//                                 placeholder="Promo Code (CYBER2026)" 
//                                 value={promoCode}
//                                 onChange={(e) => setPromoCode(e.target.value)}
//                             />
//                             <button className="btn btn-outline-secondary" type="button" onClick={handleApplyPromo}>Apply</button>
//                         </div>

//                         <div className="d-flex justify-content-between mb-2">
//                             <span>Subtotal:</span>
//                             <span>${subtotal.toFixed(2)}</span>
//                         </div>
                        
//                         {discountRate > 0 && (
//                             <div className="d-flex justify-content-between mb-2 text-danger">
//                                 <span>Discount (40%):</span>
//                                 <span>-${discountAmount.toFixed(2)}</span>
//                             </div>
//                         )}
                        
//                         <hr />
//                         <div className="d-flex justify-content-between mb-4">
//                             <strong className="fs-5">Total Amount:</strong>
//                             <strong className="fs-5 text-primary">${finalTotal.toFixed(2)}</strong>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Checkout;


// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { CartContext } from './CartContext';

// function Checkout() {
//     const { cartItems, clearCart } = useContext(CartContext);
//     const navigate = useNavigate();

//     // Form states
//     const [fullName, setFullName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [address, setAddress] = useState('');
//     const [isSuccess, setIsSuccess] = useState(false);

//     // Promo Code states
//     const [promoCode, setPromoCode] = useState('');
//     const [discountRate, setDiscountRate] = useState(0);

//     const items = cartItems || [];
    
//     // စျေးနှုန်းတွက်ချက်မှုများ
//     const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
//     const discountAmount = subtotal * discountRate;
//     const finalTotal = subtotal - discountAmount;

//     // Promo Code စစ်ဆေးသည့် Function
//     const handleApplyPromo = () => {
//         if (promoCode === 'CYBER2026') {
//             setDiscountRate(0.40); // 40% OFF
//             alert("Promo Code Applied! You got 40% Discount.");
//         } else {
//             setDiscountRate(0);
//             alert("Invalid Promo Code!");
//         }
//     };

//     const handleOrder = async (e) => {
//         e.preventDefault();

//         if (items.length === 0) {
//             alert("Your cart is empty!");
//             return;
//         }

//         try {
//             const response = await axios.post('http://localhost:5000/api/orders', {
//                 name: fullName,
//                 phone: phoneNumber,
//                 address: address,
//                 total: finalTotal 
//             });

//             // ဒီနေရာမှာ response ကို စစ်ရမှာပါ
//             if (response.status === 200 || response.status === 201) {
//                 setIsSuccess(true); // Success Alert ပြမယ်
//                 clearCart(); // Cart ရှင်းမယ်
                
//                 // ၃ စက္ကန့်နေရင် Home ကို ပြန်သွားမယ်
//                 setTimeout(() => {
//                     navigate('/');
//                 }, 3000);
//             }
//         } catch (err) {
//             console.error("Error placing order:", err);
//             alert('Something went wrong. Please check your backend connection.');
//         }
//     };

//     return (
//         <div className="container mt-5 mb-5">
//             {/* Success Message အောင်မြင်မှ ပေါ်လာမည် */}
//             {isSuccess && (
//                 <div className="alert alert-success shadow-lg border-0 text-center mb-4 py-3" role="alert">
//                     <h4 className="alert-heading">🎉 Order Placed Successfully!</h4>
//                     <p className="mb-0">Thank you for your purchase. Redirecting to home page...</p>
//                 </div>
//             )}

//             <h2 className="mb-4">Shipping Information 🚚</h2>
            
//             <div className="row">
//                 <div className="col-md-7">
//                     <form className="card p-4 shadow-sm border-0" onSubmit={handleOrder}>
//                         <div className="mb-3">
//                             <label className="form-label fw-bold">Full Name</label>
//                             <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
//                         </div>
//                         <div className="mb-3">
//                             <label className="form-label fw-bold">Phone Number</label>
//                             <input type="tel" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
//                         </div>
//                         <div className="mb-3">
//                             <label className="form-label fw-bold">Shipping Address</label>
//                             <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
//                         </div>
//                         <button type="submit" className="btn btn-success w-100 py-2 fw-bold shadow-sm">
//                             Confirm & Place Order
//                         </button>
//                     </form>
//                 </div>

//                 <div className="col-md-5">
//                     <div className="card p-4 shadow-sm border-0 bg-light">
//                         <h4 className="mb-3 fw-bold">Order Summary</h4>
                        
//                         <div className="input-group mb-3">
//                             <input 
//                                 type="text" className="form-control" placeholder="Promo Code (CYBER2026)" 
//                                 value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
//                             />
//                             <button className="btn btn-dark" type="button" onClick={handleApplyPromo}>Apply</button>
//                         </div>

//                         <div className="d-flex justify-content-between mb-2">
//                             <span>Subtotal:</span>
//                             <span>{subtotal.toLocaleString()} Ks</span>
//                         </div>
                        
//                         {discountRate > 0 && (
//                             <div className="d-flex justify-content-between mb-2 text-danger">
//                                 <span>Discount (40%):</span>
//                                 <span>-{discountAmount.toLocaleString()} Ks</span>
//                             </div>
//                         )}
                        
//                         <hr />
//                         <div className="d-flex justify-content-between mb-2">
//                             <strong className="fs-5">Total Amount:</strong>
//                             <strong className="fs-5 text-primary">{finalTotal.toLocaleString()} Ks</strong>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Checkout;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';

function Checkout() {
    const { cartItems, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Form states
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    // Promo Code states
    const [promoCode, setPromoCode] = useState('');
    const [discountRate, setDiscountRate] = useState(0);

    const items = cartItems || [];
    
    // စျေးနှုန်းတွက်ချက်မှုများ
    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
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

        try {
            const response = await axios.post('https://e-shop-npm.vercel.app/api/orders', {
                name: fullName,
                phone: phoneNumber,
                address: address,
                total: finalTotal 
            });

            if (response.status === 200 || response.status === 201) {
                clearCart(); // Cart ရှင်းမယ်
                
                // အောင်မြင်သွားရင် Thank You Page ကို တန်းသွားမယ်
                navigate('/thank-you'); 
            }
        } catch (err) {
            console.error("Error placing order:", err);
            alert('Something went wrong. Please check your backend connection.');
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
                            <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Phone Number</label>
                            <input type="tel" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Shipping Address</label>
                            <textarea className="form-control" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
                        </div>
                        <button type="submit" className="btn btn-success w-100 py-2 fw-bold shadow-sm">
                            Confirm & Place Order
                        </button>
                    </form>
                </div>

                <div className="col-md-5">
                    <div className="card p-4 shadow-sm border-0 bg-light">
                        <h4 className="mb-3 fw-bold">Order Summary</h4>
                        
                        <div className="input-group mb-3">
                            <input 
                                type="text" className="form-control" placeholder="Promo Code (CYBER2026)" 
                                value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <button className="btn btn-dark" type="button" onClick={handleApplyPromo}>Apply</button>
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