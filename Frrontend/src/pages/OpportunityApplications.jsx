import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const OpportunityApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [opportunityTitle, setOpportunityTitle] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch opportunity details for title
                const oppRes = await api.get(`/opportunities/${id}`);
                setOpportunityTitle(oppRes.data.title);

                // Fetch applications
                const appRes = await api.get(`/applications/opportunity/${id}`);
                setApplications(appRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    return (
        <div className="container">
            <button onClick={() => navigate('/dashboard-org')} className="btn btn-outline" style={{ marginBottom: '1rem' }}>
                &larr; Back to Dashboard
            </button>

            <h2 className="heading">Applicants for: {opportunityTitle}</h2>

            {loading ? (
                <p>Loading applications...</p>
            ) : (
                applications.length === 0 ? (
                    <p>No applications received yet.</p>
                ) : (
                    <div className="card" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem' }}>Applicant Name</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Applied On</th>
                                    <th style={{ padding: '1rem' }}>Combined Notes</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>{app.volunteer?.name}</td>
                                        <td style={{ padding: '1rem' }}>{app.volunteer?.email}</td>
                                        <td style={{ padding: '1rem' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', maxWidth: '300px' }}>{app.notes || '-'}</td>
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
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'accepted')}
                                                    className="btn"
                                                    style={{ backgroundColor: 'var(--success-color)', color: 'white', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                    disabled={app.status === 'accepted'}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                    className="btn"
                                                    style={{ backgroundColor: 'var(--danger-color)', color: 'white', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                    disabled={app.status === 'rejected'}
                                                >
                                                    Reject
                                                </button>
                                            </div>
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

export default OpportunityApplications;
