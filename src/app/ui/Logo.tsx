import { Text, Flex } from '@radix-ui/themes';
import { Handshake } from 'lucide-react';
import RouterLink from 'next/link';
import * as React from 'react';

export default function Logo() {
  return (
    <RouterLink href="/">
      <Flex gap="2" align="center">
        <div className="flex aspect-square size-7 items-center justify-center rounded-lg text-sidebar-primary-foreground">
          <Text color="gray">
            <Handshake size={20} />
          </Text>
        </div>
        <span className="font-bold text-l">Shelter connect</span>
      </Flex>
    </RouterLink>
  );
}
