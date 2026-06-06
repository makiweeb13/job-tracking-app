import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export async function proxy(req: NextRequest) {
    const session = await getSession();
    const isDashboardRequest = req.nextUrl.pathname.startsWith("/dashboard");

    if (isDashboardRequest && !session?.user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    
    const isSignInRequest = req.nextUrl.pathname.startsWith("/login");
    const isSignUpRequest = req.nextUrl.pathname.startsWith("/sign-up");

    if ((isSignInRequest || isSignUpRequest) && session?.user) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    return NextResponse.next();
}