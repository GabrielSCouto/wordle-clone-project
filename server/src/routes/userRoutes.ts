// server/src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const userRoutes = Router();
const userController = new UserController();


userRoutes.post('/register', userController.register);
userRoutes.post('/login', userController.login);
userRoutes.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
userRoutes.put('/profile/update', authMiddleware, (req, res) => userController.updateProfile(req, res));
userRoutes.delete('/profile/delete', authMiddleware, (req, res) => userController.deleteProfile(req, res));

export default userRoutes;