import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaHandHoldingHeart } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <FaHandHoldingHeart />
                    <span>VolunteerConnect</span>
                </Link>
                <div className="nav-links">
                    <Link to="/opportunities" className="nav-link">Opportunities</Link>
                    <Link to="/map" className="nav-link">Map View</Link>

                    {user ? (
                        <>
                            {user.role === 'organization' ? (
                                <Link to="/dashboard-org" className="nav-link">Dashboard</Link>
                            ) : (
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            )}
                            <Link to="/profile" className="nav-link">Profile</Link>
                            <button onClick={logout} className="btn btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
