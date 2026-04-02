import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // data ကိုဖယ်လိုက်ပြီ (error ပဲထား)
            const { error } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password,
                options: {
                    data: { username, full_name: username, role: 'user' }
                }
            });
            
            if (error) throw error;
            
            setSuccess('Registration successful! Please login.');
            setTimeout(() => {
                navigate('/user-login');
            }, 2000);
        } catch (err) {
            console.error(err);
            if (err.message.includes('already registered')) {
                setError('Email already registered. Please login.');
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
                    <div className="card shadow-lg p-4">
                        <h3 className="text-center fw-bold mb-4">Create Account</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label>Username</label>
                                <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label>Email Address</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label>Password</label>
                                <div className="input-group">
                                    <input type={showPassword ? "text" : "password"} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <Link to="/user-login" className="btn btn-link p-0">Already have an account? Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;