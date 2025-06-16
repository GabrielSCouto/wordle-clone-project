// server/src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';

const userRoutes = Router();
const userController = new UserController();

// Quando uma requisição POST chegar em /register, chame o método register do controller
userRoutes.post('/register', userController.register);

userRoutes.post('/login', userController.login);

export default userRoutes;