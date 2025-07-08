import Row from './Row.tsx';

interface GridProps {
    guesses: string[]; 
    currentAttempt: number; 
    currentGuess: string; 
    wordToGuess: string;
}

export default function Grid({ guesses, currentAttempt, currentGuess, wordToGuess }: GridProps) {

    const allRows = Array.from({ length: 6 });

    return (
        <div className="grid">
            {allRows.map((_, i) => {
                const isCurrentAttempt = i === currentAttempt;
                const isCompleted = i < currentAttempt;

                return (
                    <Row
                        key={i}
                        guess={isCurrentAttempt ? currentGuess : guesses[i] || ''}
                        wordToGuess={wordToGuess}
                        
                        isCompleted={isCompleted}
                    />
                );
            })}
        </div>
    );
}