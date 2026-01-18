import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Clock, Zap, MapPin, Star, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';
import CarCard from '../components/CarCard';
import '../styles/landing.css';

const Landing = () => {
    const [featuredCars, setFeaturedCars] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await axios.get('/api/cars/featured');
                setFeaturedCars(res.data.cars);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFeatured();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="landing-page gradient-bg">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-content"
                    >
                        <h1 className="hero-title">Drive Your Dream With <span className="gradient-text">Premium Style</span></h1>
                        <p className="hero-subtitle">Experience the ultimate freedom on the road. Rent luxury, exotic, and comfortable cars with a click.</p>
                        <div className="hero-btns">
                            <Link to="/cars" className="btn btn-primary btn-lg">Browse Cars <ArrowRight size={20} /></Link>
                            <Link to="/auth" className="btn btn-outline btn-lg">Get Started</Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="hero-image"
                    >
                        <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop" alt="Hero Car" className="parallax-img" />
                        <div className="glow-effect"></div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item glass">
                            <h3>500+</h3>
                            <p>Premium Cars</p>
                        </div>
                        <div className="stat-item glass">
                            <h3>10k+</h3>
                            <p>Happy Customers</p>
                        </div>
                        <div className="stat-item glass">
                            <h3>50+</h3>
                            <p>Locations</p>
                        </div>
                        <div className="stat-item glass">
                            <h3>4.9/5</h3>
                            <p>User Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Cars */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured <span className="gradient-text">Vehicles</span></h2>
                        <Link to="/cars" className="view-all">View All Cars <ArrowRight size={16} /></Link>
                    </div>
                    <div className="car-grid">
                        {featuredCars.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose-us">
                <div className="container">
                    <h2 className="section-title text-center">Why Choose <span className="gradient-text">DreamCar</span></h2>
                    <div className="benefits-grid">
                        {[
                            { icon: <Shield size={32} />, title: 'Full Insurance', desc: 'Secure your journey with our comprehensive insurance plans.' },
                            { icon: <Zap size={32} />, title: 'Fast Booking', desc: 'Book your favorite car in less than 60 seconds with our easy platform.' },
                            { icon: <MapPin size={32} />, title: 'Anywhere Pickup', desc: 'We deliver your dream car right to your doorstep or hotel.' },
                            { icon: <Clock size={32} />, title: '24/7 Support', desc: 'Our dedicated team is always ready to assist you anytime, anywhere.' }
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="benefit-card glass"
                            >
                                <div className="benefit-icon">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials">
                <div className="container">
                    <h2 className="section-title text-center">What Our <span className="gradient-text">Clients Say</span></h2>
                    <div className="testimonials-grid">
                        {[
                            { name: 'James Wilson', role: 'Business Traveler', text: 'Best car rental experience ever! The Tesla Model S was in pristine condition and the service was exceptional.' },
                            { name: 'Sarah Miller', role: 'Influencer', text: 'The booking process was so smooth. I rented a Porsche 911 for my photoshoot and it was absolutely stunning.' },
                            { name: 'Robert Chen', role: 'Tourist', text: 'Reliable and affordable. Great customer support when I needed to extend my booking. Highly recommended!' }
                        ].map((t, i) => (
                            <div key={i} className="testimonial-card glass">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="#f59e0b" color="#f59e0b" />)}
                                </div>
                                <p>"{t.text}"</p>
                                <div className="user-info">
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-box glass">
                        <h2>Ready to start your premium journey?</h2>
                        <p>Join thousands of happy travelers and drive your dream car today.</p>
                        <Link to="/auth" className="btn btn-primary btn-lg">Register Now</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
