import Row from './row.tsx';

interface GridProps {
    guesses: string[]; 
    currentAttempt: number; 
    currentGuess: string; 
    wordToGuess: string;
}

export default function Grid({ guesses, currentAttempt, currentGuess, wordToGuess }: GridProps) {
    // Criamos um array de 6 posições para garantir que sempre teremos 6 linhas
    const allRows = Array.from({ length: 6 });

    return (
        <div className="grid">
            {allRows.map((_, i) => {
                // Determina o estado de cada linha no loop
                const isCurrentAttempt = i === currentAttempt;
                const isCompleted = i < currentAttempt;

                return (
                    <Row
                        key={i}
                        // Se for a tentativa atual, usamos o currentGuess, senão usamos a tentativa passada
                        guess={isCurrentAttempt ? currentGuess : guesses[i] || ''}
                        wordToGuess={wordToGuess}
                        
                        isCompleted={isCompleted}
                    />
                );
            })}
        </div>
    );
}