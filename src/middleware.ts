/* custom middleware form */
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/about" ,"/task","/same"]
}