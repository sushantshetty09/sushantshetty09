import { Link } from 'react-router-dom';
import { Users, Fuel, Gauge, Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const CarCard = ({ car }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="car-card glass shadow"
            style={{ overflow: 'hidden', transition: '0.3s' }}
        >
            <div className="car-image-container" style={{ position: 'relative', height: '200px' }}>
                <img
                    src={car.image_url}
                    alt={car.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="car-badge" style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'rgba(99, 102, 241, 0.9)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                }}>
                    {car.type}
                </div>
            </div>

            <div className="car-info" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{car.brand} {car.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                        <Star size={14} fill="#f59e0b" />
                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>4.8</span>
                    </div>
                </div>

                <div className="car-specs" style={{ display: 'flex', gap: '15px', marginBottom: '20px', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Users size={16} /> {car.seats}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Gauge size={16} /> {car.transmission === 'Automatic' ? 'AT' : 'MT'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Fuel size={16} /> {car.fuel_type || 'Petrol'}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#6366f1' }}>${car.price_per_day}</span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}> / day</span>
                    </div>
                    <Link to={`/cars/${car.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        Book Now
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default CarCard;
