import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CarListing from './pages/CarListing';
import CarDetails from './pages/CarDetails';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/auth" element={<Auth />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/cars" element={<CarListing />} />
                            <Route path="/cars/:id" element={<CarDetails />} />
                            <Route path="/my-bookings" element={<MyBookings />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
