import React from 'react';
import {
  AlertDialog as AlertDialogRadix,
  Flex,
  Button,
  IconButton,
  ButtonProps,
} from '@radix-ui/themes';
import { Cross1Icon } from '@radix-ui/react-icons';

type BaseButtonOwnProps = ButtonProps;

type AlertDialogProps = {
  children: React.ReactNode;
  title?: string;
  trigger?: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction: () => void;
  onCancel: () => void;
  actionText: string;
  cancelText?: string;
  color?: BaseButtonOwnProps['color'];
  loading?: boolean;
  contentMaxWidth?: string;
  hideActionButton?: boolean;
};
export function AlertDialog(props: AlertDialogProps) {
  const {
    children,
    title,
    trigger,
    open,
    loading,
    onOpenChange,
    onAction,
    onCancel,
    actionText,
    cancelText = 'Cancel',
    color = 'grass',
    contentMaxWidth,
    hideActionButton,
  } = props;
  return (
    <AlertDialogRadix.Root open={open} onOpenChange={onOpenChange}>
      {!!trigger && (
        <AlertDialogRadix.Trigger>{trigger}</AlertDialogRadix.Trigger>
      )}
      <AlertDialogRadix.Content maxWidth={contentMaxWidth}>
        {!!title && (
          <AlertDialogRadix.Description className="hidden">
            {title}
          </AlertDialogRadix.Description>
        )}
        <Flex align="center" justify="between" gap="2" mb="4">
          <AlertDialogRadix.Title mb="0">{title}</AlertDialogRadix.Title>
          <AlertDialogRadix.Cancel>
            <IconButton
              variant="ghost"
              color="gray"
              onClick={onCancel}
              disabled={loading}
            >
              <Cross1Icon />
            </IconButton>
          </AlertDialogRadix.Cancel>
        </Flex>
        {children}
        <Flex gap="3" mt="5" justify="end">
          <AlertDialogRadix.Cancel>
            <Button
              variant="soft"
              color="gray"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
          </AlertDialogRadix.Cancel>

          {!hideActionButton && (
            <AlertDialogRadix.Action>
              <Button
                color={color}
                onClick={onAction}
                data-testid="dialog-action"
                loading={loading}
              >
                {actionText}
              </Button>
            </AlertDialogRadix.Action>
          )}
        </Flex>
      </AlertDialogRadix.Content>
    </AlertDialogRadix.Root>
  );
}
