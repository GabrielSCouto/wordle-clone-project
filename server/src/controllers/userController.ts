// server/src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { UserCreateData } from '../types/userTypes';

const userService = new UserService();

export class UserController {
    async register(req: Request, res: Response): Promise<any> {
        // 1. PEGAR OS DADOS DO CORPO DA REQUISIÇÃO
        const { name, email, password } = req.body;

        try {
            // 2. CHAMAR O SERVIÇO
            // A lógica de negócio fica toda no service. O controller só guia.
            const newUser = await userService.create({ name, email, password });
            // 3. ENVIAR A RESPOSTA DE SUCESSO (201 + certo)
            return res.status(201).json(newUser);
        } catch (error: any) {
            // 4. LIDAR COM ERROS
            return res.status(400).json({ message: error.message });
        }
    }


    async login(req: Request, res: Response): Promise<any> {
        const { email, password } = req.body;

        try {
            const result = await userService.login({ email, password });
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message }); // 401 Unauthorized é mais apropriado
        }
    }

    async getProfile(req: Request, res: Response): Promise<any> {
        // O userId é adicionado à requisição pelo nosso authMiddleware
        const userId = req.userId;

        try {
            const profile = await userService.getUserProfile(userId);
            return res.status(200).json(profile);
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }
}