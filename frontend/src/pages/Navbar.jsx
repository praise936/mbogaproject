// Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <span className="logo-emoji" role="img" aria-label="vegetable">🥬</span>
                    <span className="logo-text">Agri Hub</span>
                </div>

                <button
                    className="hamburger-button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle navigation menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <a href="#home" className="nav-link">Home</a>
                    <a href="#how-it-works" className="nav-link">How It Works</a>
                    <a href="#for-farmers" className="nav-link">For Farmers</a>
                    <a href="#for-vendors" className="nav-link">For mama mboga</a>
                    <a href="#login" className="nav-link login-link">Login</a>
                    <a href="#signup" className="nav-link signup-button">Sign Up</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;