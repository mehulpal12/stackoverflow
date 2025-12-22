import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getOrCreateDB from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storage.collection'
 
// This function can be marked `async` if using `await` inside
export default async function proxy(request: NextRequest) {
  await Promise.all([
    getOrCreateDB(),
    getOrCreateStorage()
  ])
    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
    // in matchers you have to mention those route on that this code is not working

  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
}