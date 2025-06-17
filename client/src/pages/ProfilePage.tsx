// client/src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Para criar um link de volta para o jogo
import api from '../services/api';

// Tipo para definir a estrutura dos dados do perfil que esperamos receber
interface ProfileData {
    userId: string;
    name: string;
    email: string;
    stats: {
        totalMatches: number;
        matchWins: number;
        winRate: string;
    };
    matches: {
        matchId: string;
        date: string;
        wins: boolean;
        attempts: number;
        word: {
            text: string;
        };
    }[];
}

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/users/profile');
                setProfileData(response.data);
            } catch (err) {
                setError('Não foi possível carregar os dados do perfil.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []); // O array vazio [] garante que isso rode apenas uma vez

    if (isLoading) {
        return <div>Carregando perfil...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!profileData) {
        return <div>Nenhum dado encontrado.</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <Link to="/">Voltar para o Jogo</Link>
            <h1>Perfil de {profileData.name}</h1>
            <p>Email: {profileData.email}</p>

            <div style={{ border: '1px solid #ccc', padding: '10px', margin: '20px 0' }}>
                <h2>Estatísticas</h2>
                <p><strong>Total de Jogos:</strong> {profileData.stats.totalMatches}</p>
                <p><strong>Vitórias:</strong> {profileData.stats.matchWins}</p>
                <p><strong>Taxa de Sucesso:</strong> {profileData.stats.winRate}</p>
            </div>

            <h2>Histórico de Partidas</h2>
            {profileData.matches.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {profileData.matches.map((match) => (
                        <li key={match.matchId} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                            <strong>Palavra:</strong> {match.word.text} <br />
                            <strong>Resultado:</strong> {match.wins ? '🏆 Vitória' : '❌ Derrota'} <br />
                            <strong>Tentativas:</strong> {match.attempts} <br />
                            <strong>Data:</strong> {new Date(match.date).toLocaleDateString('pt-BR')}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Você ainda não jogou nenhuma partida.</p>
            )}
        </div>
    );
}