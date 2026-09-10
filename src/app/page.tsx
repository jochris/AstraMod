import { getAllApps, getCategories } from '@/lib/db';
import CatalogClient from './CatalogClient';

export const revalidate = 0;

export default async function HomePage(props: {
  searchParams?: { search?: string; category?: string; type?: string; tab?: string };
}) {
  const searchParams = props?.searchParams;
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const type = typeof searchParams?.type === 'string' ? searchParams.type : undefined;
  const tab = typeof searchParams?.tab === 'string' ? searchParams.tab : undefined;

  let apps: any[] = [];
  let categories: { name: string; count: number }[] = [];

  try {
    apps = await getAllApps({ search, category, appType: type });
    categories = await getCategories();
  } catch (e) {
    console.error('Error fetching initial apps in page.tsx:', e);
  }

  return (
    <CatalogClient
      initialApps={apps}
      initialCategories={categories}
      searchParam={search}
      categoryParam={category}
      typeParam={type}
      tabParam={tab}
    />
  );
}
