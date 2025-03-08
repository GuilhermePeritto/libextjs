import { jwtDecode } from "jwt-decode"; // Biblioteca para decodificar tokens JWT
import { NextRequest, NextResponse } from "next/server";

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";
const REDIRECT_WHEN_AUTHENTICATED_ROUTE = "/";

const publicRoutes = [
    { path: "/login", whenAuthenticated: "redirect" },
    // { path: "/pricing", whenAuthenticated: "next" }, // Exemplo de rota pública acessível mesmo autenticado
] as const;

function isTokenValid(token: string): boolean {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp < currentTime) return false;

        return true;
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const publicRoute = publicRoutes.find((route) => route.path === path);
    const authToken = request.cookies.get("token")?.value;

    // Se a rota é pública e não há token, permita o acesso
    if (!authToken && publicRoute) {
        return NextResponse.next();
    }

    // Se não há token e a rota não é pública, redirecione para o login
    if (!authToken && !publicRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
        return NextResponse.redirect(redirectUrl);
    }

    // Se há token e a rota é pública com redirecionamento, redirecione para a página inicial
    if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED_ROUTE;
        return NextResponse.redirect(redirectUrl);
    }

    // Se há token e a rota não é pública, verifique se o token é válido
    if (authToken && !publicRoute) {
        const isValid = isTokenValid(authToken);

        if (!isValid) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

            const response = NextResponse.redirect(redirectUrl);
            response.cookies.delete("token"); // Remove o token inválido
            return response;
        }

        return NextResponse.next(); // Token válido, permita o acesso
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};