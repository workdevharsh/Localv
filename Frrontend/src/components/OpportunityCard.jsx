import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

const OpportunityCard = ({ opportunity }) => {
    return (
        <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: 'var(--primary-color)', /* Green Background */
            color: 'white', /* White Text */
            border: 'none',
            boxShadow: 'var(--shadow)'
        }}>
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>{opportunity.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ecfdf5', fontSize: '0.9rem' }}>
                    <FaBuilding />
                    <span>{opportunity.organization?.organizationName || opportunity.organization?.name}</span>
                </div>
            </div>

            <p style={{ color: '#d1fae5', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                {opportunity.description}
            </p>

            <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#ecfdf5' }}>
                    <FaMapMarkerAlt style={{ color: 'white' }} />
                    <span>{opportunity.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#ecfdf5' }}>
                    <FaCalendarAlt style={{ color: 'white' }} />
                    <span>{opportunity.date}</span>
                </div>
            </div>

            <Link to={`/opportunities/${opportunity._id}`} className="btn" style={{
                width: '100%',
                borderRadius: '12px',
                backgroundColor: 'white',
                color: 'var(--primary-color)',
                fontWeight: '700'
            }}>
                Volunteer Now
            </Link>
        </div>
    );
};

export default OpportunityCard;
