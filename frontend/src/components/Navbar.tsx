import { NavLink } from 'react-router-dom';
import './Navbar.css';

const linkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? 'cm-nav__link cm-nav__link--active' : 'cm-nav__link';

export function Navbar() {
    return (
        <nav className="cm-nav">
            <a href="/" className="cm-nav__brand">CarMonitoring</a>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/incidents" className={linkClass}>Incidents</NavLink>
            <NavLink to="/participants" className={linkClass}>Participants</NavLink>
        </nav>
    );
}
