import React, { useState } from 'react';
import API from '../services/api';

const NewAccount = () => {
    // Generate a random 24-digit RIB for convenience, or let Admin type it
    const generateRIB = () => {
        let rib = "";
        for(let i=0; i<24; i++) rib += Math.floor(Math.random() * 10);
        return rib;
    };

    const [data, setData] = useState({ rib: generateRIB(), identityNumber: '' });
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend expects parameters: ?rib=...&idNum=...
            await API.post('/admin/accounts', null, {
                params: { rib: data.rib, idNum: data.identityNumber }
            });
            setMsg({ type: 'success', text: 'Compte créé avec succès (Statut: Ouvert)' }); // RG_10
            setData({ ...data, rib: generateRIB() }); // Generate new RIB for next one
        } catch (err) {
            setMsg({ type: 'danger', text: "Erreur: Le client n'existe pas ou RIB invalide." }); // RG_8
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="glass-card shadow p-5" style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="fw-bold mb-4 text-primary">Nouveau Compte Bancaire</h3>

                {msg.text && (
                    <div className={`alert alert-${msg.type} role="alert"`}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold small text-muted">Identité du Client (CIN)</label>
                        <input className="form-control"
                               placeholder="Ex: AB12345"
                               value={data.identityNumber}
                               onChange={e => setData({...data, identityNumber: e.target.value})}
                               required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold small text-muted">RIB Généré</label>
                        <div className="input-group">
                            <input className="form-control bg-light" value={data.rib} readOnly />
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setData({...data, rib: generateRIB()})}>
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                        <small className="text-muted">RIB à 24 chiffres (RG_9)</small>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 mt-3">
                        Créer le Compte
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewAccount;