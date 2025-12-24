import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Custom Marker Icons configuration
const createIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

const icons = {
    Education: createIcon('blue'),
    Health: createIcon('red'),
    Environment: createIcon('green'),
    Community: createIcon('orange'),
    Other: createIcon('grey'),
    User: createIcon('violet')
};

// Component to handle map centering
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], 13);
        }
    }, [lat, lng, map]);
    return null;
};

const MapPage = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default: New York

    useEffect(() => {
        // Fetch Opportunities
        const fetchOpportunities = async () => {
            try {
                const { data } = await api.get('/opportunities');
                console.log('Fetched Opportunities:', data); // Debug log
                setOpportunities(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                setLoading(false);
            }
        };

        fetchOpportunities();

        // Get User Location
        console.log('Requesting user location...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('User location found:', position.coords);
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setMapCenter([latitude, longitude]);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Keep default center if permission denied or error
                }
            );
        } else {
            console.log('Geolocation not supported by this browser.');
        }
    }, []);

    const filteredOpportunities = categoryFilter
        ? opportunities.filter(opp => opp.category === categoryFilter)
        : opportunities;

    const getMarkerIcon = (category) => {
        // Handle case sensitivity or partial matches if needed, currently exact match
        return icons[category] || icons['Other'];
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>Loading map data...</div>;

    return (
        <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', backgroundColor: '#fff', borderBottom: '1px solid #ddd', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Volunteer Map</h2>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {!userLocation && <span style={{ fontSize: '0.8rem', color: '#888' }}>Enable location for best experience</span>}
                    <select
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Education">Education (Blue)</option>
                        <option value="Health">Health (Red)</option>
                        <option value="Environment">Environment (Green)</option>
                        <option value="Community">Community (Orange)</option>
                        <option value="Other">Other (Grey)</option>
                    </select>
                </div>
            </div>

            <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} />

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={userLocation} icon={icons.User}>
                        <Popup>
                            <strong>You are here</strong>
                        </Popup>
                        <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                            You are here
                        </Tooltip>
                    </Marker>
                )}

                {/* Opportunity Markers */}
                {filteredOpportunities.map((opp) => (
                    opp.coordinates && opp.coordinates.coordinates && (
                        <Marker
                            key={opp._id}
                            position={[opp.coordinates.coordinates[1], opp.coordinates.coordinates[0]]}
                            icon={getMarkerIcon(opp.category)}
                        >
                            <Popup>
                                <div style={{ minWidth: '200px' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>{opp.title}</h3>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '12px',
                                        backgroundColor: '#eee',
                                        fontSize: '0.8rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {opp.category}
                                    </span>
                                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{opp.organization?.organizationName || 'Organization'}</p>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{opp.location}</p>
                                    <Link
                                        to={`/opportunities/${opp._id}`}
                                        className="btn btn-primary"
                                        style={{ display: 'block', textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.3rem' }}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </Popup>
                            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                                <strong>{opp.title}</strong><br />
                                {opp.organization?.organizationName}
                            </Tooltip>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default MapPage;
