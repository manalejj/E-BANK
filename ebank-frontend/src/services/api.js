import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api'
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            alert("Session invalide, veuillez s’authentifier");
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const login = (credentials) => API.post('/auth/login', credentials);
export const addClient = (clientData) => API.post('/admin/clients', clientData);
export const createAccount = (accountData) => API.post('/admin/accounts', null, { params: accountData });
export const getHistory = (rib) => API.get(`/client/history/${rib}`);
export const performTransfer = (transferData) => API.post('/client/transfer', transferData);
// Added missing export
export const changePassword = (pwdData) => API.post('/auth/change-password', pwdData);

export default API;