import './Grid.css';
import Cell from './Cell';

interface InstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="notification-overlay" onClick={onClose}>
            <div className="notification-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Como Jogar</h2>
                <p>Descubra o LETRA do dia em 6 tentativas.</p>
                <p>Cada tentativa deve ser uma palavra de 5 letras. Use o botão Enter para submeter.</p>
                <p>Depois de cada tentativa, a cor dos quadrados irá mudar de acordo com os seguintes exemplos:</p>

                <hr />

                <div className="example-row">
                    <Cell letter="T" status="correct" />
                    <Cell letter="E" />
                    <Cell letter="R" />
                    <Cell letter="M" />
                    <Cell letter="O" />
                </div>
                <p>A letra <strong>T</strong> está na palavra e na posição correta.</p>

                <div className="example-row">
                    <Cell letter="C" />
                    <Cell letter="A" />
                    <Cell letter="S" status="present" />
                    <Cell letter="A" />
                    <Cell letter="L" />
                </div>
                <p>A letra <strong>S</strong> está na palavra, mas na posição errada.</p>

                <div className="example-row">
                    <Cell letter="P" />
                    <Cell letter="O" />
                    <Cell letter="S" />
                    <Cell letter="T" />
                    <Cell letter="E" status="absent" />
                </div>
                <p>A letra <strong>E</strong> não faz parte da palavra.</p>

                <hr />
                <button onClick={onClose}>Entendi!</button>
            </div>
        </div>
    );
}