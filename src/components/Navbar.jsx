import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AppNavbar() {
  const location = useLocation();
  const favCount = useSelector(state => state.favorites.items.length);

  const navItems = [
    { path: '/', icon: 'bi-map', label: 'Карта' },
    { path: '/route', icon: 'bi-arrow-left-right', label: 'Маршрут' },
    { path: '/favorites', icon: 'bi-star', label: 'Избранные' },
  ];

  return (
    <>
      <nav className="navbar-desktop">
        <div className="navbar-brand">
          <i className="bi bi-train-front-fill"></i>
          <span>ЭлектроПрибывалка</span>
        </div>
        <div className="navbar-links">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
              {item.path === '/favorites' && favCount > 0 && (
                <span className="badge-count">{favCount}</span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      <nav className="navbar-mobile">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
            {item.path === '/favorites' && favCount > 0 && (
              <span className="badge-count-mobile">{favCount}</span>
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
