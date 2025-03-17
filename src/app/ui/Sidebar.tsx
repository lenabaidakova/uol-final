'use client';

import {
  Home,
  Handshake,
  ListChecks,
  MessageSquare,
  MessageSquareDot,
} from 'lucide-react';
import { Text } from '@radix-ui/themes';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import * as React from 'react';
import RouterLink from 'next/link';
import { useUserData } from '@/providers/UserProvider';
import { SidebarUser } from '@/app/ui/SidebarUser';
import { ROLES } from '@/constants/Role';
import { appRoutes } from '@/lib/appRoutes';
import { useMessagesUnreadExist } from '@/hooks/api/useMessagesUnreadExist';
import './Sidebar.css';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Requests',
    url: appRoutes.requests(),
    icon: ListChecks,
  },
  {
    title: 'Unread messages',
    url: appRoutes.unread(),
    icon: MessageSquare,
  },
];

export default function AppSidebar() {
  const { data } = useMessagesUnreadExist();
  const { role } = useUserData();

  const isShelter = role === ROLES.SHELTER;

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
                    <Text color="gray">
                      <Handshake size={20} />
                    </Text>
                  </div>
                  <span className="font-bold text-l">Shelter connect</span>
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
                      {item.title === 'Unread messages' && data?.hasUnread ? (
                        <MessageSquareDot className="sidebar__unread-messages" />
                      ) : (
                        <item.icon />
                      )}

                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {isShelter ? (
          <SidebarUser
            user={{
              name: 'Paws and Claws Shelter',
              avatar: 'https://robohash.org/XPL.png?set=set4',
              email: 'sarah@paws.com',
            }}
          />
        ) : (
          <SidebarUser
            user={{
              name: 'Alex Johnson',
              avatar: 'https://robohash.org/aj.png?set=set4',
              email: 'alex@email.com',
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
