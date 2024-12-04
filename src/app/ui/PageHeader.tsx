import { Flex, Heading, IconButton, Grid } from '@radix-ui/themes';
import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
import RouterLink from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

type PageHeaderProps = {
  heading?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  backLink?: string;
  maxWidth?: string;
  columns?: string;
};

export default function PageHeader({
  actions,
  heading,
  backLink,
  children,
  columns,
}: PageHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <Grid p="2" columns={columns} align="center">
          <SidebarTrigger className="mr-2" />
          {(children || heading) && (
            <Flex gap="3" align="center" justify="start">
              {!!backLink && (
                <IconButton color="gray" variant="ghost" asChild>
                  <RouterLink href={backLink}>
                    <ArrowLeftIcon size={16} />
                  </RouterLink>
                </IconButton>
              )}
              {!!heading && <Heading size="4">{heading}</Heading>}
              {children}
            </Flex>
          )}
          <Flex align="center" justify="end">
            {actions}
          </Flex>
        </Grid>
      </header>
    </>
  );
}
