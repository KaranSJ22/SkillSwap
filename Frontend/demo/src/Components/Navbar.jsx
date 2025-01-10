import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    // console.log(storedUser);
    
    if (storedUser!=null&&storedUser!=undefined) {
      const user = JSON.parse(storedUser); 
      // console.log("User data from localStorage:", user); 
      setIsLoggedIn(!!user); 
    } else {
      setIsLoggedIn(false); 
    }
  }, []);

  const handleLogout = () => {
    axios
      .get('http://localhost:5000/skillswap/logout', { withCredentials: true })
      .then(() => {
        localStorage.removeItem('user'); 
        setIsLoggedIn(false); 
        closeMenu(); 
        navigate('/'); 
      })
      .catch((error) => console.error('Logout failed:', error));
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-logo">SkillSwap</Link>

        {/* Hamburger Icon */}
        <div className="hamburger-icon" onClick={toggleMenu}>
          {isMenuOpen ? (
            <FontAwesomeIcon icon={faTimes} size="lg" />
          ) : (
            <FontAwesomeIcon icon={faBars} size="lg" />
          )}
        </div>

        <div className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>Home</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>About</Link>
          <Link to="/skills" className={location.pathname === '/skills' ? 'active' : ''} onClick={closeMenu}>Skills</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={closeMenu}>Contact</Link>

          {!isLoggedIn && (
            <>
              <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''} onClick={closeMenu}>Signup</Link>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''} onClick={closeMenu}>Login</Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''} onClick={closeMenu}>Profile</Link>
              <Link to="/" onClick={handleLogout}>Logout</Link>
            </>
          )}
        </div>
      </nav>

      {isMenuOpen && <div className="menu-overlay show" onClick={closeMenu}></div>}
    </>
  );
};

export default Navbar;
