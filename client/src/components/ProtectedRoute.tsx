import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Se não estiver logado redireciona para /login
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};