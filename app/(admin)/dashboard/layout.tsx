import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    return (
        <DashboardLayoutClient user={user}>
            {children}
        </DashboardLayoutClient>
    );
}
