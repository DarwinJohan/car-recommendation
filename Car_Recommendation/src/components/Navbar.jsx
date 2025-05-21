import React, { useState } from 'react';
import './Navbar.css';

import {
    FaSearch, FaGlobe, FaBell, FaRegCommentDots, FaExpandAlt, FaTh, FaAngleLeft, FaAngleRight
} from 'react-icons/fa';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <nav className="dashboard-navbar">
            <div className="navbar-left">
                <div className="navbar-header">
                <h1 className="navbar-logo">StoreIT</h1>
                </div>
                <div className="navbar-search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="navbar-search-input"
                    />
                </div>
            </div>

            <div className="navbar-right">
                <button className="icon-btn notification-btn">
                    <FaBell />
                    <span className="notification-badge">1</span> {/* Dynamic count */}
                </button>

                <div className="navbar-user-profile">
                    <img
                        src="" // Replace with actual user image URL
                        alt="User Avatar"
                        className="user-avatar"
                    />
                    <div className="user-info">
                        <span className="user-name">Dave Justin</span>
                        <span className="user-role">Warga RT7</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;