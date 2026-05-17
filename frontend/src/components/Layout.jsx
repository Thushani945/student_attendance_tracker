import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◉' },
  { to: '/students', label: 'Students', icon: '◎' },
  { to: '/attendance', label: 'Attendance', icon: '✓' }
];

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">AT</div>
          <div>
            <h1>AttendTrack</h1>
            <p>Student attendance</p>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          Web Services · Attendance Tracker
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}
