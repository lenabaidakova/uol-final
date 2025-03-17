import { Trash } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { AlertDialog } from '@/app/ui/AlertDialog';
import { useRequestUpdate } from '@/hooks/api/useRequestUpdate';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { Box } from '@radix-ui/themes';
import { REQUEST_STATUS } from '@/constants/Request';
import { useToast } from '@/hooks/use-toast';
import { useRequestCacheUpdate } from '@/hooks/api/useRequestCacheUpdate';

type ArchiveRequestProps = {
  requestId: string;
};

export default function ArchiveRequest({ requestId }: ArchiveRequestProps) {
  const { updateStatus } = useRequestCacheUpdate();
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const {
    mutate: updateRequest,
    isMutating,
    error,
  } = useRequestUpdate({
    onSuccess: () => {
      updateStatus({ requestId, newStatus: REQUEST_STATUS.ARCHIVED });
      setIsAlertOpen(false);
      toast({
        title: 'Request archived',
        description: 'This request has been successfully moved to the archive.',
      });
    },
  });

  const handleRequestArchive = () => {
    updateRequest({ id: requestId, status: REQUEST_STATUS.ARCHIVED });
  };

  return (
    <>
      <AlertDialog
        color="ruby"
        title="Archive request"
        onAction={handleRequestArchive}
        onCancel={() => setIsAlertOpen(false)}
        open={isAlertOpen}
        actionText="Yes, archive request"
        cancelText="Cancel"
        loading={isMutating}
        trigger={
          <DropdownMenuItem
            onClick={() => setIsAlertOpen(true)}
            onSelect={(e) => e.preventDefault()}
          >
            <Trash /> Archive
          </DropdownMenuItem>
        }
      >
        {!!error && (
          <Box mb="3">
            <ErrorApi error={error} />
          </Box>
        )}
        Are you sure you want to archive this request?
      </AlertDialog>
    </>
  );
}
