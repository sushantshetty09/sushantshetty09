import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import '../styles/auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const tab = localStorage.getItem('authTab');
        if (tab === 'register') {
            setIsLogin(false);
            localStorage.removeItem('authTab');
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const res = await api.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });
                login(res.data.user, res.data.token);
                toast.success('Welcome back!');
                navigate('/dashboard');
            } else {
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Passwords do not match');
                    setLoading(false);
                    return;
                }
                await api.post('/auth/register', {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                });
                toast.success('Registration successful! Please login.');
                setIsLogin(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page gradient-bg">
            <div className="auth-container glass">
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="auth-subtitle">
                        {isLogin ? 'Enter your details to access your account' : 'Join us and start your luxury journey'}
                    </p>

                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <User className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <Phone className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {isLogin && (
                        <div className="auth-options">
                            <label className="remember-me">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Login' : 'Register')}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
