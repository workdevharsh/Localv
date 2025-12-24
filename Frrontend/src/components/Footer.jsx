import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHandHoldingHeart } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                {/* Column 1: Brand */}
                <div className="footer-section brand-section">
                    <Link to="/" className="footer-logo">
                        <FaHandHoldingHeart className="footer-logo-icon" />
                        <span>VolunteerConnect</span>
                    </Link>
                    <p className="footer-description">
                        Connecting passionate volunteers with local organizations to build stronger, happier communities together.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer-section">
                    <h3 className="footer-heading">Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/opportunities">Find Opportunities</Link></li>
                        <li><Link to="/map">Map View</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div className="footer-section">
                    <h3 className="footer-heading">Contact Us</h3>
                    <ul className="footer-contact">
                        <li>
                            <FaMapMarkerAlt /> 123 Community Lane, Cityville
                        </li>
                        <li>
                            <FaPhone /> (555) 123-4567
                        </li>
                        <li>
                            <FaEnvelope /> hello@volunteerconnect.com
                        </li>
                    </ul>
                </div>

                {/* Column 4: Newsletter & Social */}
                <div className="footer-section">
                    <h3 className="footer-heading">Stay Connected</h3>
                    <p className="footer-text">Join our newsletter for updates.</p>
                    <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Your email..." />
                        <button type="submit">Subscribe</button>
                    </form>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><FaFacebook /></a>
                        <a href="#" className="social-icon"><FaTwitter /></a>
                        <a href="#" className="social-icon"><FaInstagram /></a>
                        <a href="#" className="social-icon"><FaLinkedin /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} VolunteerConnect. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
