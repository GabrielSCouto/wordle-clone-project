// server/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const wordList = [
    'SAGAZ', 'AMAGO', 'MUITO', 'TERMO', 'AQUEM',
    'SONHO', 'LEVAR', 'CORTE', 'ROSTO', 'CHUVA',
    'FORCA', 'BRAVO', 'PODER', 'TEMPO', 'LIVRO',
    'PRAIA', 'NOITE', 'VENTO', 'FESTA', 'VERDE',
    'MUNDO', 'CALMA', 'BRISA', 'IDEIA', 'JOGAR'
];

async function main() {
    console.log('Iniciando o seeding...');
    for (const wordText of wordList) {
        await prisma.word.create({
            data: {
                text: wordText,
            },
        });
    }
    console.log('Seeding concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });