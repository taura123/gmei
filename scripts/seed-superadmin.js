const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const adminEmail = "superadmin@gramedia-mitra.co.id";
    const adminPlainPassword = "SuperAdmin123!";

    const adminPasswordHash = await bcrypt.hash(adminPlainPassword, 10);

    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            role: "Super Admin"
        },
        create: {
            name: "Super Administrator",
            email: adminEmail,
            password: adminPasswordHash,
            role: "Super Admin",
            image: null,
        },
    });

    console.log("Super Admin user created successfully.");
    console.log(`Email   : ${adminEmail}`);
    console.log(`Password: ${adminPlainPassword}`);
    console.log(`Role    : ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
