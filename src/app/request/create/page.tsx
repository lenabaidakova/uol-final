import PageHeader from "@/app/ui/PageHeader";
import {Box, Heading} from "@radix-ui/themes";
import MainLayout from "@/app/ui/MainLayout";
import {NewRequestForm} from "@/app/request/create/ui/NewRequestForm";

export default function NewRequest() {
    return (
        <MainLayout>
            <PageHeader heading="New request" columns="auto 1fr" backLink="/shelter/requests" />

            <Box maxWidth="1400px" m="auto" px="4">
                <NewRequestForm />
            </Box>
        </MainLayout>
    )
}
