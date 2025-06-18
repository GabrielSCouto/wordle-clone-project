// // client/src/pages/GamePage.tsx
// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import { useAuth } from '../contexts/AuthContext'; // Para o logout
// import { Link } from 'react-router-dom';

// export default function GamePage() {
//     const [matchWord, setMatchWord] = useState('');
//     const { logout } = useAuth();

//     // Busca a palavra quando a página carrega
//     useEffect(() => {
//         const fetchWord = async () => {
//             try {
//                 const response = await api.get('/game/start');
//                 setMatchWord(response.data.word);
//             } catch (error) {
//                 console.error('Erro ao buscar palavra do jogo', error);
//                 alert('Não foi possível iniciar o jogo.');
//             }
//         };
//         fetchWord();
//     }, []);

//     // Função a ser chamada quando o jogo terminar
//     const handleGameEnd = async (wins: boolean, attempts: number) => {
//         try {
//             await api.post('/game/save', {
//                 wins,
//                 attempts,
//                 wordText: matchWord,
//             });
//             alert('Jogo salvo com sucesso!');
//         } catch (error) {
//             console.error('Erro ao salvar o jogo', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Jogo Termo</h1>
//             <nav>
//                 <Link to="/profile" style={{ marginRight: '10px' }}>Ver Perfil</Link>
//                 <button onClick={logout}>Sair</button>
//             </nav>
//             <p>A palavra do jogo está carregada! (Para fins de depuração: {matchWord})</p>
//             {/* 
//             //LÓGICA DE UI DO GRID DO JOGO. handleGameEnd(true, 4), por exemplo.

//       */}

//             {/* <p>Implementar a lógica do jogo aqui...</p>
//             <button onClick={() => handleGameEnd(true, 4)}>Simular Jogo Vencido</button>
//             <button onClick={() => handleGameEnd(false, 6)}>Simular Jogo Perdido</button>

//             ADIÇÃO DE BOTÃO PARA SIMULAR UMA PARTIDA
//             */}


//         </div>
//     );
// }




// client/src/pages/GamePage.tsx
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Grid from '../components/game/grid'; // <-- Importa a grid

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

export default function GamePage() {
    const [matchWord, setMatchWord] = useState('');
    // --- NOVOS ESTADOS PARA A GRID ---
    const [guesses, setGuesses] = useState<string[]>(Array(MAX_ATTEMPTS).fill('')); // Array para as attempts
    const [currentAttempt, setCurrentAttempt] = useState(0); // Tentativa atual (0-5)
    const [currentGuess, setCurrentGuess] = useState(''); // O que está sendo digitado
    const [isGameOver, setIsGameOver] = useState(false); // Trava o teclado no fim do jogo

    const { logout } = useAuth();
    const navigate = useNavigate();

    // Busca a palavra quando a página carrega
    useEffect(() => {
        const fetchWord = async () => {
            try {
                const response = await api.get('/game/start');
                setMatchWord(response.data.word.toUpperCase());
            } catch (error) { console.error('Erro ao buscar palavra do jogo', error); }
        };
        fetchWord();
    }, []);

    // Função a ser chamada quando o jogo terminar
    const handleGameEnd = useCallback(async (wins: boolean, attempts: number) => {
        setIsGameOver(true);
        setTimeout(async () => {
            try {
                await api.post('/game/save', { wins, attempts, wordText: matchWord });
                alert(wins ? 'Parabéns, você venceu!' : `Você perdeu! A palavra era ${matchWord}`);
                // Opcional: navegar para o perfil após o jogo
                navigate('/profile');
            } catch (error) { console.error('Erro ao salvar o jogo', error); }
        }, 1000); // Um pequeno delay para o usuário ver o resultado
    }, [matchWord, navigate]);

    // --- LÓGICA PARA CAPTURAR O TECLADO ---
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (isGameOver) return; // Se o jogo acabou, não faz nada

        if (event.key === 'Enter') {
            if (currentGuess.length === WORD_LENGTH) {
                const newGuesses = [...guesses];
                newGuesses[currentAttempt] = currentGuess;
                setGuesses(newGuesses);
                setCurrentAttempt(prev => prev + 1);

                // Checa vitória
                if (currentGuess === matchWord) {
                    handleGameEnd(true, currentAttempt + 1);
                } else if (currentAttempt + 1 === MAX_ATTEMPTS) {
                    // Checa derrota
                    handleGameEnd(false, MAX_ATTEMPTS);
                }

                setCurrentGuess('');
            }
        } else if (event.key === 'Backspace') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < WORD_LENGTH && /^[a-zA-Z]$/.test(event.key)) {
            setCurrentGuess(prev => prev + event.key.toUpperCase());
        }
    }, [currentAttempt, currentGuess, guesses, isGameOver, handleGameEnd, matchWord]);

    // Adiciona e remove o "ouvinte" de teclado
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
                <nav>
                    <Link to="/profile" style={{ marginRight: '10px' }}>Ver Perfil</Link>
                    <button onClick={logout}>Sair</button>
                </nav>
                <h1>TERMO</h1>
                {/* Espaço para manter o título centralizado */}
                <div style={{ width: '100px' }}></div>
            </header>

            <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }}>
                <Grid
                    guesses={guesses}
                    currentAttempt={currentAttempt}
                    currentGuess={currentGuess}
                    wordToGuess={matchWord}
                />
            </main>
        </div>
    );
}