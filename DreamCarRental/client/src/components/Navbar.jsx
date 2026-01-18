import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Car, Calendar, LayoutDashboard, Menu, X } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <Link to="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
                    <span className="brand-icon"><Car size={32} /></span>
                    <span className="brand-name">Dream<span>Car</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className="nav-links desktop-only">
                    <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
                            <Link to="/cars" className={isActive('/cars') ? 'active' : ''}>Browse Cars</Link>
                            <Link to="/my-bookings" className={isActive('/my-bookings') ? 'active' : ''}>My Bookings</Link>
                            <div className="user-menu">
                                <button className="user-trigger">
                                    <User size={20} />
                                    <span>{user.fullName.split(' ')[0]}</span>
                                </button>
                                <div className="dropdown shadow">
                                    <Link to="/profile"><User size={16} /> Profile</Link>
                                    <button onClick={handleLogout} className="logout-btn">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="btn btn-outline">Login</Link>
                            <Link to="/auth" className="btn btn-primary" onClick={() => localStorage.setItem('authTab', 'register')}>Register</Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''} glass`}>
                    <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                            <Link to="/cars" className={isActive('/cars') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Browse Cars</Link>
                            <Link to="/my-bookings" className={isActive('/my-bookings') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
                            <Link to="/profile" className={isActive('/profile') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                            <Link to="/auth" className="btn btn-primary" onClick={() => {
                                localStorage.setItem('authTab', 'register');
                                setMobileMenuOpen(false);
                            }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
