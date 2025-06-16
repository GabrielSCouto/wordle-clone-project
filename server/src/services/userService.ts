// server/src/services/userService.ts
import { hash } from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { UserCreateData } from '../types/userTypes';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export class UserService {
    // Método para criar um usuário
    async create({ name, email, password }: UserCreateData) {
        // 1. VERIFICAR SE O USUÁRIO JÁ EXISTE
        const userAlreadyExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userAlreadyExists) {
            // Lançar um erro é uma boa prática, o controller vai capturá-lo
            throw new Error('Este e-mail já está em uso.');
        }

        // 2. CRIPTOGRAFAR A SENHA
        // O segundo argumento é o "salt", a complexidade da criptografia. 8 é um bom valor.
        const passwordHash = await hash(password, 8);

        // 3. SALVAR NO BANCO DE DADOS
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash, // Salvamos a senha criptografada
            },
        });

        // 4. RETORNAR O USUÁRIO CRIADO (SEM A SENHA)
        // É uma boa prática de segurança nunca retornar o hash da senha
        const { passwordHash: _, ...userWithoutPassword } = user;

        return userWithoutPassword;
    }


    // Método para login
    async login({ email, password }: Omit<UserCreateData, 'name'>) {
        // 1. VERIFICAR SE O USUÁRIO EXISTE
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('E-mail ou senha inválidos.'); // Mensagem genérica por segurança
        }

        // 2. COMPARAR AS SENHAS
        const isPasswordCorrect = await compare(password, user.passwordHash);

        if (!isPasswordCorrect) {
            throw new Error('E-mail ou senha inválidos.');
        }

        // 3. GERAR O TOKEN JWT
        const token = sign(
            {
                // Informações que queremos guardar no token (payload)
                nome: user.name,
            },
            process.env.JWT_SECRET as string, // A senha secreta do .env
            {
                subject: user.id, // Identificador do usuário
                expiresIn: '1d',  // O token expira em 1 dia
            }
        );

        // 4. RETORNAR O TOKEN
        return { token };
    }
}