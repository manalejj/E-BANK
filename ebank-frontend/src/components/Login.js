import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await login(credentials);
            localStorage.setItem('token', response.data.token);
            const role = credentials.username === 'admin' ? 'AGENT_GUICHET' : 'CLIENT';
            localStorage.setItem('role', role);
            role === 'AGENT_GUICHET' ? navigate('/admin') : navigate('/dashboard');
        } catch (err) {
            setError('Login ou mot de passe erronés');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
            background: 'radial-gradient(circle at 50% 50%, #1e3a8a 0%, #0f172a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px',
                background: '#2563eb', filter: 'blur(150px)', opacity: 0.4, borderRadius: '50%'
            }}></div>
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px',
                background: '#4f46e5', filter: 'blur(120px)', opacity: 0.4, borderRadius: '50%'
            }}></div>

            <div className="card border-0 shadow-lg p-4 p-md-5" style={{
                width: '100%', maxWidth: '450px', background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)', borderRadius: '24px', position: 'relative', zIndex: 10
            }}>
                <div className="text-center mb-5">
                    <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style={{ width: '70px', height: '70px' }}>
                        <i className="bi bi-bank2 fs-2"></i>
                    </div>
                    <h2 className="fw-bold text-dark mb-1">eBank Pro</h2>
                    <p className="text-muted small">Portail de connexion sécurisé</p>
                </div>

                {error && (
                    <div className="alert alert-danger border-0 d-flex align-items-center small py-2 shadow-sm mb-4 rounded-3" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-uppercase text-muted" style={{fontSize: '0.75rem'}}>Identifiant</label>
                        <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden">
                            <span className="input-group-text bg-white border-0 ps-3 text-primary"><i className="bi bi-person"></i></span>
                            <input
                                type="text" className="form-control bg-white border-0 fs-6 py-3" placeholder="Nom d'utilisateur"
                                value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})} required
                                style={{boxShadow: 'none'}}
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center">
                            <label className="form-label small fw-bold text-uppercase text-muted" style={{fontSize: '0.75rem'}}>Mot de passe</label>
                            {/* FIXED: Changed <a> to <button> to resolve ESLint warning */}
                            <button type="button" className="btn btn-link text-decoration-none small text-primary fw-bold p-0" style={{fontSize: '0.8rem'}}>Oublié ?</button>
                        </div>
                        <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden">
                            <span className="input-group-text bg-white border-0 ps-3 text-primary"><i className="bi bi-lock-fill"></i></span>
                            <input
                                type="password" className="form-control bg-white border-0 fs-6 py-3" placeholder="••••••••"
                                value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} required
                                style={{boxShadow: 'none'}}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-3 fw-bold shadow-lg rounded-4" disabled={loading}
                            style={{ background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)', border: 'none' }}>
                        {loading ? <span><span className="spinner-border spinner-border-sm me-2"></span>Connexion...</span> : "Accéder à mon espace"}
                    </button>
                </form>
                <div className="text-center mt-5 pt-3 border-top">
                    <p className="text-muted small mb-0">&copy; 2025 eBank Services. Tous droits réservés.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;