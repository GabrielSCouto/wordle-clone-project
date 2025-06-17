import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', 
});

// Interceptor: Roda ANTES de cada requisição
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Adiciona o cabeçalho de autorização com o token
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;