const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--surface-color)',
            padding: '2rem 1rem',
            textAlign: 'center',
            marginTop: 'auto',
            borderTop: '1px solid var(--border-color)',
            color: 'var(--text-secondary)'
        }}>
            <p>&copy; {new Date().getFullYear()} VolunteerConnect. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
