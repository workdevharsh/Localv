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
                setOpportunities(data); // Fetch all to populate rows
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
            <header style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #fff7ed 100%)', /* Soft green to light orange */
                padding: '6rem 1rem',
                textAlign: 'center',
                marginBottom: '4rem',
                borderRadius: '0 0 3rem 3rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        display: 'inline-block',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '50px',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        marginBottom: '1.5rem',
                        letterSpacing: '0.05em'
                    }}>
                        🤝 JOIN THE MOVEMENT
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        color: '#064e3b',
                        lineHeight: 1.2
                    }}>
                        Together, We Can <br />
                        <span style={{ color: 'var(--secondary-color)' }}>Make a Difference</span>
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        marginBottom: '2.5rem',
                        maxWidth: '650px',
                        margin: '0 auto 2.5rem',
                        color: '#4b5563',
                        lineHeight: 1.7
                    }}>
                        Connect with local organizations and lend a helping hand.
                        Whether it's an hour a week or a one-time event, your contribution matters.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/opportunities" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Find Volunteer Opportunities
                        </Link>
                        <Link to="/register" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Register as Organization
                        </Link>
                    </div>
                </div>
            </header>

            <section className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="heading">Featured Opportunities</h2>
                    <p className="subheading" style={{ fontWeight: '400' }}>Explore ways to give back in your community</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}><p>Loading opportunities...</p></div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2.5rem',
                        marginBottom: '4rem'
                    }}>
                        {opportunities.map((opp) => (
                            <OpportunityCard key={opp._id} opportunity={opp} />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
};

const Row = ({ title, items }) => {
    if (items.length === 0) return null;

    return (
        <div style={{ marginBottom: '3vw', padding: '0 4%' }}>
            <h2 className="subheading" style={{
                color: '#e5e5e5',
                fontSize: '1.4vw',
                marginBottom: '0.5rem',
                fontWeight: '600',
                paddingLeft: '0.5rem'
            }}>{title}</h2>

            <div className="row-container" style={{
                display: 'flex',
                overflowX: 'scroll',
                padding: '1rem 0.5rem',
                gap: '0.5rem',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none',  /* IE 10+ */
            }}>
                <style>{`
                    .row-container::-webkit-scrollbar { 
                        display: none; 
                    }
                `}</style>

                {items.map((opp) => (
                    <div key={opp._id} style={{
                        flex: '0 0 auto',
                        width: '250px',
                        height: '350px'
                    }}>
                        <OpportunityCard opportunity={opp} />
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Home;
