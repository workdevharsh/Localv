import { useState, useEffect } from 'react';
import OpportunityCard from '../components/OpportunityCard';
import api from '../api';

const OpportunitiesPage = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpps, setFilteredOpps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: '',
        search: '',
    });

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const { data } = await api.get('/opportunities');
                setOpportunities(data);
                setFilteredOpps(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let result = opportunities;

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                result = result.filter(opp =>
                    opp.title.toLowerCase().includes(searchLower) ||
                    opp.description.toLowerCase().includes(searchLower) ||
                    opp.skillsRequired.some(skill => skill.toLowerCase().includes(searchLower))
                );
            }

            if (filters.location) {
                const locLower = filters.location.toLowerCase();
                result = result.filter(opp => opp.location.toLowerCase().includes(locLower));
            }

            setFilteredOpps(result);
        };

        applyFilters();
    }, [filters, opportunities]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <h1 className="heading" style={{ marginBottom: '2rem' }}>Browse Volunteer Opportunities</h1>

            <div className="card" style={{
                marginBottom: '2rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                backgroundColor: 'var(--primary-color)', /* Contrasting Green Background */
                color: 'white',
                border: 'none',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label className="form-label" style={{ color: 'white' }}>Search Keywords</label>
                    <input
                        type="text"
                        name="search"
                        className="form-input"
                        placeholder="Title, description, skills..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        style={{ border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label className="form-label" style={{ color: 'white' }}>Location</label>
                    <input
                        type="text"
                        name="location"
                        className="form-input"
                        placeholder="Filter by city..."
                        value={filters.location}
                        onChange={handleFilterChange}
                        style={{ border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                    />
                </div>
            </div>

            {loading ? (
                <p>Loading opportunities...</p>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {filteredOpps.map((opp) => (
                            <OpportunityCard key={opp._id} opportunity={opp} />
                        ))}
                    </div>
                    {filteredOpps.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>No opportunities match your search.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default OpportunitiesPage;
