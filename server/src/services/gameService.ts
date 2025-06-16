// server/src/services/gameService.ts
import { prisma } from '../lib/prisma';

interface SaveResultData {
    wins: boolean;
    attempts: number;
    wordText: string;
    userId: string;
}

export class GameService {
    async getGameWord() {
        const wordCount = await prisma.word.count();
        const skip = Math.floor(Math.random() * wordCount);
        const randomWord = await prisma.word.findFirst({
            skip: skip,
        });
        return { word: randomWord?.text };
    }

    async saveResult({ wins, attempts, wordText, userId }: SaveResultData) {
        const word = await prisma.word.findUnique({
            where: { text: wordText },
        });

        if (!word) {
            throw new Error('Palavra jogada não encontrada no banco.');
        }

        const newMatch = await prisma.match.create({
            data: {
                wins,
                attempts,
                userId: userId,
                wordId: word.id,
            },
        });

        return newMatch;
    }
}