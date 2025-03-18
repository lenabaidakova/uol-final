import * as React from 'react';
import { Badge, Flex } from '@radix-ui/themes';
import { REQUEST_STATUS_LABELS, RequestStatusType } from '@/constants/Request';

type RequestStatusBadgeProps = {
  status: RequestStatusType;
  size?: '2' | '3';
};
export default function RequestStatusBadge({
  status,
  size = '3',
}: RequestStatusBadgeProps) {
  return (
    <Badge
      title={REQUEST_STATUS_LABELS[status].label}
      variant="outline"
      color={REQUEST_STATUS_LABELS[status].color}
      ml="3"
      size={size}
    >
      <Flex gap="2" align="center">
        {REQUEST_STATUS_LABELS[status].label}
      </Flex>
    </Badge>
  );
}
