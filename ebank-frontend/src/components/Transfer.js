import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
    const [myAccounts, setMyAccounts] = useState([]);
    const [data, setData] = useState({
        sourceRib: '',
        destRib: '',
        amount: '',
        motif: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. FETCH REAL ACCOUNTS (No more simulation)
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await API.get('/client/my-accounts');
                const accounts = response.data;
                setMyAccounts(accounts);

                // Automatically select the first account if it exists
                if (accounts.length > 0) {
                    setData(d => ({ ...d, sourceRib: accounts[0].rib }));
                }
            } catch (err) {
                console.error("Erreur chargement comptes", err);
                setStatus({ type: 'danger', msg: "Impossible de charger vos comptes." });
            }
        };
        fetchAccounts();
    }, []);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });

        // Validation: Cannot transfer if no account exists
        if (myAccounts.length === 0) {
            setStatus({ type: 'danger', msg: "Vous n'avez aucun compte bancaire actif." });
            return;
        }

        setLoading(true);

        try {
            await API.post('/client/transfer', data);
            setStatus({ type: 'success', msg: "Virement effectué avec succès !" });
            // Reset form but keep source RIB
            setData(prev => ({ ...prev, amount: '', destRib: '', motif: '' }));
        } catch (err) {
            const backendMsg = err.response?.data?.message || err.response?.data || "";
            let userMsg = "Erreur lors du virement. Vérifiez le RIB destinataire.";

            if (backendMsg.includes("RG_12") || backendMsg.includes("Insufficient")) {
                userMsg = "Solde insuffisant pour effectuer ce virement !";
            } else if (backendMsg.includes("RG_11")) {
                userMsg = "Compte bloqué ou fermé !";
            }
            setStatus({ type: 'danger', msg: userMsg });
        } finally {
            setLoading(false);
        }
    };

    // If no accounts exist (New user waiting for Admin)
    if (myAccounts.length === 0 && !status.msg) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning shadow-sm p-4" role="alert">
                    <h4 className="alert-heading"><i className="bi bi-exclamation-circle me-2"></i>Action Impossible</h4>
                    <p>Vous ne possédez pas encore de compte bancaire (RIB).</p>
                    <hr />
                    <p className="mb-0">Veuillez contacter un administrateur pour ouvrir votre compte.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-6">
                    <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>

                        {/* Header */}
                        <div className="card-header bg-white p-4 border-bottom-0">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary-subtle p-3 rounded-circle me-3 text-primary">
                                    <i className="bi bi-send-fill fs-4"></i>
                                </div>
                                <div>
                                    <h4 className="fw-bold text-dark mb-1">Nouveau Virement</h4>
                                    <p className="text-muted small mb-0">Transférez de l'argent en toute sécurité.</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Message */}
                        {status.msg && (
                            <div className={`alert alert-${status.type} mx-4 mt-2 d-flex align-items-center`} role="alert">
                                <i className={`bi ${status.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2 fs-5`}></i>
                                <div>{status.msg}</div>
                            </div>
                        )}

                        <div className="card-body p-4 pt-0">
                            <form onSubmit={handleTransfer}>

                                {/* Source Account Selection */}
                                <div className="mb-4 bg-light p-3 rounded-3 border border-light">
                                    <label className="form-label small fw-bold text-muted text-uppercase mb-2">Compte à débiter</label>
                                    <select
                                        className="form-select border-0 bg-white shadow-sm py-2 fw-semibold"
                                        value={data.sourceRib}
                                        onChange={e => setData({...data, sourceRib: e.target.value})}
                                    >
                                        {myAccounts.map(acc => (
                                            <option key={acc.rib} value={acc.rib}>
                                                {acc.rib} (Solde: {acc.balance} DH)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Destination */}
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Bénéficiaire</label>
                                    <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                        <span className="input-group-text bg-white border-0 ps-3 text-muted"><i className="bi bi-person-badge"></i></span>
                                        <input
                                            className="form-control border-0 py-3"
                                            placeholder="RIB du destinataire (24 chiffres)"
                                            value={data.destRib}
                                            onChange={e => setData({...data, destRib: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Amount & Motif Row */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Montant</label>
                                        <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                            <input
                                                type="number"
                                                className="form-control border-0 py-3 fw-bold text-primary fs-5"
                                                placeholder="0.00"
                                                value={data.amount}
                                                onChange={e => setData({...data, amount: e.target.value})}
                                                required
                                            />
                                            <span className="input-group-text bg-white border-0 fw-bold text-dark pe-3">DH</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Motif</label>
                                        <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                            <input
                                                type="text"
                                                className="form-control border-0 py-3"
                                                placeholder="Ex: Loyer"
                                                value={data.motif}
                                                onChange={e => setData({...data, motif: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-3 fw-bold shadow-sm"
                                    style={{ borderRadius: '10px', fontSize: '1.1rem' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span><span className="spinner-border spinner-border-sm me-2"></span>Traitement...</span>
                                    ) : (
                                        <span>Valider le virement <i className="bi bi-arrow-right ms-2"></i></span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transfer;