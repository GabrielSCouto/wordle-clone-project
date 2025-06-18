import Row from './row.tsx';

interface GridProps {
    guesses: string[]; // Array com todas as tentativas (ex: ["SONHO", "LIVRO"])
    currentAttempt: number; // O índice da tentativa atual (0 a 5)
    currentGuess: string; // A palavra que o usuário está digitando
    wordToGuess: string;
}

export default function Grid({ guesses, currentAttempt, currentGuess, wordToGuess }: GridProps) {
    return (
        <div className="grid">
            {guesses.map((guess, i) => {
                if (i === currentAttempt) {
                    // Renderiza a linha que está sendo digitada
                    return <Row key={i} guess={currentGuess} wordToGuess={wordToGuess} isCompleted={false} />;
                }
                // Renderiza as linhas já completadas
                return <Row key={i} guess={guess} wordToGuess={wordToGuess} isCompleted={true} />;
            })}
        </div>
    );
}