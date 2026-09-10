import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'astramod2026';

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: 'Password Admin Salah!' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true, message: 'Berhasil login admin!' });
    response.cookies.set('astramod_admin_auth', expectedPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
