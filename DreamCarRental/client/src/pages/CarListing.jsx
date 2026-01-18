import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import api from '../services/api';
import CarCard from '../components/CarCard';

const CarListing = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        transmission: '',
        minPrice: 0,
        maxPrice: 500
    });
    const [searchQuery, setSearchQuery] = useState('');

    const carTypes = ['SUV', 'Sedan', 'Luxury', 'Economy', 'Sports'];
    const transmissions = ['Automatic', 'Manual'];

    useEffect(() => {
        fetchCars();
    }, [filters]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.type) queryParams.append('type', filters.type);
            if (filters.transmission) queryParams.append('transmission', filters.transmission);
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

            const res = await api.get(`/cars?${queryParams.toString()}`);
            setCars(res.data.cars);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="listing-page gradient-bg" style={{ padding: '120px 0 60px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>

                    {/* Sidebar Filters */}
                    <aside className="filter-sidebar">
                        <div className="glass" style={{ padding: '30px', position: 'sticky', top: '100px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                                <SlidersHorizontal size={20} color="#6366f1" />
                                <h2 style={{ fontSize: '1.25rem' }}>Filters</h2>
                            </div>

                            {/* Price Range */}
                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Price Range (per day)</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: '#94a3b8' }}>$0</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        step="10"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                        style={{ flex: 1, accentColor: '#6366f1' }}
                                    />
                                    <span style={{ fontWeight: '600' }}>${filters.maxPrice}</span>
                                </div>
                            </div>

                            {/* Car Type */}
                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Car Type</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {carTypes.map(type => (
                                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: filters.type === type ? 'white' : '#94a3b8' }}>
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={filters.type === type}
                                                onChange={() => setFilters({ ...filters, type: filters.type === type ? '' : type })}
                                                style={{ accentColor: '#6366f1' }}
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Transmission */}
                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Transmission</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {transmissions.map(t => (
                                        <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: filters.transmission === t ? 'white' : '#94a3b8' }}>
                                            <input
                                                type="radio"
                                                name="transmission"
                                                checked={filters.transmission === t}
                                                onChange={() => setFilters({ ...filters, transmission: filters.transmission === t ? '' : t })}
                                                style={{ accentColor: '#6366f1' }}
                                            />
                                            {t}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="btn btn-outline btn-block"
                                onClick={() => setFilters({ type: '', transmission: '', minPrice: 0, maxPrice: 500 })}
                                style={{ width: '100%' }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div className="search-bar glass" style={{ flex: 1, maxWidth: '500px', display: 'flex', padding: '8px 20px', alignItems: 'center', gap: '10px', borderRadius: '30px' }}>
                                <Search size={20} color="#94a3b8" />
                                <input
                                    type="text"
                                    placeholder="Search brand or model..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none' }}
                                />
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                Showing <strong>{filteredCars.length}</strong> cars
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="glass" style={{ height: '350px', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}></div>
                                ))}
                            </div>
                        ) : filteredCars.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                                {filteredCars.map(car => (
                                    <CarCard key={car.id} car={car} />
                                ))}
                            </div>
                        ) : (
                            <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                                <X size={48} color="#ef4444" style={{ marginBottom: '20px' }} />
                                <h3>No cars found</h3>
                                <p style={{ color: '#94a3b8' }}>Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        @media (max-width: 992px) {
          .listing-page .container > div { grid-template-columns: 1fr !important; }
          .filter-sidebar { display: none; }
        }
      `}</style>
        </div>
    );
};

export default CarListing;
