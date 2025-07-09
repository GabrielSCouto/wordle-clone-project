import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); // Para o cadastro
    const [isRegistering, setIsRegistering] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                // Lógica de Cadastro
                await api.post('/users/register', { name, email, password });
                alert('Cadastro realizado com sucesso! Faça o login.');
                setIsRegistering(false); // Volta para a tela de login
            } else {
                // Lógica de Login
                const response = await api.post('/users/login', { email, password });
                login(response.data.token); 
                navigate('/'); 
            }
        } catch (error) {
            alert('Falha na operação. Verifique seus dados.');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isRegistering ? 'Cadastro' : 'Login'}</h2>
            {isRegistering && (
                <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required />
            )}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">{isRegistering ? 'Cadastrar' : 'Entrar'}</button>
            <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: 'pointer', color: 'blue' }}>
                {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
            </p>
        </form>
    );
}