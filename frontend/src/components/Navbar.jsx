import React, { useState, useEffect, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token"); // ✅ Clear token
    setToken(null); // ✅ Update state
    navigate("/login"); // ✅ Redirect to login page
  };

  // Sync token from localStorage on mount
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);
  }, []);

  // Listen for token changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <img onClick={() => navigate("/")} className="logo" src={assets.logo} alt="Logo" />
      <ul className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <li>HOME</li>
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <li>DOCTORS</li>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <li>ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <li>CONTACT</li>
        </NavLink>
      </ul>

      <div className="auth-buttons">
        {token ? (
          <div className="profile-section" ref={dropdownRef}>
            <div className="profile-container" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <img
                className="profile-pic"
                src={assets.profile_pic}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/32"; // Fallback image
                }}
              />
              <img className="dropdown-icon" src={assets.dropdown_icon} alt="Dropdown" />
            </div>

            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => navigate("/my-profile")}>Profile</div>
                <div className="dropdown-item" onClick={() => navigate("/my-appointments")}>Appointments</div>
                <div className="dropdown-item" onClick={() => navigate("/settings")}>Settings</div>
                <div className="dropdown-item logout" onClick={logout}>Logout</div>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
