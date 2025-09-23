import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized({ req, token }) {
                const { pathname } = req.nextUrl;
                
                // Allow access to auth pages and API auth routes without authentication
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register" ||
                    pathname === "/forgot-password" ||
                    pathname === "/reset-password"
                ) {
                    return true;
                }

                // Protect all other routes - require authentication
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};