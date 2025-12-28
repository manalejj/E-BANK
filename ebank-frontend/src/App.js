import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import NavBar from './components/NavBar';
import AdminPanel from './components/AdminPanel';
import ClientDashboard from './components/ClientDashboard';
import Transfer from './components/Transfer';
import ClientList from './components/ClientList';
import NewAccount from './components/NewAccount';
import ChangePassword from './components/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        //
        // 1. Router must be the TOP level element
        <Router>

            {/* 2. NavBar must be INSIDE the Router because it uses useNavigate() */}
            <NavBar />

            <div className="container mt-4">
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Agent Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['AGENT_GUICHET']}>
                            <AdminPanel />
                        </ProtectedRoute>
                    } />
                    <Route path="/clients" element={
                        <ProtectedRoute allowedRoles={['AGENT_GUICHET']}>
                            <ClientList />
                        </ProtectedRoute>
                    } />
                    <Route path="/new-account" element={
                        <ProtectedRoute allowedRoles={['AGENT_GUICHET']}>
                            <NewAccount />
                        </ProtectedRoute>
                    } />

                    {/* Client Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['CLIENT']}>
                            <ClientDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/transfer" element={
                        <ProtectedRoute allowedRoles={['CLIENT']}>
                            <Transfer />
                        </ProtectedRoute>
                    } />

                    {/* Shared Route (Change Password) */}
                    <Route path="/change-password" element={
                        <ProtectedRoute allowedRoles={['CLIENT', 'AGENT_GUICHET']}>
                            <ChangePassword />
                        </ProtectedRoute>
                    } />

                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<div className="text-center mt-5"><h1>404 - Page Not Found</h1></div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;