import PageHeader from '@/app/ui/PageHeader';
import { Box } from '@radix-ui/themes';
import MainLayout from '@/app/ui/MainLayout';
import { NewRequestBody } from '@/app/request/create/ui/NewRequestBody';

export default function NewRequest() {
  return (
    <MainLayout>
      <PageHeader heading="New request" columns="auto 1fr" backLink={true} />

      <Box maxWidth="600px" m="auto" px="4">
        <NewRequestBody />
      </Box>
    </MainLayout>
  );
}
