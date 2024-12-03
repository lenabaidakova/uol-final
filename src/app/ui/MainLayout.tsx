import React from 'react';
import { cookies } from 'next/headers';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/app/ui/Sidebar';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full relative">{children}</main>
    </SidebarProvider>
  );
}
