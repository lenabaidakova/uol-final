"use client";

import {Home, User, ChartColumnIncreasing, Handshake, MessageCircle, ListChecks} from 'lucide-react';
import {Text} from '@radix-ui/themes';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu, SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
    SidebarFooter
} from '@/components/ui/sidebar';
import * as React from 'react';
import RouterLink from 'next/link';
import {useRole} from "@/providers/RoleProvider";
import {SidebarUser} from "@/app/ui/SidebarUser";

const shelterItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Requests',
    url: '/shelter/requests',
    icon: ListChecks,
  },
  {
    title: 'Unread messages',
    url: '/unread',
    icon: MessageCircle,
  },
];

const supporterItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Requests',
    url: '/supporter/requests',
    icon: ListChecks,
  },
  {
    title: 'Unread messages',
    url: '/unread',
    icon: MessageCircle,
  }
];

export default function AppSidebar() {
  const { role, setRole } = useRole();

  const isShelter = role === 'shelter';
  const items = isShelter ? shelterItems : supporterItems;

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
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>

                  {
                      item.title === 'Unread messages' && (
                          <SidebarMenuBadge>5</SidebarMenuBadge>
                      )
                  }
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {
          isShelter
              ? (<SidebarUser user={{name: 'Paws and Claws Shelter', avatar: 'https://robohash.org/XPL.png?set=set4', email: 'sarah@paws.com'}} />)
              : (<SidebarUser user={{name: 'Alex Johnson', avatar: 'https://robohash.org/aj.png?set=set4', email: 'alex@email.com'}} />)
        }

      </SidebarFooter>
    </Sidebar>
  );
}
