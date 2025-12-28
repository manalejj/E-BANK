import React, { useEffect, useState } from 'react';
import API from '../services/api';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 5;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await API.get('/admin/clients');
                if (Array.isArray(response.data)) {
                    setClients(response.data);
                    setFilteredClients(response.data);
                } else {
                    setClients([]);
                }
            } catch (err) {
                setClients([]);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        const results = clients.filter(client =>
            client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.identityNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClients(results);
        setCurrentPage(1);
    }, [searchTerm, clients]);

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("ID copié: " + text);
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-50 mt-5">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Gestion Clients</h2>
                    <p className="text-muted small mb-0">Base de données clients et identifiants.</p>
                </div>
                <div className="bg-white shadow-sm px-4 py-2 rounded-pill">
                    <span className="text-muted small me-2">Total</span>
                    <span className="badge bg-primary rounded-pill">{filteredClients.length}</span>
                </div>
            </div>

            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                {/* Search Bar */}
                <div className="p-4 bg-light border-bottom">
                    <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden bg-white">
                        <span className="input-group-text bg-white border-0 ps-4 text-muted"><i className="bi bi-search"></i></span>
                        <input
                            type="text"
                            className="form-control border-0 bg-white"
                            placeholder="Rechercher par CIN, Nom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ boxShadow: 'none' }}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-white">
                        <tr>
                            <th className="py-3 px-4 text-muted small fw-bold text-uppercase border-bottom">Identité (CIN)</th>
                            <th className="py-3 text-muted small fw-bold text-uppercase border-bottom">Client</th>
                            <th className="py-3 text-muted small fw-bold text-uppercase border-bottom">Contact</th>
                            <th className="py-3 text-muted small fw-bold text-uppercase border-bottom">Ville</th>
                            <th className="py-3 px-4 text-end text-muted small fw-bold text-uppercase border-bottom">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentClients.length > 0 ? (
                            currentClients.map(c => (
                                <tr key={c.identityNumber}>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                                                 style={{ width: '35px', height: '35px' }}>
                                                {c.lastName.charAt(0)}
                                            </div>
                                            <span className="fw-bold font-monospace text-dark">{c.identityNumber}</span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="fw-bold text-dark">{c.lastName.toUpperCase()}</div>
                                        <div className="small text-muted">{c.firstName}</div>
                                    </td>
                                    <td className="py-3 text-muted small">
                                        <i className="bi bi-envelope me-2"></i>{c.email}
                                    </td>
                                    <td className="py-3">
                                        <span className="badge bg-light text-dark border fw-normal">{c.address}</span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <button
                                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                            onClick={() => copyToClipboard(c.identityNumber)}
                                        >
                                            <i className="bi bi-clipboard me-1"></i> Copier ID
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-5 text-muted">Aucun résultat.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center p-3 bg-light">
                        <nav>
                            <ul className="pagination mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 text-dark bg-transparent" onClick={() => setCurrentPage(currentPage - 1)}>
                                        &laquo;
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index} className="page-item">
                                        <button
                                            className={`page-link border-0 rounded-circle mx-1 ${currentPage === index + 1 ? 'bg-primary text-white shadow-sm' : 'text-dark bg-transparent'}`}
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 text-dark bg-transparent" onClick={() => setCurrentPage(currentPage + 1)}>
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientList;