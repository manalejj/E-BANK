import React, { useEffect, useState } from 'react';
import API from '../services/api';

const ClientDashboard = () => {
    // STATE
    const [accounts, setAccounts] = useState([]);
    const [rib, setRib] = useState(''); // Initially empty

    const [operations, setOperations] = useState([]);
    const [balance, setBalance] = useState(0);
    const [lastCredit, setLastCredit] = useState(0);
    const [lastDebit, setLastDebit] = useState(0);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    // 1. Fetch Real User Accounts
    useEffect(() => {
        const fetchMyAccounts = async () => {
            try {
                const res = await API.get('/client/my-accounts');
                setAccounts(res.data);

                if (res.data.length > 0) {
                    setRib(res.data[0].rib); // Select the first real account
                    setBalance(res.data[0].balance);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching accounts", err);
                setLoading(false);
            }
        };
        fetchMyAccounts();
    }, []);

    // 2. Fetch History only if RIB exists
    useEffect(() => {
        if (!rib) return;

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/client/history/${rib}?page=${currentPage}&size=${pageSize}`);
                const ops = res.data.content;

                setOperations(ops);
                setTotalPages(res.data.totalPages);

                if (ops.length > 0 && ops[0].account) {
                    setBalance(ops[0].account.balance);
                }

                // Real Stats
                if (ops.length > 0) {
                    const latestCreditOp = ops.find(op => op.type === 'CREDIT');
                    setLastCredit(latestCreditOp ? latestCreditOp.amount : 0);

                    const latestDebitOp = ops.find(op => op.type === 'DEBIT');
                    setLastDebit(latestDebitOp ? latestDebitOp.amount : 0);
                } else {
                    setLastCredit(0);
                    setLastDebit(0);
                }

            } catch (err) {
                console.error("Error history:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [rib, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setCurrentPage(newPage);
    };

    // --- RENDER ---

    // Case: Loading
    if (loading && !rib && accounts.length === 0) {
        return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
    }

    // Case: No Account Created Yet (This is what you should see now!)
    if (accounts.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div className="glass-card shadow p-5 mx-auto" style={{maxWidth: '600px'}}>
                    <div className="mb-4 text-primary opacity-50">
                        <i className="bi bi-hourglass-split display-1"></i>
                    </div>
                    <h2 className="fw-bold text-dark">Bienvenue sur eBank Pro</h2>
                    <p className="text-muted lead mt-3">
                        Votre compte client est créé, mais <strong>aucun compte bancaire</strong> n'est encore actif.
                    </p>
                    <hr className="my-4"/>
                    <div className="alert alert-info border-0 shadow-sm text-start">
                        <i className="bi bi-info-circle-fill me-2"></i>
                        Veuillez contacter votre administrateur pour créer votre RIB.
                    </div>
                </div>
            </div>
        );
    }

    // Case: Account Exists
    return (
        <div className="container py-5">
            <div className="mb-5">
                <h2 className="fw-bold text-dark mb-1">Mon Espace</h2>
                <p className="text-muted">Tableau de bord financier.</p>
            </div>

            <div className="row g-5 mb-5">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-lg text-white h-100"
                         style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', borderRadius: '25px' }}>
                        <div className="card-body p-5 d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <label className="text-white-50 small text-uppercase fw-bold">Compte Actif</label>
                                    <select
                                        className="form-select form-select-sm bg-transparent text-white border-0 p-0 fw-bold fs-5 mt-1"
                                        style={{ boxShadow: 'none', cursor: 'pointer', width: 'auto' }}
                                        value={rib}
                                        onChange={(e) => { setRib(e.target.value); setCurrentPage(0); }}
                                    >
                                        {accounts.map(acc => (
                                            <option key={acc.rib} value={acc.rib} className="text-dark">
                                                Compte {acc.rib.substring(0, 4)}...
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <i className="bi bi-wifi fs-2 text-white-50"></i>
                            </div>
                            <div>
                                <p className="text-white-50 small mb-1">Solde Disponible</p>
                                <h1 className="display-4 fw-bold mb-0">{balance.toLocaleString()} <span className="fs-4 fw-normal">DH</span></h1>
                            </div>
                            <div className="mt-4 pt-3 border-top border-white-10 d-flex justify-content-between align-items-end">
                                <span className="font-monospace text-white-50">**** {rib.substring(rib.length - 4)}</span>
                                <span className="badge bg-white text-dark rounded-pill px-3 py-2">OUVERT</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 d-flex flex-column justify-content-center">
                    <div className="p-4 bg-white shadow-sm rounded-4 mb-3 border-start border-4 border-success">
                        <div className="d-flex justify-content-between align-items-center">
                            <div><h5 className="text-muted small text-uppercase mb-1">Dernier Crédit</h5><h3 className="text-success fw-bold mb-0">+ {lastCredit.toLocaleString()} DH</h3></div>
                            <div className="bg-success-subtle p-3 rounded-circle text-success"><i className="bi bi-arrow-down-left fs-4"></i></div>
                        </div>
                    </div>
                    <div className="p-4 bg-white shadow-sm rounded-4 border-start border-4 border-danger">
                        <div className="d-flex justify-content-between align-items-center">
                            <div><h5 className="text-muted small text-uppercase mb-1">Dernier Débit</h5><h3 className="text-danger fw-bold mb-0">- {lastDebit.toLocaleString()} DH</h3></div>
                            <div className="bg-danger-subtle p-3 rounded-circle text-danger"><i className="bi bi-arrow-up-right fs-4"></i></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="card-header bg-white p-4 border-bottom border-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-clock-history me-2 text-primary"></i>Historique</h5>
                    <span className="badge bg-light text-dark border">Page {currentPage + 1} / {totalPages > 0 ? totalPages : 1}</span>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                        <tr>
                            <th className="py-3 px-4 border-0 text-muted small fw-bold text-uppercase">Date</th>
                            <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Description</th>
                            <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Type</th>
                            <th className="py-3 px-4 border-0 text-end text-muted small fw-bold text-uppercase">Montant</th>
                        </tr>
                        </thead>
                        <tbody>
                        {operations.length > 0 ? operations.map(op => (
                            <tr key={op.id}>
                                <td className="px-4 py-3 text-muted fw-bold">{new Date(op.operationDate).toLocaleDateString()}</td>
                                <td className="py-3 fw-semibold text-dark">{op.description}</td>
                                <td className="py-3"><span className={`badge rounded-pill px-3 py-2 ${op.type === 'CREDIT' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>{op.type}</span></td>
                                <td className={`px-4 py-3 text-end fw-bold ${op.type === 'DEBIT' ? 'text-danger' : 'text-success'}`}>{op.type === 'DEBIT' ? '-' : '+'}{op.amount.toLocaleString()} DH</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center py-5 text-muted">Aucune opération trouvée.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="card-footer bg-white p-3 border-0 d-flex justify-content-center">
                        <button className="btn btn-light rounded-circle mx-2 shadow-sm" disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}><i className="bi bi-chevron-left"></i></button>
                        <button className="btn btn-light rounded-circle mx-2 shadow-sm" disabled={currentPage === totalPages - 1} onClick={() => handlePageChange(currentPage + 1)}><i className="bi bi-chevron-right"></i></button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;