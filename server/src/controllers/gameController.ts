// server/src/controllers/gameController.ts
import { Request, Response } from 'express';
import { GameService } from '../services/gameService';

const gameService = new GameService();

export class GameController {
    async startGame(req: Request, res: Response): Promise<any> {
        try {
            const result = await gameService.getGameWord();
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ message: 'Erro ao buscar palavra.' });
        }
    }

    async saveGame(req: Request, res: Response): Promise<any> {
        const { wins, attempts, wordText } = req.body;
        const { userId } = req; //ID do usuário que o middleware adicionou

        try {
            const result = await gameService.saveResult({
                wins,
                attempts,
                wordText,
                userId,
            });
            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}