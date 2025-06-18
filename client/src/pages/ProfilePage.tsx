import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface ProfileData {
    UserId: string;
    name: string; // <-- MUDANÇA
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


    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/users/profile');
            setProfileData(response.data);
            setFormData({
                name: response.data.name, 
                email: response.data.email,  
                password: '',
            });
        } catch (err) {
            setError('Não foi possível carregar os dados do perfil.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e: FormEvent) => {
        e.preventDefault();


        const dataToUpdate: { name?: string; email?: string; password?: string } = {};

        if (formData.name !== profileData?.name) dataToUpdate.name = formData.name;
        if (formData.email !== profileData?.email) dataToUpdate.email = formData.email;
        if (formData.password) dataToUpdate.password = formData.password;

        if (Object.keys(dataToUpdate).length === 0) {
            alert("Nenhuma alteração foi feita.");
            setIsEditing(false);
            return;
        }

        try {
            await api.put('/users/profile/update', dataToUpdate);
            alert('Perfil atualizado com sucesso!');
            setIsEditing(false);
            fetchProfile();
        } catch (err: any) {
            alert(`Erro ao atualizar: ${err.response?.data?.message || 'Tente novamente.'}`);
        }
    };

    if (isLoading) return <div>Carregando perfil...</div>;
    if (error) return <div>{error}</div>;
    if (!profileData) return <div>Nenhum dado encontrado.</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
            <Link to="/">Voltar para o Jogo</Link>
            <h1>Perfil de {profileData.name}</h1> 

            {isEditing ? (
                // MODO DE EDIÇÃO
                <form onSubmit={handleUpdateSubmit}>
                    <h3>Editando Perfil</h3>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>New Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Deixe em branco para não alterar" />
                    </div>
                    <button type="submit">Salvar Alterações</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                </form>
            ) : (
                // MODO DE VISUALIZAÇÃO
                <>
                    <p>Email: {profileData.email}</p>
                    <button onClick={() => setIsEditing(true)}>Editar Perfil</button>

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
                </>
            )}
        </div>
    );
}