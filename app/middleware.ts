import { NextRequest, NextResponse } from 'next/server'

type Environment = 'production' | 'development' | 'other'

export const middleware = (req: NextRequest) => {
  const currentEnv = process.env.NODE_ENV as Environment

  if (
    currentEnv === 'production' &&
    !req.headers?.get('x-forwarded-proto')?.includes('https')
  ) {
    const hostname = req.headers.get('host') || req.nextUrl.hostname
    return NextResponse.redirect(
      `https://${hostname}${req.nextUrl.pathname}`,
      301,
    )
  }
  return NextResponse.next()
}
