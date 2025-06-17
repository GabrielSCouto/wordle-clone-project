// server/src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const userRoutes = Router();
const userController = new UserController();

// Quando uma requisição POST chegar em /register, chame o método register do controller
userRoutes.post('/register', userController.register);
userRoutes.post('/login', userController.login);
userRoutes.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));

export default userRoutes;