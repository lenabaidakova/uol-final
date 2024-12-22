import React from 'react';
import { Callout as RadixCallout, Text } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

type CalloutProps = {
  children: React.ReactNode;
  color: 'tomato' | 'plum' | 'gray' | 'gold' | 'grass';
  variant?: 'soft' | 'outline';
  hideIcon?: boolean;
};

export function Callout({
  children,
  color,
  hideIcon,
  variant = 'soft',
}: CalloutProps) {
  return (
    <RadixCallout.Root color={color} size="1" variant={variant}>
      {!hideIcon && (
        <RadixCallout.Icon>
          <InfoCircledIcon />
        </RadixCallout.Icon>
      )}
      <Text as="div" size="2">
        {children}
      </Text>
    </RadixCallout.Root>
  );
}
