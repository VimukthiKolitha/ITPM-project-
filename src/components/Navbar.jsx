import React, { useState, useEffect, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to check if token is valid (not expired)
  const isTokenValid = (tokenToCheck) => {
    if (!tokenToCheck) return false;
    
    try {
      // Decode the token payload (second part)
      const payload = tokenToCheck.split('.')[1];
      if (!payload) return false;
      
      const decodedPayload = JSON.parse(atob(payload));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      return decodedPayload.exp > currentTime;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  // Function to handle Create Account button click
  const handleCreateAccount = () => {
    // Clear any existing token first
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  // Sync token from localStorage on mount and validate it
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    
    // Only set the token if it exists and is valid
    if (tokenFromStorage && isTokenValid(tokenFromStorage)) {
      setToken(tokenFromStorage);
    } else {
      // Clear invalid token
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [setToken]);

  // Listen for token changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      if (newToken && isTokenValid(newToken)) {
        setToken(newToken);
      } else {
        setToken(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setToken]);

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
  <NavLink to="Blogs-display" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
    <li>BLOGS</li>
  </NavLink>
</ul>

      <div className="auth-buttons">
        {token && userData ? (
          <div className="profile-section" ref={dropdownRef}>
            <div className="profile-container" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <img
                className="profile-pic"
                src={userData.image}
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
          <button className="login-btn" onClick={handleCreateAccount}>
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;