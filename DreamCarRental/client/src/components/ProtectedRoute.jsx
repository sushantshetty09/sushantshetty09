import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="loading-screen">Loading...</div>;

    return user ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
