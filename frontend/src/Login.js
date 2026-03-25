import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // ဒီမှာ password ကို 'admin123' လို့ သတ်မှတ်ထားမယ်
        if (password === 'admin123') {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/admin');
        } else {
            alert('Wrong Password Admin!');
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow-lg p-4" style={{ borderRadius: '20px' }}>
                        <h3 className="text-center fw-bold mb-4">Admin Login</h3>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Admin Password"
                                />
                            </div>
                            <button type="submit" className="btn btn-dark w-100 py-2" style={{ borderRadius: '10px' }}>
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;