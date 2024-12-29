import React from 'react';
import { useForm } from 'react-hook-form';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { z } from 'zod';
import { Box, Flex, IconButton, Popover, Button } from '@radix-ui/themes';
import { Input } from '@/app/ui/Input';
import { ErrorApi } from '@/app/ui/ErrorApi';
import {
  UpdateUserNameData,
  useUpdateUserName,
} from '@/hooks/api/useUpdateUserName';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

const validationSchema = z.object({
  newName: z.string().max(32, 'Maximum 32 characters allowed'),
});

type AccountRenamePopupProps = {
  name: string;
  id: string;
};

export function AccountRenamePopup({ name, id }: AccountRenamePopupProps) {
  const { update } = useSession();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const {
    mutate: renameAccount,
    isMutating,
    error,
  } = useUpdateUserName({
    onSuccess: () => {
      setIsPopoverOpen(false);
      update();
    },
  });
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      newName: name,
    },
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = methods;

  const handleCreation = async (
    data: Pick<UpdateUserNameData, 'newName'>,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    renameAccount({ ...data, userId: id });
  };

  return (
    <>
      <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <Popover.Trigger>
          <IconButton
            size="1"
            title="Update account"
            variant="ghost"
            color="gold"
          >
            <Pencil1Icon />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content width="360px">
          <form onSubmit={handleSubmit(handleCreation)}>
            {!!error && (
              <Box mb="4">
                <ErrorApi error={error} />
              </Box>
            )}

            <Input
              errorMessage={errors.newName?.message}
              label="Name"
              placeholder="Enter new name"
              required
              {...register('newName')}
            />

            <Flex justify="end" mt="4">
              <Button variant="soft" type="submit" loading={isMutating}>
                Update name
              </Button>
            </Flex>
          </form>
        </Popover.Content>
      </Popover.Root>
    </>
  );
}
