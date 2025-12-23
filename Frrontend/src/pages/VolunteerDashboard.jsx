import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api';

const VolunteerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get('/applications/my');
                setApplications(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching applications:', error);
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    return (
        <div className="container">
            <h2 className="heading">Welcome, {user?.name}</h2>
            <p className="subheading">Your Applications</p>

            {loading ? (
                <p>Loading your applications...</p>
            ) : (
                applications.length === 0 ? (
                    <p>You haven't applied to any opportunities yet.</p>
                ) : (
                    <div className="card" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem' }}>Opportunity</th>
                                    <th style={{ padding: '1rem' }}>Organization</th>
                                    <th style={{ padding: '1rem' }}>Date Applied</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>{app.opportunity?.title}</td>
                                        <td style={{ padding: '1rem' }}>{app.opportunity?.organization?.organizationName || app.opportunity?.organization?.name}</td>
                                        <td style={{ padding: '1rem' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.875rem',
                                                backgroundColor:
                                                    app.status === 'accepted' ? 'var(--success-color)' :
                                                        app.status === 'rejected' ? 'var(--danger-color)' :
                                                            'var(--secondary-color)',
                                                color: 'white'
                                            }}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default VolunteerDashboard;
