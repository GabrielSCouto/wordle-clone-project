import Cell from './Cell';

interface RowProps {
    guess?: string; // A palavra da tentativa (ex: "AMIGO")
    wordToGuess: string; // A palavra correta (ex: "SAGAZ")
    isCompleted: boolean; // Esta tentativa já foi enviada?
}

export default function Row({ guess = '', wordToGuess, isCompleted }: RowProps) {
    const getCellStatus = (letter: string, index: number) => {
        if (!isCompleted) return 'typing';
        if (letter === wordToGuess[index]) return 'correct';
        if (wordToGuess.includes(letter)) return 'present';
        return 'absent';
    };

    const letters = guess.padEnd(5, ' ').split(''); // Garante 5 células

    return (
        <div className="row">
            {letters.map((letter, index) => (
                <Cell
                    key={index}
                    letter={letter.trim()}
                    status={getCellStatus(letter, index)}
                />
            ))}
        </div>
    );
}