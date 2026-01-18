import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer shadow" style={{ background: 'rgba(15, 23, 42, 1)', color: '#94a3b8', padding: '60px 0 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                    <div className="footer-brand">
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '20px' }}>
                            <span style={{ color: '#6366f1' }}><Car size={32} /></span>
                            <span>Dream<span style={{ color: '#6366f1' }}>Car</span></span>
                        </Link>
                        <p style={{ lineHeight: '1.6' }}>Experience luxury and comfort with our premium car rental services. Premium cars for premium journeys.</p>
                    </div>

                    <div className="footer-links">
                        <h4 style={{ color: 'white', marginBottom: '20px' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '10px' }}><Link to="/" style={{ color: 'inherit' }}>Home</Link></li>
                            <li style={{ marginBottom: '10px' }}><Link to="/cars" style={{ color: 'inherit' }}>Browse Cars</Link></li>
                            <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ color: 'inherit' }}>About Us</Link></li>
                            <li style={{ marginBottom: '10px' }}><Link to="/contact" style={{ color: 'inherit' }}>Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4 style={{ color: 'white', marginBottom: '20px' }}>Contact Us</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><MapPin size={18} color="#6366f1" /> 123 Luxury Dr, Beverly Hills, CA</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><Phone size={18} color="#6366f1" /> +1 (555) 123-4567</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><Mail size={18} color="#6366f1" /> info@dreamcar.com</li>
                        </ul>
                    </div>

                    <div className="footer-social">
                        <h4 style={{ color: 'white', marginBottom: '20px' }}>Follow Us</h4>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="#" style={{ background: 'rgba(255,255,255,0.05)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: '0.3s' }}><Facebook size={20} /></a>
                            <a href="#" style={{ background: 'rgba(255,255,255,0.05)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: '0.3s' }}><Twitter size={20} /></a>
                            <a href="#" style={{ background: 'rgba(255,255,255,0.05)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: '0.3s' }}><Instagram size={20} /></a>
                            <a href="#" style={{ background: 'rgba(255,255,255,0.05)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: '0.3s' }}><Linkedin size={20} /></a>
                        </div>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <p>© 2026 DreamCar Rental. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
