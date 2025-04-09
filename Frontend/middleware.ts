import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next(); // Required for middlewareClient
    const supabase = createMiddlewareClient({ req: request, res: response });

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
        const redirectUrl = new URL(request.nextUrl.origin);
        redirectUrl.pathname = "/login";
        redirectUrl.searchParams.set("error", "You must log in to access the AI Benchmarking Tool");

        return NextResponse.redirect(redirectUrl);
    }

    return response;
}

export const config = {
    matcher: ["/upload", "/result"]
};
