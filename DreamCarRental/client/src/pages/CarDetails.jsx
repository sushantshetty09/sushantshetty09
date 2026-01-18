import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, Gauge, Fuel, Calendar, MapPin, CheckCircle, Info, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const CarDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);

    const [bookingData, setBookingData] = useState({
        pickupDate: '',
        returnDate: '',
        location: 'Los Angeles International Airport (LAX)',
        insurance: false,
        gps: false,
        childSeat: false
    });

    const locations = [
        'Los Angeles International Airport (LAX)',
        'Beverly Hills Downtown',
        'Santa Monica Pier',
        'Hollywood Walk of Fame',
        'Long Beach Port'
    ];

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await api.get(`/cars/${id}`);
                setCar(res.data.car);
            } catch (err) {
                toast.error('Failed to load car details');
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const calculateTotalPrice = () => {
        if (!car || !bookingData.pickupDate || !bookingData.returnDate) return 0;

        const start = new Date(bookingData.pickupDate);
        const end = new Date(bookingData.returnDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        let total = diffDays * parseFloat(car.price_per_day);
        if (bookingData.insurance) total += diffDays * 10;
        if (bookingData.gps) total += diffDays * 5;
        if (bookingData.childSeat) total += diffDays * 3;

        return { total, diffDays };
    };

    const { total, diffDays } = calculateTotalPrice();

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to book a car');
            return;
        }

        try {
            const res = await api.post('/bookings', {
                carId: car.id,
                pickupDate: bookingData.pickupDate,
                returnDate: bookingData.returnDate,
                location: bookingData.location,
                totalPrice: total,
                additionalOptions: {
                    insurance: bookingData.insurance,
                    gps: bookingData.gps,
                    childSeat: bookingData.childSeat
                }
            });
            toast.success('Booking confirmed successfully!');
            navigate('/my-bookings');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) return <div className="loading-screen">Loading Car Details...</div>;
    if (!car) return <div className="loading-screen">Car not found.</div>;

    const features = typeof car.features === 'string' ? JSON.parse(car.features) : car.features;

    return (
        <div className="car-details-page gradient-bg" style={{ padding: '120px 0 60px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>

                    {/* Car Info Column */}
                    <div className="car-info-column">
                        <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', marginBottom: '30px' }}>
                            <img src={car.image_url} alt={car.name} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
                        </div>

                        <div className="glass" style={{ padding: '40px', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h1 style={{ fontSize: '2.5rem' }}>{car.brand} {car.name}</h1>
                                <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '8px 20px', borderRadius: '30px', fontWeight: '700' }}>
                                    {car.type}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                                    <Users size={20} color="#6366f1" /> <strong>{car.seats}</strong> Seats
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                                    <Gauge size={20} color="#6366f1" /> <strong>{car.transmission}</strong>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                                    <Fuel size={20} color="#6366f1" /> <strong>{car.fuel_type}</strong>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                                    <Star size={20} color="#f59e0b" fill="#f59e0b" /> <strong>4.9</strong> (120 reviews)
                                </div>
                            </div>

                            <h3 style={{ marginBottom: '20px' }}>Features & Amenities</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                {features && Object.entries(features).map(([key, value]) => (
                                    value && (
                                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f1f5f9' }}>
                                            <CheckCircle size={18} color="#10b981" />
                                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Column */}
                    <div className="booking-column">
                        <div className="glass" style={{ padding: '40px', position: 'sticky', top: '120px' }}>
                            <div style={{ marginBottom: '30px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: '700', color: '#6366f1' }}>${car.price_per_day}</span>
                                <span style={{ color: '#94a3b8' }}> / day</span>
                            </div>

                            <form onSubmit={handleBooking}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Pickup Location</label>
                                    <select
                                        className="glass"
                                        style={{ width: '100%', padding: '12px', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                                        value={bookingData.location}
                                        onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                                        required
                                    >
                                        {locations.map(loc => <option key={loc} value={loc} style={{ background: '#0f172a' }}>{loc}</option>)}
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Pickup Date</label>
                                        <input
                                            type="date"
                                            className="glass"
                                            style={{ width: '100%', padding: '12px', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                                            min={new Date().toISOString().split('T')[0]}
                                            value={bookingData.pickupDate}
                                            onChange={(e) => setBookingData({ ...bookingData, pickupDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Return Date</label>
                                        <input
                                            type="date"
                                            className="glass"
                                            style={{ width: '100%', padding: '12px', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                                            min={bookingData.pickupDate || new Date().toISOString().split('T')[0]}
                                            value={bookingData.returnDate}
                                            onChange={(e) => setBookingData({ ...bookingData, returnDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <h4 style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#94a3b8' }}>Extra Options</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <input type="checkbox" checked={bookingData.insurance} onChange={(e) => setBookingData({ ...bookingData, insurance: e.target.checked })} /> Full Insurance
                                            </span>
                                            <span style={{ color: '#6366f1' }}>+$10/day</span>
                                        </label>
                                        <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <input type="checkbox" checked={bookingData.gps} onChange={(e) => setBookingData({ ...bookingData, gps: e.target.checked })} /> GPS Navigation
                                            </span>
                                            <span style={{ color: '#6366f1' }}>+$5/day</span>
                                        </label>
                                        <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <input type="checkbox" checked={bookingData.childSeat} onChange={(e) => setBookingData({ ...bookingData, childSeat: e.target.checked })} /> Child Seat
                                            </span>
                                            <span style={{ color: '#6366f1' }}>+$3/day</span>
                                        </label>
                                    </div>
                                </div>

                                {total > 0 && (
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                                            <span>Base Price ({diffDays} days)</span>
                                            <span>${(diffDays * parseFloat(car.price_per_day)).toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                                            <span>Additional Options</span>
                                            <span>${(total - (diffDays * parseFloat(car.price_per_day))).toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', fontWeight: '700', fontSize: '1.2rem' }}>
                                            <span>Total Price</span>
                                            <span style={{ color: '#6366f1' }}>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%', padding: '15px' }}>
                                    Confirm Booking
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
