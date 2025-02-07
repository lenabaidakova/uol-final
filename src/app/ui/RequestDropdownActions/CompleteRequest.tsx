import { Check } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { AlertDialog } from '@/app/ui/AlertDialog';
import { useRequestUpdate } from '@/hooks/api/useRequestUpdate';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { Box } from '@radix-ui/themes';
import { REQUEST_STATUS } from '@/constants/Request';
import { useToast } from '@/hooks/use-toast';
import { useRequestCacheUpdate } from '@/hooks/api/useRequestCacheUpdate';

type CompleteRequestProps = {
  requestId: string;
};

export default function CompleteRequest({ requestId }: CompleteRequestProps) {
  const { updateStatus } = useRequestCacheUpdate();
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const {
    mutate: updateRequest,
    isMutating,
    error,
  } = useRequestUpdate({
    onSuccess: () => {
      updateStatus({ requestId, newStatus: REQUEST_STATUS.COMPLETED });
      setIsAlertOpen(false);
      toast({
        title: 'Request completed',
        description:
          'The request is now closed. You can still view the details if needed.',
      });
    },
  });

  const handleRequestCompletion = () => {
    updateRequest({ id: requestId, status: REQUEST_STATUS.COMPLETED });
  };

  return (
    <>
      <AlertDialog
        color="ruby"
        title="Mark request as completed"
        onAction={handleRequestCompletion}
        onCancel={() => setIsAlertOpen(false)}
        open={isAlertOpen}
        actionText="Yes, complete request"
        cancelText="Cancel"
        loading={isMutating}
        trigger={
          <DropdownMenuItem
            onClick={() => setIsAlertOpen(true)}
            onSelect={(e) => e.preventDefault()}
          >
            <Check />
            Mark as completed
          </DropdownMenuItem>
        }
      >
        {!!error && (
          <Box mb="3">
            <ErrorApi error={error} />
          </Box>
        )}
        Are you sure you want to mark this request as completed?
      </AlertDialog>
    </>
  );
}
