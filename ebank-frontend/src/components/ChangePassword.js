import React, { useState } from 'react';
import { changePassword } from '../services/api'; // Use named export

const ChangePassword = () => {
    const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await changePassword(pwdData);
            setStatus({ type: 'success', msg: 'Mot de passe mis à jour avec succès.' });
            setPwdData({ oldPassword: '', newPassword: '' }); // Clear form on success
        } catch (err) {
            setStatus({ type: 'danger', msg: 'Erreur: Ancien mot de passe incorrect.' });
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="glass-card shadow-lg p-5" style={{ maxWidth: '450px', width: '100%', borderRadius: '20px' }}>
                <div className="text-center mb-4">
                    <div className="bg-warning-subtle d-inline-block p-3 rounded-circle mb-3">
                        <i className="bi bi-key-fill text-warning fs-3"></i>
                    </div>
                    <h4 className="fw-bold">Sécurité du Compte</h4>
                    <p className="text-muted small">Modifiez votre mot de passe régulièrement</p>
                </div>

                {status.msg && (
                    <div className={`alert alert-${status.type} py-2 small text-center rounded-3`}>{status.msg}</div>
                )}

                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase">Ancien Mot de Passe</label>
                        <input type="password" name="oldPassword" placeholder="••••••••"
                               className="form-control border-0 bg-light py-2"
                               value={pwdData.oldPassword}
                               onChange={e => setPwdData({...pwdData, oldPassword: e.target.value})} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted text-uppercase">Nouveau Mot de Passe</label>
                        <input type="password" name="newPassword" placeholder="••••••••"
                               className="form-control border-0 bg-light py-2"
                               value={pwdData.newPassword}
                               onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm fw-bold">
                        Mettre à jour
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;