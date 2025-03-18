import PageHeader from '@/app/ui/PageHeader';
import { Box } from '@radix-ui/themes';
import MainLayout from '@/app/ui/MainLayout';
import { EditRequestBody } from './ui/EditRequestBody';

export default function NewRequest() {
  return (
    <MainLayout>
      <PageHeader heading="Update request" columns="auto 1fr" backLink={true} />

      <Box maxWidth="600px" m="auto" px="4">
        <EditRequestBody />
      </Box>
    </MainLayout>
  );
}
