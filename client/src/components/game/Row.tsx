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

    // Encontrar as letras 'correct' (verdes)
    guessChars.forEach((letter, i) => {
        if (solutionChars[i] === letter) {
            statuses[i] = 'correct';
            solutionChars[i] = ''; 
        }
    });

    //Encontrar as letras 'present' (amarelas) e 'absent' (cinzas)
    guessChars.forEach((letter, i) => {
        if (statuses[i]) return;

        const indexOfPresentChar = solutionChars.indexOf(letter);
        if (indexOfPresentChar !== -1) {
            statuses[i] = 'present';
            solutionChars[indexOfPresentChar] = ''; 
        } else {
            statuses[i] = 'absent';
        }
    });

    return statuses;
};


export default function Row({ guess = '', wordToGuess, isCompleted }: RowProps) {
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