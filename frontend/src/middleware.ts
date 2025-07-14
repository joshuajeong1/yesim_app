import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();

    if(url.pathname.startsWith("/schedule") || url.pathname.startsWith("/monthly")) {
        const token = req.cookies.get("token")?.value;
        if(!token) {
            if (url.pathname === "/schedule" || url.pathname === "/monthly") {
                return NextResponse.next();
            }
            if(url.pathname.startsWith("/schedule")) {
                url.pathname = "/schedule";
            }
            else if(url.pathname.startsWith("/monthly")) {
                url.pathname = "/monthly"
            }
            return NextResponse.redirect(url);
        }
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            })

            if(!resp.ok) {
                throw new Error("Invalid token");
            }
            const data = await resp.json();
            if(!data.isAdmin) {
                if (url.pathname === "/schedule" || url.pathname === "/monthly") {
                return NextResponse.next();
                }
                if(url.pathname.startsWith("/schedule")) {
                    url.pathname = "/schedule";
                }
                else if(url.pathname.startsWith("/monthly")) {
                    url.pathname = "/monthly"
                }
                return NextResponse.redirect(url);
            }
            if (
                url.pathname === "/schedule/admin" ||
                url.pathname === "/monthly/admin"
            ) {
                return NextResponse.next();
            }

            if (url.pathname.startsWith("/schedule")) {
                url.pathname = "/schedule/admin";
            } else if (url.pathname.startsWith("/monthly")) {
                url.pathname = "/monthly/admin";
            }
            return NextResponse.redirect(url);
            
        }
        catch (error) {
            console.log("Authentication error:", error);
            if (url.pathname.startsWith("/schedule")) {
                url.pathname = "/schedule";
            } else if (url.pathname.startsWith("/monthly")) {
                url.pathname = "/monthly";
            }
            return NextResponse.redirect(url);
        }
    }
    if(url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/payperiod") || url.pathname.startsWith("/users")) {
        const token = req.cookies.get("token")?.value;
        console.log(token);
        if(!token) {
            console.log("No cookie found!")
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            })
            if(!resp.ok) {
                console.log("Token is invalid.");
                throw new Error("Invalid token");
            }
            const data = await resp.json();
            if(!data.isAdmin) {
                console.log("isAdmin false");
                return NextResponse.redirect(new URL("/login", req.url));
            }
            return NextResponse.next();
        }
        catch (error) {
            console.log(error);
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }
}