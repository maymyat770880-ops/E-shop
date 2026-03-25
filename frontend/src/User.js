import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/register', { username, email, password });
            
            // --- ပြင်ဆင်လိုက်သည့်အပိုင်း ---
            // ၁။ အောင်မြင်ရင် user name ကို သိမ်းလိုက်မယ်
            localStorage.setItem('user', JSON.stringify({ name: username }));
            
            alert("Account Created Successfully!");
            
            // ၂။ Home ကိုသွားပြီး Navbar update ဖြစ်အောင် reload လုပ်မယ်
            navigate('/'); 
            window.location.reload(); 
            // --------------------------
        } catch (err) {
            alert("Registration Failed! Email might already exist.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <form className="card p-4 shadow border-0" onSubmit={handleSignup}>
                        <h3 className="text-center mb-4 fw-bold">Sign Up</h3>
                        
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" placeholder="Enter name" 
                                onChange={e => setUsername(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-control" placeholder="name@example.com" 
                                onChange={e => setEmail(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="input-group">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="form-control" 
                                    placeholder="Enter password" 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                                <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"} 
                                </button>
                            </div>
                        </div>

                        <button className="btn btn-success w-100 py-2 fw-bold shadow-sm">
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;