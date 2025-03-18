import * as React from 'react';
import { AlertDialog } from '@/app/ui/AlertDialog';
import { useRequestUpdate } from '@/hooks/api/useRequestUpdate';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { Box, Button, Text } from '@radix-ui/themes';
import { REQUEST_STATUS } from '@/constants/Request';
import { useToast } from '@/hooks/use-toast';
import { useRequestCacheUpdate } from '@/hooks/api/useRequestCacheUpdate';

type ArchiveRequestProps = {
  requestId: string;
};

export default function TakeInProgress({ requestId }: ArchiveRequestProps) {
  const { updateStatus } = useRequestCacheUpdate();
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const {
    mutate: updateRequest,
    isMutating,
    error,
  } = useRequestUpdate({
    onSuccess: () => {
      updateStatus({ requestId, newStatus: REQUEST_STATUS.IN_PROGRESS });
      setIsAlertOpen(false);
      toast({
        title: 'Request taken successfully',
        description:
          "You're now in charge of this request. Check the details and coordinate your next steps!",
      });
    },
  });

  const handleRequestArchive = () => {
    updateRequest({ id: requestId, status: REQUEST_STATUS.IN_PROGRESS });
  };

  return (
    <>
      <AlertDialog
        color="ruby"
        title="Take this request in progress"
        onAction={handleRequestArchive}
        onCancel={() => setIsAlertOpen(false)}
        open={isAlertOpen}
        actionText="Yes, take it"
        cancelText="Cancel"
        loading={isMutating}
        trigger={
          <Button variant="soft" onClick={() => setIsAlertOpen(true)}>
            Take this request
          </Button>
        }
      >
        {!!error && (
          <Box mb="3">
            <ErrorApi error={error} />
          </Box>
        )}
        Once you confirm, this request will be assigned to you, and its status
        will change to <Text weight="medium">In progress</Text>.
      </AlertDialog>
    </>
  );
}
