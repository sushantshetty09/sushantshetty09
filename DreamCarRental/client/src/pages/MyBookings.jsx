import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, DollarSign, Clock, Download, XCircle, Search, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/bookings/user/${user.id}`);
            setBookings(res.data.bookings);
        } catch (err) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await api.put(`/bookings/${id}/cancel`);
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.car_name.toLowerCase().includes(searchQuery.toLowerCase()) || booking.id.toString().includes(searchQuery);
        if (activeTab === 'all') return matchesSearch;
        return matchesSearch && booking.status === activeTab;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'completed': return '#6366f1';
            case 'cancelled': return '#ef4444';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="my-bookings-page gradient-bg" style={{ padding: '120px 0 60px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                <h1 style={{ marginBottom: '40px', fontSize: '2.5rem' }}>My <span className="gradient-text">Bookings</span></h1>

                {/* Tabs and Search */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <div className="glass" style={{ display: 'flex', padding: '5px', borderRadius: '10px' }}>
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    background: activeTab === tab ? '#6366f1' : 'transparent',
                                    color: activeTab === tab ? 'white' : '#94a3b8',
                                    textTransform: 'capitalize',
                                    fontWeight: '600'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', gap: '10px', borderRadius: '30px' }}>
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search by ID or Car..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
                        />
                    </div>
                </div>

                {/* Booking Cards */}
                <div style={{ display: 'grid', gap: '20px' }}>
                    {loading ? (
                        <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>Loading your bookings...</div>
                    ) : filteredBookings.length > 0 ? (
                        filteredBookings.map(booking => (
                            <div key={booking.id} className="glass" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: '30px', alignItems: 'center' }}>
                                <img src={booking.car_image} alt={booking.car_name} style={{ width: '150px', height: '100px', borderRadius: '12px', objectFit: 'cover' }} />

                                <div className="booking-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                        <h3 style={{ fontSize: '1.25rem' }}>{booking.car_name}</h3>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            background: `${getStatusColor(booking.status)}20`,
                                            color: getStatusColor(booking.status),
                                            fontWeight: '700',
                                            textTransform: 'uppercase'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#94a3b8', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Calendar size={16} color="#6366f1" /> {new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={16} color="#6366f1" /> {booking.pickup_location}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={16} color="#6366f1" /> Booking ID: #{booking.id}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <DollarSign size={16} color="#6366f1" /> Total: <strong>${booking.total_price}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                        <Download size={16} /> Invoice
                                    </button>
                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="btn"
                                            style={{ padding: '8px 16px', fontSize: '0.9rem', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                        >
                                            <XCircle size={16} /> Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="glass" style={{ padding: '80px', textAlign: 'center' }}>
                            <Info size={48} color="#94a3b8" style={{ marginBottom: '20px' }} />
                            <h3>No bookings found</h3>
                            <p style={{ color: '#94a3b8' }}>You haven't made any bookings in this category yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
