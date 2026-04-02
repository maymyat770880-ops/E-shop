// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from './supabaseClient';

// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [username, setUsername] = useState('');
//     const [isLogin, setIsLogin] = useState(true);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const ADMIN_EMAIL = 'admin@cybergadgets.com';

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             if (isLogin) {
//                 const { error } = await supabase.auth.signInWithPassword({
//                     email,
//                     password
//                 });
//                 if (error) throw error;
                
//                 if (email === ADMIN_EMAIL) {
//                     localStorage.setItem('isAuthenticated', 'true');
//                     alert('Login successful!');
//                     navigate('/admin');
//                 } else {
//                     await supabase.auth.signOut();
//                     setError('Access denied. Admin only.');
//                 }
//             } else {
//                 const { error } = await supabase.auth.signUp({
//                     email,
//                     password,
//                     options: { data: { username, full_name: username } }
//                 });
//                 if (error) throw error;
//                 alert('Registration successful! Please login.');
//                 setIsLogin(true);
//                 setEmail('');
//                 setPassword('');
//                 setUsername('');
//             }
//         } catch (err) {
//             if (err.message.includes('already registered')) {
//                 setError('Email already exists. Please login.');
//                 setIsLogin(true);
//             } else {
//                 setError(err.message);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mt-5 pt-5">
//             <div className="row justify-content-center">
//                 <div className="col-md-4">
//                     <div className="card shadow-lg p-4">
//                         <h3 className="text-center fw-bold mb-4">
//                             {isLogin ? 'Login' : 'Sign Up'}
//                         </h3>
//                         {error && <div className="alert alert-danger">{error}</div>}
//                         <form onSubmit={handleSubmit}>
//                             {!isLogin && (
//                                 <div className="mb-3">
//                                     <label>Username</label>
//                                     <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
//                                 </div>
//                             )}
//                             <div className="mb-3">
//                                 <label>Email Address</label>
//                                 <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                             </div>
//                             <div className="mb-3">
//                                 <label>Password</label>
//                                 <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                             </div>
//                             <button type="submit" className="btn btn-dark w-100 py-2" disabled={loading}>
//                                 {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
//                             </button>
//                         </form>
//                         <div className="text-center mt-3">
//                             <button className="btn btn-link p-0" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
//                                 {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(true);
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
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password: password
                });
                
                if (error) throw error;
                
                if (email === ADMIN_EMAIL) {
                    localStorage.setItem('isAuthenticated', 'true');
                    alert('Admin Login successful!');
                    navigate('/admin');
                } else {
                    alert('Login successful!');
                    navigate('/');
                }
            } else {
                // ========== REGISTER ==========
                const { data, error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password: password,
                    options: {
                        data: {
                            username: username,
                            full_name: username
                        }
                    }
                });
                
                if (error) throw error;
                
                if (data.user) {
                    alert('Registration successful! Please login.');
                    setIsLogin(true);
                    setEmail('');
                    setPassword('');
                    setUsername('');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            if (err.message.includes('already registered')) {
                setError('This email is already registered. Please login.');
                setIsLogin(true);
            } else if (err.message.includes('password')) {
                setError('Password must be at least 6 characters.');
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
                                    placeholder="your@email.com"
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
                                    placeholder="At least 6 characters"
                                    required
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="btn btn-dark w-100 py-2"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
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
                                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;