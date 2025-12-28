import React, { useState } from 'react';
import { addClient } from '../services/api';

const AdminPanel = () => {
    const [client, setClient] = useState({
        firstName: '', lastName: '', identityNumber: '', email: '', address: '', birthDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addClient(client); // Validates uniqueness (RG_4, RG_6)
            alert("Client enregistré. Les accès ont été envoyés par email (RG_7).");
        } catch (err) {
            alert(err.response?.data || "Erreur lors de l'inscription");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="glass-card shadow-sm p-5 border-0">
                        <h3 className="fw-bold mb-4 text-navy">Enregistrement Client <span className="badge bg-primary-subtle text-primary fs-6 ms-2">Agent</span></h3>
                        <form onSubmit={handleSubmit} className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Nom</label>
                                <input className="form-control py-2 shadow-sm border-light" onChange={e => setClient({...client, lastName: e.target.value})} required /> {/* cite: 53 */}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Prénom</label>
                                <input className="form-control py-2 shadow-sm border-light" onChange={e => setClient({...client, firstName: e.target.value})} required /> {/* cite: 53 */}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Numéro d'identité (CIN)</label>
                                <input className="form-control py-2 shadow-sm border-light" onChange={e => setClient({...client, identityNumber: e.target.value})} required /> {/* cite: 53 */}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Adresse Email</label>
                                <input type="email" className="form-control py-2 shadow-sm border-light" onChange={e => setClient({...client, email: e.target.value})} required /> {/* cite: 53 */}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Date de Naissance</label>
                                <input type="date" className="form-control py-2 shadow-sm border-light" onChange={e => setClient({...client, birthDate: e.target.value})} required /> {/* cite: 53 */}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Adresse Postale</label>
                                <input className="form-control py-2 shadow-sm border-light" onChange={e => setClient({...client, address: e.target.value})} required /> {/* cite: 53 */}
                            </div>
                            <div className="col-12 mt-5">
                                <button type="submit" className="btn-bank px-5 shadow-lg">
                                    Finaliser l'Inscription
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;