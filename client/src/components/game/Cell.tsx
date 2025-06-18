import './Grid.css';

interface CellProps {
    letter?: string;
    status?: 'empty' | 'typing' | 'correct' | 'present' | 'absent';
}

export default function Cell({ letter, status = 'empty' }: CellProps) {
    return (
        <div className={`cell ${status}`}>
            {letter}
        </div>
    );
}