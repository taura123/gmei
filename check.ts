import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const p = await prisma.product.findMany({
        where: {
            title: { contains: 'GIOTTO', mode: 'insensitive' }
        },
        take: 3
    });
    p.forEach(prod => {
        console.log(`Title: ${prod.title}`);
        console.log(`Image: ${prod.image}`);
    });
}
run().finally(() => prisma.$disconnect());
