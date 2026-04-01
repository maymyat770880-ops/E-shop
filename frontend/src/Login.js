import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Admin email ကို သတ်မှတ်ထားတယ်
    const ADMIN_EMAIL = 'admin@cybergadgets.com';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Supabase Auth နဲ့ Login
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Admin email နဲ့မှ ဝင်လို့ရမယ်
            if (email === ADMIN_EMAIL) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('adminEmail', email);
                alert('Admin Login successful!');
                navigate('/admin');
            } else {
                // Admin မဟုတ်ရင် logout လုပ်ပြီး ပြန်ထုတ်
                await supabase.auth.signOut();
                setError('Access denied. Admin only.');
            }
            
        } catch (err) {
            console.error('Auth error:', err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow-lg p-4" style={{ borderRadius: '20px' }}>
                        <h3 className="text-center fw-bold mb-4">Admin Login</h3>
                        
                        {error && (
                            <div className="alert alert-danger py-2">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label">Admin Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@cybergadgets.com"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-dark w-100 py-2" 
                                style={{ borderRadius: '10px' }}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;