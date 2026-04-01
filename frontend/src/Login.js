import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(true); // true = Login form, false = Register form
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const ADMIN_EMAIL = 'admin@cybergadgets.com';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // ========== LOGIN (အကောင့်ရှိပြီးသား ဝင်ဖို့) ==========
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                
                if (error) throw error;
                
                if (email === ADMIN_EMAIL) {
                    localStorage.setItem('isAuthenticated', 'true');
                    alert('Login successful!');
                    navigate('/admin');
                } else {
                    await supabase.auth.signOut();
                    setError('Access denied. Admin only.');
                }
            } else {
                // ========== REGISTER (အကောင့်သစ်ဖွင့်ဖို့) ==========
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { username, full_name: username }
                    }
                });
                
                if (error) throw error;
                
                alert('Registration successful! Please login.');
                setIsLogin(true); // Register ပြီးရင် Login form ပြန်ပြ
                setEmail('');
                setPassword('');
                setUsername('');
            }
        } catch (err) {
            if (err.message.includes('already registered')) {
                setError('Email already exists. Please login instead.');
                setIsLogin(true); // Login form ကိုပြောင်းပြီး error ပြ
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow-lg p-4" style={{ borderRadius: '20px' }}>
                        <h3 className="text-center fw-bold mb-4">
                            {isLogin ? 'Login' : 'Create Account'}
                        </h3>
                        
                        {error && (
                            <div className="alert alert-danger py-2">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter name"
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
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
                                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                            </button>
                        </form>
                        
                        <div className="text-center mt-3">
                            <button
                                className="btn btn-link p-0"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                }}
                            >
                                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;