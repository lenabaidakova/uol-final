import {Home, User, CirclePlus, ChartColumnIncreasing, Handshake} from 'lucide-react';
import {Text} from '@radix-ui/themes';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import * as React from 'react';
import RouterLink from 'next/link';

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Create request',
    url: '#',
    icon: CirclePlus,
  },
  {
    title: 'Dashboard',
    url: '#',
    icon: ChartColumnIncreasing,
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: User,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <RouterLink href="/">
                <>
                  <div className="flex aspect-square size-7 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                   <Text color="grass">
                     <Handshake size={20} />
                   </Text>
                  </div>
                  <span className="font-bold text-lg">Shelter connect</span>
                </>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
