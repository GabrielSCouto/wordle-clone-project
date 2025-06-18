// client/src/components/game/GameEndNotification.tsx
import './Grid.css'; // Vamos reutilizar o CSS que já temos e adicionar mais estilos lá

interface GameEndNotificationProps {
    isOpen: boolean;
    didWin: boolean;
    correctWord: string;
    onPlayAgain: () => void;
    onNavigateToProfile: () => void;
}

export default function GameEndNotification({
    isOpen,
    didWin,
    correctWord,
    onPlayAgain,
    onNavigateToProfile,
}: GameEndNotificationProps) {

    if (!isOpen) {
        return null; // Se não for pra mostrar, não renderiza nada
    }

    return (
        // A camada semi-transparente que cobre a tela inteira
        <div className="notification-overlay">
            {/* O conteúdo da notificação */}
            <div className="notification-content">
                <h2>{didWin ? 'Você Venceu!' : 'Não foi desta vez!'}</h2>
                <p>
                    A palavra correta era: <strong>{correctWord}</strong>
                </p>

                <div className="notification-actions">
                    <button onClick={onPlayAgain}>Jogar Novamente</button>
                    <button onClick={onNavigateToProfile}>Ver Estatísticas</button>
                </div>
            </div>
        </div>
    );
}