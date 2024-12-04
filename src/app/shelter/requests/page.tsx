import MainLayout from "@/app/ui/MainLayout";
import PageHeader from "@/app/ui/PageHeader";
import {Box, Link} from "@radix-ui/themes";
import {Button} from "@/components/ui/button";
import {CirclePlus} from "lucide-react";
import RequestsTableShelter from "@/app/ui/RequestsTableShelter";

export default function Home() {
  return (
    <MainLayout>
        <PageHeader heading="Requests" columns="auto 1fr auto" actions={(
            <Button variant="secondary" asChild>
                <Link href="/request/create"><CirclePlus/> Create request</Link>
            </Button>
        )} />

        <Box maxWidth="1400px" m="auto" px="4">
            <RequestsTableShelter />
        </Box>
    </MainLayout>
  );
}
