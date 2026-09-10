import { getAllApps, getCategories } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboardClient from './AdminDashboardClient';

export const revalidate = 0;

export default async function AdminPage() {
  const apps = getAllApps();
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <AdminDashboardClient initialApps={apps} categories={categories} />
      </main>

      <Footer />
    </div>
  );
}
