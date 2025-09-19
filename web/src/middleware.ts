import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes protégées qui nécessitent une authentification
const protectedRoutes = ['/dashboard']

// Routes d'authentification (rediriger si déjà connecté)
const authRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Récupérer les cookies
  const authCookie = request.cookies.get('kanban_auth')
  const refreshCookie = request.cookies.get('kanban_refresh')
  const rememberCookie = request.cookies.get('kanban_remember')
  
  // Vérifier si l'utilisateur a au moins un token valide (non vide)
  const hasAuthToken = (authCookie?.value && authCookie.value !== '') || 
                      (refreshCookie?.value && refreshCookie.value !== '') || 
                      (rememberCookie?.value && rememberCookie.value !== '')
  
  // Si route protégée et pas de token, rediriger vers login
  if (isProtectedRoute && !hasAuthToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Si route d'auth et déjà connecté, rediriger vers dashboard
  if (isAuthRoute && hasAuthToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
