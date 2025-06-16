import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
    sub: string;
    iat: number;
    exp: number;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> | any{ // PROBLEMA DO TIPO DE RETORNO
    // 1. Pega o token do cabeçalho Authorization
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    // 2. Separa o "Bearer" do token
    const [, token] = authorization.split(' ');

    try {
        // 3. Verifica se o token é válido
        const decoded = verify(token, process.env.JWT_SECRET as string);
        const { sub } = decoded as TokenPayload;

        // 4. Adiciona o ID do usuário (sub) à requisição
        req.userId = sub;
        // 5. Deixa a requisição continuar
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}