import PageHeader from '@/app/ui/PageHeader';
import { Badge, Box, Flex } from '@radix-ui/themes';
import MainLayout from '@/app/ui/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChatCard } from '@/app/request/[:id]/ui/Chat';
import { DropdownActions } from '@/app/request/[:id]/ui/ui/DropdownActions';

export default function RequestView() {
  return (
    <MainLayout>
      <PageHeader
        heading="Request details"
        columns="auto 1fr auto"
        backLink="/shelter/requests"
        actions={<DropdownActions />}
      >
        <Badge color="orange">In progress</Badge>
      </PageHeader>

      <Box maxWidth="800px" m="auto" px="4">
        <div className="max-w-4xl mx-auto p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                <Flex gap="2" justify="between">
                  Cleaning supplies needed
                  <Badge color="tomato">High urgency</Badge>
                </Flex>
              </CardTitle>
              <CardDescription>
                <Flex gap="2" justify="between">
                  Paws and Claws Shelter, Central London
                  <Badge color="gray">Due 25th December 2024</Badge>
                </Flex>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                The shelter urgently needs cleaning supplies to maintain hygiene
                standards. Specific items required include mops, disinfectants,
                and trash bags. Donations can be dropped off at the shelter by
                this weekend.
              </p>
            </CardContent>
          </Card>

          <ChatCard />
        </div>
      </Box>
    </MainLayout>
  );
}
