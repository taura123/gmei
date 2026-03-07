import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `Tipe file tidak didukung (${file.type}). Gunakan PNG, JPG, WEBP, atau GIF.` },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_SIZE) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            return NextResponse.json(
                { error: `Ukuran file terlalu besar (${sizeMB}MB). Maksimum 5MB.` },
                { status: 400 }
            );
        }

        // Convert file to base64 format for Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString("base64");
        const fileUri = `data:${file.type};base64,${base64Data}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(fileUri, {
            folder: "gmei-uploads",
        });

        return NextResponse.json({ url: uploadResponse.secure_url });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Failed to upload file to Cloudinary" }, { status: 500 });
    }
}
