import MainLayout from '@/app/ui/MainLayout';
import PageHeader from '@/app/ui/PageHeader';
import { Box, Link } from '@radix-ui/themes';
import UnreadMessagesTable from '@/app/ui/UnreadMessagesTable';

export default function Unread() {
  return (
    <MainLayout>
      <PageHeader heading="Unread messages" columns="auto 1fr" />

      <Box maxWidth="1400px" m="auto" px="4">
        <UnreadMessagesTable />
      </Box>
    </MainLayout>
  );
}
