import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';
import { FaPlus } from 'react-icons/fa';

const OrganizationDashboard = () => {
    const { user } = useContext(AuthContext);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd have an endpoint to get ONLY this org's opportunities
        // For now, we filter on the client side or assume the get opportunities endpoint handles it if we add a query param
        const fetchOpportunities = async () => {
            try {
                const { data } = await api.get('/opportunities');
                // Filter mainly for display since generic GET returns all
                const myOpps = data.filter(opp => opp.organization._id === user._id || opp.organization === user._id);
                setOpportunities(myOpps);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
            try {
                await api.delete(`/opportunities/${id}`);
                setOpportunities(opportunities.filter(opp => opp._id !== id));
            } catch (error) {
                console.error('Error deleting opportunity:', error);
                alert('Failed to delete opportunity');
            }
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="heading">{user?.organizationName || user?.name} Dashboard</h2>
                <Link to="/create-opportunity" className="btn btn-primary">
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Post Opportunity
                </Link>
            </div>

            {/* Organization Profile Summary */}
            <div className="card" style={{ marginBottom: '3rem', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{user?.organizationName || 'Organization Name'}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', maxWidth: '600px' }}>
                            {user?.organizationDescription || 'No description provided. Please update your profile.'}
                        </p>
                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div>
                                <strong>Location:</strong> {user?.location || 'Not set'}
                            </div>
                            <div>
                                <strong>Contact:</strong> {user?.email} {user?.phone && `| ${user.phone}`}
                            </div>
                        </div>
                    </div>
                    <Link to="/profile" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>Edit Profile</Link>
                </div>
            </div>

            <p className="subheading">Your Posted Opportunities</p>

            {loading ? (
                <p>Loading your posts...</p>
            ) : (
                opportunities.length === 0 ? (
                    <p>You haven't posted any opportunities yet.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {opportunities.map((opp) => (
                            <div key={opp._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{opp.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{opp.location} • {opp.date}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to={`/opportunities/${opp._id}`} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>View</Link>
                                    <Link to={`/opportunities/${opp._id}/applications`} className="btn btn-outline" style={{ fontSize: '0.875rem', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
                                        Applicants
                                    </Link>
                                    <button onClick={() => handleDelete(opp._id)} className="btn" style={{ backgroundColor: 'var(--danger-color)', color: 'white' }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default OrganizationDashboard;
