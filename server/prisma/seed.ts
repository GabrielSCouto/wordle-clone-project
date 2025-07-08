// server/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs'; 
import { join } from 'path';       

const prisma = new PrismaClient();

async function getWordsFromFile(): Promise<string[]> {
    const filePath = join(__dirname, 'wordlist.txt');

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');

        const words = fileContent
            .split(/\r?\n/)
            .map(word => word.trim().toUpperCase())
            .filter(word => word.length === 5 && word !== ''); 

        const uniqueWords = [...new Set(words)];

        return uniqueWords;

    } catch (error) {
        console.error('Erro ao ler o arquivo de palavras:', error);
        return [];
    }
}

async function main() {
    console.log('Iniciando o seeding...');

    await prisma.match.deleteMany({}); 
    console.log('Partidas antigas deletadas.');

    await prisma.word.deleteMany({}); 
    console.log('Palavras antigas deletadas.');

    const words = await getWordsFromFile();

    if (words.length === 0) {
        console.log('Nenhuma palavra encontrada no arquivo para adicionar ao banco. Encerrando o seed.');
        return;
    }

    for (const wordText of words) {
        await prisma.word.create({
            data: {
                text: wordText, 
            },
        });
    }

    console.log(`Seeding concluído com sucesso! ${words.length} palavras foram adicionadas.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });