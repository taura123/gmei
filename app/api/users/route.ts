import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET all users (exclude password)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await (prisma.user as any).findMany({
            orderBy: { createdAt: "desc" },
        });
        // Remove passwords from response
        const safeUsers = users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role || "Admin",
            image: u.image,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
        }));
        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error("GET /api/users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// CREATE new user
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "Super Admin") {
            return NextResponse.json({ error: "Unauthorized: Hanya Super Admin yang dapat menambah user." }, { status: 403 });
        }

        const body = await req.json();
        const { name, email, password, role, image } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Nama, email, dan password wajib diisi." }, { status: 400 });
        }

        // Check for duplicate email
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await (prisma.user as any).create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "Admin",
                image: image || null,
            },
        });

        // Log activity
        try {
            await (prisma as any).activity.create({
                data: {
                    action: "CREATE",
                    target: "USER",
                    details: `User baru "${user.name}" (${user.role || "Admin"}) telah ditambahkan.`,
                },
            });
        } catch (_) { }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "Admin",
            createdAt: user.createdAt,
        }, { status: 201 });
    } catch (error) {
        console.error("POST /api/users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// UPDATE user
export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "Super Admin") {
            return NextResponse.json({ error: "Unauthorized: Hanya Super Admin yang dapat mengubah data user." }, { status: 403 });
        }

        const body = await req.json();
        const { id, name, email, password, role, image } = body;

        if (!id) return NextResponse.json({ error: "ID wajib." }, { status: 400 });

        // Check for duplicate email (excluding current user)
        if (email) {
            const existing = await prisma.user.findFirst({
                where: { email, NOT: { id } },
            });
            if (existing) {
                return NextResponse.json({ error: "Email sudah digunakan oleh user lain." }, { status: 409 });
            }
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (image !== undefined) updateData.image = image;
        if (password) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const user = await (prisma.user as any).update({
            where: { id },
            data: updateData,
        });

        try {
            await (prisma as any).activity.create({
                data: {
                    action: "UPDATE",
                    target: "USER",
                    details: `User "${user.name}" (${user.role || "Admin"}) telah diperbarui.`,
                },
            });
        } catch (_) { }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "Admin",
        });
    } catch (error) {
        console.error("PUT /api/users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE user
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "Super Admin") {
            return NextResponse.json({ error: "Unauthorized: Hanya Super Admin yang dapat menghapus user." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID wajib." }, { status: 400 });

        const user = await (prisma.user as any).delete({
            where: { id },
        });

        try {
            await (prisma as any).activity.create({
                data: {
                    action: "DELETE",
                    target: "USER",
                    details: `User "${user.name}" (${user.role || "Admin"}) telah dihapus.`,
                },
            });
        } catch (_) { }

        return NextResponse.json({ message: "User deleted" });
    } catch (error) {
        console.error("DELETE /api/users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
