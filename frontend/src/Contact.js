import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function Contact() {
    // ၁။ User ရိုက်သမျှစာတွေကို သိမ်းဖို့ State တွေဆောက်မယ်
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // ၂။ Send ခလုတ်နှိပ်ရင် အလုပ်လုပ်မယ့် Function
    const handleSendMessage = async (e) => {
        e.preventDefault(); // Page refresh မဖြစ်အောင် တားတာ
        
        setLoading(true);
        
        try {
            const { error } = await supabase
                .from('contacts')
                .insert([
                    {
                        name: fullName,
                        email: email,
                        message: message,
                        is_read: false,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            alert("Message Sent Successfully! 📩");
            // စာပို့ပြီးရင် input တွေကို ပြန်ရှင်းထုတ်မယ်
            setFullName('');
            setEmail('');
            setMessage('');
            
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 shadow-sm p-4 rounded-4 bg-white border">
                    <h2 className="fw-bold mb-4 text-center">Contact Us</h2>
                    <p className="text-muted text-center mb-4">Have questions? We're here to help!</p>
                    
                    {/* ၃။ Form မှာ onSubmit ထည့်မယ် */}
                    <form onSubmit={handleSendMessage}>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Enter your name" 
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="name@example.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Message</label>
                            <textarea 
                                className="form-control" 
                                rows="4" 
                                placeholder="How can we help you?" 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                required
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100 py-2"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;