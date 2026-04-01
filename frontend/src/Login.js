import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login
                const {  error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                
                if (error) throw error;
                
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', email);
                alert('Login successful!');
                navigate('/admin');
                
            } else {
                // Register
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0]
                        }
                    }
                });
                
                if (error) throw error;
                
                if (data.user) {
                    alert('Registration successful! You can now login.');
                    setIsLogin(true);
                    setEmail('');
                    setPassword('');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message);
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
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
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
                                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
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