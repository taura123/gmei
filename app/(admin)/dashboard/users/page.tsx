import UsersClient from "./UsersClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const session = await getServerSession(authOptions);
    const currentUserRole = session?.user ? (session.user as any).role : "Admin";
    const currentUserEmail = session?.user?.email || "";

    return <UsersClient currentUserRole={currentUserRole} currentUserEmail={currentUserEmail} />;
}
