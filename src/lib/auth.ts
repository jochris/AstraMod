import { NextRequest } from 'next/server';

export function isAuthorizedAdmin(req: NextRequest): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'astramod2026';
  const cookieAuth = req.cookies.get('astramod_admin_auth')?.value;
  const headerAuth = req.headers.get('x-admin-password');

  return cookieAuth === expectedPassword || headerAuth === expectedPassword;
}
