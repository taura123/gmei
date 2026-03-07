import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SyncService } from "@/lib/sync-service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Automatically sync products when requested for the first time
        await SyncService.syncProducts();

        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userName = session?.user?.name || "Admin";

        const body = await req.json();
        const { title, description, price, image, category, subcategory, link } = body;

        const product = await prisma.product.create({
            data: {
                title,
                description,
                price: price ? parseFloat(price) : null,
                image,
                category,
                subcategory,
                link
            }
        });

        // Log activity
        await prisma.activity.create({
            data: {
                action: "CREATE",
                target: "PRODUCT",
                details: `[${userName}] Menambahkan produk baru: "${product.title}".`
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userName = session?.user?.name || "Admin";

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const product = await prisma.product.delete({
            where: { id }
        });

        // Log activity
        await prisma.activity.create({
            data: {
                action: "DELETE",
                target: "PRODUCT",
                details: `[${userName}] Menghapus produk: "${product.title}".`
            }
        });

        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userName = session?.user?.name || "Admin";

        const body = await req.json();
        const { id, title, description, price, image, category, subcategory, link } = body;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        // Get old data for audit trail
        const oldProduct = await prisma.product.findUnique({ where: { id } });

        const product = await prisma.product.update({
            where: { id },
            data: {
                title,
                description,
                price: price ? parseFloat(price) : null,
                image,
                category,
                subcategory,
                link
            }
        });

        // Determine detailed log
        let details = `[${userName}] Memperbarui produk: "${product.title}".`;

        if (oldProduct && oldProduct.price !== product.price) {
            const oldPrice = oldProduct.price ? Number(oldProduct.price).toLocaleString('id-ID') : "0";
            const newPrice = product.price ? Number(product.price).toLocaleString('id-ID') : "0";
            details += ` (Perubahan Harga: Rp ${oldPrice} -> Rp ${newPrice})`;
        }

        // Log activity
        await prisma.activity.create({
            data: {
                action: "UPDATE",
                target: "PRODUCT",
                details: details
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
