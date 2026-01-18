import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Car, Calendar, DollarSign, ArrowRight, Search, Filter } from 'lucide-react';
import api from '../services/api';
import CarCard from '../components/CarCard';
import '../styles/dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [cars, setCars] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [carsRes, bookingsRes] = await Promise.all([
                    api.get('/cars?limit=6'),
                    api.get(`/bookings/user/${user.id}`)
                ]);
                setCars(carsRes.data.cars.slice(0, 6));
                setRecentBookings(bookingsRes.data.bookings.slice(0, 3));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    return (
        <div className="dashboard-page gradient-bg">
            <div className="container">
                {/* Welcome Banner */}
                <section className="welcome-banner glass">
                    <div className="welcome-content">
                        <h1>Welcome back, <span className="gradient-text">{user?.fullName}</span>!</h1>
                        <p>Ready for your next adventure? Browse our newest additions.</p>
                        <div className="search-bar glass">
                            <Search size={20} />
                            <input type="text" placeholder="Search for your favorite car brand or model..." />
                            <button className="btn btn-primary">Search</button>
                        </div>
                    </div>
                    <div className="welcome-image desktop-only">
                        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop" alt="Dashboard Car" />
                    </div>
                </section>

                {/* Quick Stats */}
                <div className="stats-container">
                    <div className="stat-card glass">
                        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                            <Calendar size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{recentBookings.filter(b => b.status !== 'cancelled').length}</h3>
                            <p>Active Bookings</p>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>${recentBookings.reduce((acc, b) => acc + parseFloat(b.total_price), 0).toFixed(0)}</h3>
                            <p>Total Spent</p>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            <Car size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>12</h3>
                            <p>Favorite Cars</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Recent Bookings */}
                    <div className="recent-bookings-section">
                        <div className="section-header">
                            <h2>Recent Bookings</h2>
                            <ArrowRight size={20} />
                        </div>
                        <div className="bookings-list">
                            {recentBookings.length > 0 ? recentBookings.map(booking => (
                                <div key={booking.id} className="booking-item glass">
                                    <img src={booking.car_image} alt={booking.car_name} />
                                    <div className="booking-details">
                                        <h4>{booking.car_name}</h4>
                                        <p>{new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}</p>
                                        <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                                    </div>
                                    <div className="booking-price">${booking.total_price}</div>
                                </div>
                            )) : (
                                <div className="empty-state glass">
                                    <p>No bookings found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Featured Cars */}
                    <div className="recommended-section">
                        <div className="section-header">
                            <h2>Recommended for You</h2>
                            <Filter size={20} />
                        </div>
                        <div className="car-grid">
                            {cars.map(car => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
