import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Berhasil logout admin!' });
  response.cookies.delete('astramod_admin_auth');
  return response;
}
