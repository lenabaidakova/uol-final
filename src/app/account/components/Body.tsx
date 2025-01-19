'use client';

import React from 'react';
import { Flex, DataList, Card, Skeleton, Text, Box } from '@radix-ui/themes';
import { AccountRenamePopup } from './AccountRenamePopup';
import PageHeader from '@/app/ui/PageHeader';
import { useSession } from 'next-auth/react';

export default function AccountBody() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const email = session?.user?.email;
  const name = session?.user?.name;
  const id = session?.user?.id;

  return (
    <>
      <PageHeader
        heading="Account"
        columns="auto 1fr auto"
        // actions={<DatePickerWithRange />}
      />
      <Box maxWidth="1400px" m="auto" px="4">
        <Flex>
          <Card variant="surface" size="4">
            <DataList.Root size="2">
              <DataList.Item>
                <DataList.Label minWidth="80px">Name</DataList.Label>
                <DataList.Value>
                  <Flex align="center" gap="2">
                    <Skeleton loading={isLoading} minWidth="100px">
                      <Text>{name}</Text>
                    </Skeleton>
                    {!isLoading && name && id && (
                      <AccountRenamePopup name={name} id={id} />
                    )}
                  </Flex>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="80px">Email</DataList.Label>
                <DataList.Value>
                  <Flex align="center" gap="2">
                    <Skeleton loading={isLoading} minWidth="140px">
                      <Text>{email}</Text>
                    </Skeleton>
                    {/*{!isLoading && <AccountEmailUpdatePopup />}*/}
                  </Flex>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Card>
        </Flex>
      </Box>
    </>
  );
}
