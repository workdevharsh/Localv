import { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext); // Assuming AuthContext exposes setUser to update local state logic
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        availability: '',
        skills: '',
        interests: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', content: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    location: data.location || '',
                    availability: data.availability || '',
                    skills: data.skills ? data.skills.join(', ') : '',
                    interests: data.interests ? data.interests.join(', ') : '',
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage({ type: 'error', content: 'Failed to load profile.' });
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
            const interestsArray = formData.interests.split(',').map(s => s.trim()).filter(Boolean);

            const { data } = await api.put('/auth/profile', {
                name: formData.name,
                location: formData.location,
                availability: formData.availability,
                skills: skillsArray,
                interests: interestsArray,
                // Add organizationName if needed based on role
            });

            // Update AuthContext user if needed (optional, depending on how AuthContext works)
            // setUser(data); 

            setMessage({ type: 'success', content: 'Profile updated successfully!' });

            // Re-format arrays to string for display
            setFormData(prev => ({
                ...prev,
                skills: data.skills ? data.skills.join(', ') : '',
                interests: data.interests ? data.interests.join(', ') : '',
            }));

        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', content: error.response?.data?.message || 'Failed to update profile.' });
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading profile...</div>;

    return (
        <div className="container" style={{ maxWidth: '800px', marginTop: '3rem', paddingBottom: '3rem' }}>
            <h1 className="heading" style={{ marginBottom: '2rem', textAlign: 'center' }}>My Profile</h1>

            {message.content && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: 'var(--radius)',
                    backgroundColor: message.type === 'error' ? '#fee2e2' : '#d1fae5',
                    color: message.type === 'error' ? '#b91c1c' : '#065f46',
                    border: `1px solid ${message.type === 'error' ? '#fca5a5' : '#6ee7b7'}`
                }}>
                    {message.content}
                </div>
            )}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    {user.role === 'organization' ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">Name of Organization</label>
                                <input
                                    type="text"
                                    name="organizationName"
                                    className="form-input"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    placeholder="e.g. Community Helpers"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Owner Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email (cannot be changed)</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    disabled
                                    style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="form-input"
                                    placeholder="e.g. New York, NY"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contact Info (Phone)</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-input"
                                    placeholder="+1 234 567 8900"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email (cannot be changed)</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    disabled
                                    style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-input"
                                        placeholder="e.g. New York, NY"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Availability</label>
                                    <input
                                        type="text"
                                        name="availability"
                                        className="form-input"
                                        placeholder="e.g. Weekends, Mon-Fri"
                                        value={formData.availability}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    className="form-input"
                                    placeholder="e.g. Teaching, Coding, First Aid"
                                    value={formData.skills}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Interests (comma separated)</label>
                                <input
                                    type="text"
                                    name="interests"
                                    className="form-input"
                                    placeholder="e.g. Environment, Education, Animals"
                                    value={formData.interests}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
