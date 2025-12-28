import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role');
    const isAuthenticated = !!localStorage.getItem('token');

    // NEW: State to control the dropdown manually
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Hide Navbar on Login page
    if (!isAuthenticated || location.pathname === '/login') {
        return null;
    }

    // Professional Styles
    const navStyle = {
        background: 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        padding: '0.8rem 0'
    };

    const linkStyle = {
        fontWeight: '500',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
        borderRadius: '5px',
        marginRight: '5px'
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark mb-5" style={navStyle}>
            <div className="container">
                {/* Brand Logo */}
                <Link className="navbar-brand d-flex align-items-center fw-bold me-4" to="/" style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>
                    <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-bank2"></i>
                    </div>
                    eBank <span className="fw-light ms-1 opacity-75 fs-6">Pro</span>
                </Link>

                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto align-items-center">
                        {/* --- PROFILE: AGENT GUICHET (Admin) --- */}
                        {role === 'AGENT_GUICHET' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/admin" style={linkStyle}>
                                        <i className="bi bi-person-plus me-1"></i> Nouveau Client
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/clients" style={linkStyle}>
                                        <i className="bi bi-people me-1"></i> Liste Clients
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/new-account" style={linkStyle}>
                                        <i className="bi bi-wallet2 me-1"></i> Nouveau Compte
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* --- PROFILE: CLIENT --- */}
                        {role === 'CLIENT' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/dashboard" style={linkStyle}>
                                        <i className="bi bi-speedometer2 me-1"></i> Tableau de Bord
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/transfer" style={linkStyle}>
                                        <i className="bi bi-arrow-left-right me-1"></i> Virement
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Right Side: Profile & Settings Dropdown */}
                    <div className="d-flex align-items-center mt-3 mt-lg-0">
                        <div className="d-none d-lg-block text-end me-3">
                            <span className="d-block text-white fw-bold small">{role === 'AGENT_GUICHET' ? 'Agent' : 'Client'}</span>
                            <span className="d-block text-white-50 small" style={{ fontSize: '0.75rem' }}>Connecté</span>
                        </div>

                        {/* REACT CONTROLLED DROPDOWN */}
                        <div className="dropdown position-relative">
                            <button
                                className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                type="button"
                                // Toggle state on click
                                onClick={() => setShowDropdown(!showDropdown)}
                                style={{ width: '40px', height: '40px' }}
                            >
                                <i className="bi bi-gear-fill text-primary"></i>
                            </button>

                            {/* Conditionally add the 'show' class based on state */}
                            <ul
                                className={`dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2 p-2 ${showDropdown ? 'show' : ''}`}
                                style={{ position: 'absolute', right: 0 }}
                                // Close menu when mouse leaves (optional UX improvement)
                                onMouseLeave={() => setShowDropdown(false)}
                            >
                                <li>
                                    <Link
                                        className="dropdown-item py-2 small fw-bold rounded-2"
                                        to="/change-password"
                                        onClick={() => setShowDropdown(false)} // Close on click
                                    >
                                        <i className="bi bi-key me-2 text-warning"></i> Changer mot de passe
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider my-2"/></li>
                                <li>
                                    <button
                                        className="dropdown-item py-2 small fw-bold text-danger rounded-2"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i> Se déconnecter
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;