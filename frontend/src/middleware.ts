import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    if(url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/payperiod") || url.pathname.startsWith("/users")) {
        const token = req.cookies.get("token")?.value;

        if(!token) {
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        try {
            const resp = await fetch("http://localhost:8080/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({token}),
            })
            if(!resp.ok) {
                throw new Error("Invalid token");
            }
            const data = await resp.json();
            if(!data.isAdmin) {
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