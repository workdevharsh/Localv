import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

const CreateOpportunity = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        category: 'Community', // Default
        date: '',
        skillsRequired: '',
        contactInfo: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert comma separated skills string to array
            const dataToSubmit = {
                ...formData,
                skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim()),
            };

            await api.post('/opportunities', dataToSubmit);
            toast.success('Opportunity posted successfully');
            navigate('/dashboard-org');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create opportunity');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '3rem auto' }}>
            <div className="card">
                <h2 className="heading">Post a New Opportunity</h2>
                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Community Garden Helper"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-input"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            name="location"
                            className="form-input"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, Area, or Remote"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            name="category"
                            className="form-input"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="Education">Education</option>
                            <option value="Health">Health</option>
                            <option value="Environment">Environment</option>
                            <option value="Community">Community Service</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date/Time</label>
                        <input
                            type="text"
                            name="date"
                            className="form-input"
                            value={formData.date}
                            onChange={handleChange}
                            placeholder="e.g. Saturdays at 9 AM"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Skills Required (comma separated)</label>
                        <input
                            type="text"
                            name="skillsRequired"
                            className="form-input"
                            value={formData.skillsRequired}
                            onChange={handleChange}
                            placeholder="e.g. Gardening, Painting, Teaching"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Info (Optional)</label>
                        <input
                            type="text"
                            name="contactInfo"
                            className="form-input"
                            value={formData.contactInfo}
                            onChange={handleChange}
                            placeholder="Email or Phone for applicants to contact"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-outline" style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            Post Opportunity
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOpportunity;
