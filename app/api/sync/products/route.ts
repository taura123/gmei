import { NextResponse } from "next/server";
import { SyncService } from "@/lib/sync-service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// POST /api/sync/products — Triggers a full SIPLah product scrape & sync
export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("[API] Manual product sync triggered");
        await SyncService.syncProducts(true);
        return NextResponse.json({
            success: true,
            message: "Sinkronisasi produk berhasil dimulai. Produk baru akan muncul segera."
        });
    } catch (error) {
        console.error("[API] Product sync error:", error);
        return NextResponse.json({
            success: false,
            error: "Gagal melakukan sinkronisasi produk."
        }, { status: 500 });
    }
}
