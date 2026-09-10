import { cookies } from 'next/headers';
import { getAllApps, getCategories } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboardClient from './AdminDashboardClient';
import AdminLoginForm from './AdminLoginForm';

export const revalidate = 0;

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('astramod_admin_auth');
  const expectedPassword = process.env.ADMIN_PASSWORD || 'astramod2026';
  const isAuthenticated = authCookie?.value === expectedPassword;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 pt-16 pb-16 flex items-center justify-center">
          <div className="w-full">
            <AdminLoginForm />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const apps = await getAllApps();
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <AdminDashboardClient initialApps={apps} categories={categories} />
      </main>

      <Footer />
    </div>
  );
}
