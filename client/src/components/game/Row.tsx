import Cell from './Cell';

interface RowProps {
    guess?: string;
    wordToGuess: string;
    isCompleted: boolean;
}

// função que calcula o status de todas as células de uma vez
const getStatuses = (guess: string, wordToGuess: string) => {
    const guessChars = guess.split('');
    const solutionChars = wordToGuess.split('');
    const statuses: ('correct' | 'present' | 'absent')[] = [];

    // 1ª Passada: Encontrar as letras 'correct' (verdes)
    guessChars.forEach((letter, i) => {
        if (solutionChars[i] === letter) {
            statuses[i] = 'correct';
            solutionChars[i] = ''; // "Usa" a letra da solução para não ser reutilizada
        }
    });

    // 2ª Passada: Encontrar as letras 'present' (amarelas) e 'absent' (cinzas)
    guessChars.forEach((letter, i) => {
        // Se a letra já foi marcada como 'correct', pula para a próxima
        if (statuses[i]) return;

        const indexOfPresentChar = solutionChars.indexOf(letter);
        if (indexOfPresentChar !== -1) {
            statuses[i] = 'present';
            solutionChars[indexOfPresentChar] = ''; // Usa a letra para não ser recontada
        } else {
            statuses[i] = 'absent';
        }
    });

    return statuses;
};


export default function Row({ guess = '', wordToGuess, isCompleted }: RowProps) {
    // Se a linha não foi completada, todas as células estão no estado 'typing' ou 'empty'
    if (!isCompleted) {
        const letters = guess.padEnd(5, ' ').split('');
        return (
            <div className="row">
                {letters.map((letter, index) => (
                    <Cell key={index} letter={letter.trim()} status={guess[index] ? 'typing' : 'empty'} />
                ))}
            </div>
        );
    }

    // Se a linha foi completada, calcula os status corretos
    const statuses = getStatuses(guess, wordToGuess);

    return (
        <div className="row">
            {guess.split('').map((letter, index) => (
                <Cell
                    key={index}
                    letter={letter}
                    status={statuses[index]}
                />
            ))}
        </div>
    );
}