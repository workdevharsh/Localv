import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard';
import api from '../api';

const Home = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const { data } = await api.get('/opportunities');
                setOpportunities(data.slice(0, 3)); // Show only 3 recent
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    return (
        <>
            <section style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
                color: 'white',
                padding: '8rem 1rem',
                textAlign: 'center',
                marginBottom: '4rem',
                borderRadius: '0 0 50% 50% / 40px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.2
                    }}>
                        Find Meaningful <br />
                        <span style={{ color: '#fbbf24' }}>Volunteer Opportunities</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        opacity: '0.9',
                        marginBottom: '2.5rem',
                        maxWidth: '600px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.6
                    }}>
                        Connect with local organizations and make a difference in your community today. Join thousands of volunteers making an impact.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/opportunities" className="btn" style={{
                            backgroundColor: 'white',
                            color: 'var(--primary-color)',
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}>
                            Browse all Opportunities
                        </Link>
                        <Link to="/register" className="btn" style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            backdropFilter: 'blur(10px)'
                        }}>
                            Join as Organization
                        </Link>
                    </div>
                </div>
            </section>

            <section className="container">
                <h2 className="heading" style={{ textAlign: 'center' }}>Recent Opportunities</h2>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading opportunities...</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        {opportunities.map((opp) => (
                            <OpportunityCard key={opp._id} opportunity={opp} />
                        ))}
                    </div>
                )}

                {!loading && opportunities.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No opportunities found.</p>
                )}
            </section>
        </>
    );
};

export default Home;
