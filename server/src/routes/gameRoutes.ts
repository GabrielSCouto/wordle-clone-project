// server/src/routes/gameRoutes.ts
import { Router } from 'express';
import { GameController } from '../controllers/gameController';
import { authMiddleware } from '../middleware/authMiddleware'; 

const gameRoutes = Router();
const gameController = new GameController();

// APLICAMOS O MIDDLEWARE AQUI
// A requisição primeiro passa pelo authMiddleware e, se for válida, segue para o controller.
gameRoutes.get('/start', authMiddleware, (req, res) => gameController.startGame(req, res));
gameRoutes.post('/save', authMiddleware, (req, res) => gameController.saveGame(req, res));

export default gameRoutes;