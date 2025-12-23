import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const OpportunityDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [notes, setNotes] = useState('');
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const { data } = await api.get(`/opportunities/${id}`);
                setOpportunity(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opportunity:', error);
                setLoading(false);
            }
        };

        fetchOpportunity();
    }, [id]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setApplying(true);
        setFeedback(null);

        try {
            await api.post('/applications', {
                opportunityId: id,
                notes,
            });
            setFeedback({ type: 'success', message: 'Application submitted successfully!' });
            setApplying(false);
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error.response?.data?.message || 'Failed to apply'
            });
            setApplying(false);
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading details...</div>;
    if (!opportunity) return <div className="container" style={{ marginTop: '2rem' }}>Opportunity not found.</div>;

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '800px' }}>
            <div className="card">
                <h1 className="heading" style={{ marginBottom: '0.5rem' }}>{opportunity.title}</h1>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBotom: '1.5rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaBuilding />
                        <span>{opportunity.organization?.organizationName || opportunity.organization?.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaMapMarkerAlt />
                        <span>{opportunity.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaCalendarAlt />
                        <span>{opportunity.date}</span>
                    </div>
                </div>

                <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color)' }} />

                <h3 className="subheading">Description</h3>
                <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>{opportunity.description}</p>

                {opportunity.skillsRequired && opportunity.skillsRequired.length > 0 && (
                    <>
                        <h3 className="subheading">Skills Required</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                            {opportunity.skillsRequired.map((skill, index) => (
                                <span key={index} style={{
                                    backgroundColor: 'var(--background-color)',
                                    border: '1px solid var(--border-color)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                {feedback && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1.5rem',
                        backgroundColor: feedback.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: feedback.type === 'success' ? '#166534' : '#991b1b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {feedback.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                        {feedback.message}
                    </div>
                )}

                {user?.role === 'volunteer' && (
                    !feedback || feedback.type !== 'success' ? (
                        <form onSubmit={handleApply} style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                            <h3 className="subheading" style={{ fontSize: '1.1rem' }}>Interested? Apply Now</h3>
                            <div className="form-group">
                                <label className="form-label">Notes for the Organization (Optional)</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Briefly explain why you're interested..."
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={applying}>
                                {applying ? 'Submitting...' : 'Apply for Opportunity'}
                            </button>
                        </form>
                    ) : null
                )}

                {!user && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <p>Please <button onClick={() => navigate('/login')} style={{ color: 'var(--primary-color)', textDecoration: 'underline', background: 'none', border: 'none', padding: 0 }}>login</button> as a volunteer to apply.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpportunityDetails;
