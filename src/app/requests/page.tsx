'use client';

import MainLayout from '@/app/ui/MainLayout';
import PageHeader from '@/app/ui/PageHeader';
import { Box } from '@radix-ui/themes';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import RequestsTableShelter from '@/app/ui/RequestsTableShelter';
import { appRoutes } from '@/lib/appRoutes';
import RouterLink from 'next/link';

export default function Home() {
  return (
    <MainLayout>
      <PageHeader
        heading="Requests"
        columns="auto 1fr auto"
        actions={
          <Button variant="secondary" asChild>
            <RouterLink href={appRoutes.requestCreate()}>
              <CirclePlus /> Create request
            </RouterLink>
          </Button>
        }
      />

      <Box maxWidth="1400px" m="auto" px="4">
        <RequestsTableShelter />
      </Box>
    </MainLayout>
  );
}
