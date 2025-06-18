// server/src/services/userService.ts
import { hash } from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { UserCreateData, UserUpdateData } from '../types/userTypes';
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

        // 2. CRIPTOGRAFApassword
        // O segundo argumento é o "salt", a complexidade da criptografia. 8 é um bom valor.
        const passwordHash = await hash(password, 8);

        // 3. SALVAR NO BANCO DE DADOS
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash, // Salvamopassword criptografada
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
                name: user.name,
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

    async getUserProfile(userId: string) {
        // Busca o usuário e INCLUI todas as partidas e as palavras relacionadas
        const userProfile = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                matches: {
                    // Inclui a palavra de cada partida para podermos exibi-la
                    include: {
                        word: true,
                    },
                    // Ordena as partidas da mais recente para a mais antiga
                    orderBy: {
                        date: 'desc',
                    },
                },
            },
        });

        if (!userProfile) {
            throw new Error('Usuário não encontrado.');
        }

        // Vamos calcular algumas estatísticas aqui mesmo no back-end
        const totalMatches = userProfile.matches.length;
        const matchWins = userProfile.matches.filter(p => p.wins).length;
        const winRate = totalMatches > 0 ? (matchWins / totalMatches) * 100 : 0;

        // Removemos o hash da senha antes de enviar os dados
        const { passwordHash: _, ...profileData } = userProfile;

        return {
            ...profileData,
            stats: {
                totalMatches,
                matchWins,
                winRate: winRate.toFixed(2) + '%', // Formata como porcentagem
            }
        };
    }


    async updateUser(userId: string, data: UserUpdateData) {
        const { name, email, password } = data;

        // 1. VERIFICA SE O NOVO E-MAIL JÁ ESTÁ EM USO
        if (email) {
            const emailInUse = await prisma.user.findFirst({
                where: {
                    email: email,
                    id: {
                        not: userId,
                    },
                },
            });

            if (emailInUse) {
                throw new Error('Email já em uso.');
            }
        }

        // --- CORREÇÃO PRINCIPAL AQUI ---

        // 2. PREPARA O OBJETO DE ATUALIZAÇÃO PARA O PRISMA
        // Este objeto deve ter chaves que correspondem EXATAMENTE ao seu schema.prisma
        const dataToUpdate: {
            name?: string;
            email?: string;
            passwordHash?: string; // A chave aqui é passwordHash
        } = {};

        if (name) dataToUpdate.name = name;
        if (email) dataToUpdate.email = email;

        // 3. CRIPTOGRAFA A NOVA SENHA, SE ELA FOI FORNECIDA
        if (password && password.trim() !== '') {
            // Criptografa a senha em texto puro recebida no 'password'
            const hashedPassword = await hash(password, 8);
            // Atribui a senha JÁ CRIPTOGRAFADA à chave 'passwordHash'
            dataToUpdate.passwordHash = hashedPassword;
        }

        // 4. ATUALIZA O USUÁRIO NO BANCO COM O OBJETO CORRETO
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate, // Passa o objeto com as chaves corretas (name, email, passwordHash)
        });

        const { passwordHash: _, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
}