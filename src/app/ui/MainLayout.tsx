import React from 'react';
import Cookies from 'js-cookie';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/app/ui/Sidebar';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultOpen = Cookies.get('sidebar:state') === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full relative">{children}</main>
    </SidebarProvider>
  );
}
