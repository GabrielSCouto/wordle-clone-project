// client/src/pages/GamePage.tsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Para o logout
import { Link } from 'react-router-dom';

export default function GamePage() {
    const [matchWord, setMatchWord] = useState('');
    const { logout } = useAuth();

    // Busca a palavra quando a página carrega
    useEffect(() => {
        const fetchWord = async () => {
            try {
                const response = await api.get('/game/start');
                setMatchWord(response.data.word);
            } catch (error) {
                console.error('Erro ao buscar palavra do jogo', error);
                alert('Não foi possível iniciar o jogo.');
            }
        };
        fetchWord();
    }, []);

    // Função a ser chamada quando o jogo terminar
    const handleGameEnd = async (wins: boolean, attempts: number) => {
        try {
            await api.post('/game/save', {
                wins,
                attempts,
                wordText: matchWord,
            });
            alert('Jogo salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar o jogo', error);
        }
    };

    return (
        <div>
            <h1>Jogo Termo</h1>
            <nav>
                <Link to="/profile" style={{ marginRight: '10px' }}>Ver Perfil</Link>
                <button onClick={logout}>Sair</button>
            </nav>
            <p>A palavra do jogo está carregada! (Para fins de depuração: {matchWord})</p>
            {/* 
            //LÓGICA DE UI DO GRID DO JOGO. handleGameEnd(true, 4), por exemplo.
      */}
        </div>
    );
}