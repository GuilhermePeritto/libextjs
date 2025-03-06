import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

const REDIRECT_WHEN_AUTHENTICATED_ROUTE = '/'

const publicRoutes = [
    { path: '/login', whenAuthenticated: 'redirect', },
    /* { path: '/pricing', whenAuthenticated: 'next', }, exemplo em caso de querer que alguma rota publica seja acessada
    mesmo estando authenticado*/
] as const

function isTokenExpired(token: RequestCookie) {
    const [tokenValue, expiresAt] = token.value.split(':');
    if (!expiresAt) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return parseInt(expiresAt) < currentTime; 
}

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const publicRoute = publicRoutes.find(route => route.path === path);
    const authToken = request.cookies.get('token');

    if (!authToken && publicRoute) return NextResponse.next()

    if (!authToken && !publicRoute) {
        const redirectUrl = request.nextUrl.clone();

        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

        return NextResponse.redirect(redirectUrl);
    }

    if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
        const redirectUrl = request.nextUrl.clone();

        redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED_ROUTE;

        return NextResponse.redirect(redirectUrl);
    }

    if (authToken && !publicRoute) {

        if (isTokenExpired(authToken)) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/login';

            const response = NextResponse.redirect(redirectUrl);
            response.cookies.delete('token');
            return response;
        }

        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config: MiddlewareConfig = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}