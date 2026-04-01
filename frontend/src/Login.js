import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register
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
                // ========== LOGIN ==========
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
                    await supabase.auth.signOut();
                    setError('Access denied. Admin only.');
                }
                
            } else {
                // ========== REGISTER ==========
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username,
                            full_name: username
                        }
                    }
                });
                
                if (error) throw error;
                
                alert('Registration successful! You can now login.');
                setIsLogin(true);
                setEmail('');
                setPassword('');
                setUsername('');
            }
            
        } catch (err) {
            console.error('Auth error:', err);
            if (err.message.includes('already registered')) {
                setError('Email already exists. Please login instead.');
            } else if (err.message.includes('Invalid login')) {
                setError('Invalid email or password');
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
                            {isLogin ? 'Admin Login' : 'Create Account'}
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
                                        placeholder="Enter username"
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