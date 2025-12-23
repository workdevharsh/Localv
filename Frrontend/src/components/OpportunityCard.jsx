import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

const OpportunityCard = ({ opportunity }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{opportunity.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <FaBuilding />
                    <span>{opportunity.organization?.organizationName || opportunity.organization?.name}</span>
                </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {opportunity.description}
            </p>

            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                    <FaMapMarkerAlt style={{ color: 'var(--primary-color)' }} />
                    <span>{opportunity.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <FaCalendarAlt style={{ color: 'var(--primary-color)' }} />
                    <span>{opportunity.date}</span>
                </div>
            </div>

            <Link to={`/opportunities/${opportunity._id}`} className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                View Details
            </Link>
        </div>
    );
};

export default OpportunityCard;
