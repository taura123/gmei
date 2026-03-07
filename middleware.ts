import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Here you can add custom logic if needed, 
        // essentially withAuth will check for the token before executing this
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*"], // Protect all routes under /dashboard
};
