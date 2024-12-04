import MainLayout from "@/app/ui/MainLayout";
import PageHeader from "@/app/ui/PageHeader";
import {Box, Heading} from "@radix-ui/themes";
import RequestsTable from "@/app/ui/RequestsTable";

export default function Home() {
  return (
    <MainLayout>
        <PageHeader heading="Active requests" columns="auto 1fr" />

        <Box maxWidth="1400px" m="auto" px="4">
            <Box py="3">
                <Heading color="gray" size="4" weight="medium">Find and respond to shelter needs in your area</Heading>
            </Box>
            <RequestsTable />
        </Box>
    </MainLayout>
  );
}
