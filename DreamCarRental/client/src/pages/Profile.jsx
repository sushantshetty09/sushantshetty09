import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Lock, Save, Trash2, ShieldCheck, CreditCard, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Profile = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/users/${user.id}`, profileData);
            setUser({ ...user, ...profileData });
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('New passwords do not match');
        }

        setLoading(true);
        try {
            await api.put(`/users/${user.id}/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Password update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you ABSOLUTELY sure? This will delete all your bookings and account data permanently.')) {
            try {
                await api.delete(`/users/${user.id}`);
                toast.success('Account deleted');
                logout();
            } catch (err) {
                toast.error('Failed to delete account');
            }
        }
    };

    return (
        <div className="profile-page gradient-bg" style={{ padding: '120px 0 60px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>

                    {/* Profile Sidebar */}
                    <aside>
                        <div className="glass" style={{ padding: '30px', textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #ec4899)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '700' }}>
                                {user?.fullName?.charAt(0)}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{user?.fullName}</h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>VIP Member since 2024</p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: '700' }}>12</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Rentals</div>
                                </div>
                                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontWeight: '700' }}>4.9</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Rating</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '20px' }}>
                            <button className="btn btn-outline" style={{ width: '100%', marginBottom: '10px', justifyContent: 'flex-start' }}><ShieldCheck size={18} /> Security Settings</button>
                            <button className="btn btn-outline" style={{ width: '100%', marginBottom: '10px', justifyContent: 'flex-start' }}><CreditCard size={18} /> Payment Methods</button>
                            <button className="btn btn-outline" style={{ width: '100%', marginBottom: '10px', justifyContent: 'flex-start' }}><ShoppingBag size={18} /> Order History</button>
                            <button
                                onClick={handleDeleteAccount}
                                className="btn"
                                style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', justifyContent: 'flex-start' }}
                            >
                                <Trash2 size={18} /> Delete Account
                            </button>
                        </div>
                    </aside>

                    {/* Main Profile Form */}
                    <main>
                        <div className="glass" style={{ padding: '40px', marginBottom: '40px' }}>
                            <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <User size={24} color="#6366f1" /> Personal Information
                            </h3>

                            <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-field" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Full Name</label>
                                    <input
                                        type="text"
                                        className="glass"
                                        style={{ width: '100%', padding: '12px', border: 'none', color: 'white' }}
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Email Address</label>
                                    <input
                                        type="email"
                                        className="glass"
                                        style={{ width: '100%', padding: '12px', border: 'none', color: 'white' }}
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Phone Number</label>
                                    <input
                                        type="text"
                                        className="glass"
                                        style={{ width: '100%', padding: '12px', border: 'none', color: 'white' }}
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Address</label>
                                    <textarea
                                        className="glass"
                                        style={{ width: '100%', padding: '12px', border: 'none', color: 'white', minHeight: '100px', resize: 'none' }}
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="glass" style={{ padding: '40px' }}>
                            <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Lock size={24} color="#ec4899" /> Change Password
                            </h3>

                            <form onSubmit={handlePasswordUpdate} style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Current Password</label>
                                    <input
                                        type="password"
                                        className="glass"
                                        style={{ width: '100%', padding: '12px', border: 'none', color: 'white' }}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>New Password</label>
                                        <input
                                            type="password"
                                            className="glass"
                                            style={{ width: '100%', padding: '12px', border: 'none', color: 'white' }}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="glass"
                                            style={{ width: '100%', padding: '12px', border: 'none', color: 'white' }}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ background: 'linear-gradient(to right, #ec4899, #8b5cf6)' }}>
                                        <Lock size={18} /> Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
            <style>{`
        @media (max-width: 768px) {
          .profile-page .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
};

export default Profile;
