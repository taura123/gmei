import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const c = await prisma.product.count();
    console.log('Total Products inserted in DB:', c);
    const some = await prisma.product.findMany({ take: 3 });
    console.log('Sample:', some.map(s => s.title));
}
run().finally(() => prisma.$disconnect());
