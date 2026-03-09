import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const p = await prisma.product.findMany({ take: 5, orderBy: { title: 'desc' } });
    console.log('Sample Titles:', p.map(x => x.title));
}
run().finally(() => prisma.$disconnect());
