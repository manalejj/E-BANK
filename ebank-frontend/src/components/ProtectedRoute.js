import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        // Interdit l'accès si non authentifié
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Message d'erreur spécifique
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning">
                    <h3>Accès Refusé</h3>
                    <p>Vous n’avez pas le droit d’accéder à cette fonctionnalité.
                        Veuillez contacter votre administrateur.</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;