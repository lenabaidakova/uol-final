'use client';
import React from 'react';
import { useId } from '@radix-ui/react-id';
import b, { type Mods, type Mix } from 'bem-react-helper';
import {
  TextField as RadixTextField,
  IconButton,
  Tooltip,
  Flex,
} from '@radix-ui/themes';
import {
  EyeClosedIcon,
  EyeOpenIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { ErrorMessage } from '@/app/ui/ErrorMessage';
import { HelperText } from '@/app/ui/HelperText';
import { Label } from '@/app/ui/Label';
import './Input.css';

type BaseTextFieldProps = RadixTextField.RootProps;

type TextFieldProps = {
  mods?: Mods;
  mix?: Mix;
  label?: string | React.ReactNode;
  errorMessage?: string | undefined | React.ReactNode;
  id?: string;
  required?: boolean;
  suffix?: React.ReactNode;
  labelSuffix?: React.ReactNode;
  helperText?: React.ReactNode | string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tooltip?: string;
};

type CombinedProps = TextFieldProps &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'defaultValue'
  > &
  BaseTextFieldProps & {
    type?: 'number' | 'text' | 'email' | 'password';
    value?: string | number;
  };

export const Input = React.forwardRef<HTMLInputElement, CombinedProps>(
  (props, ref) => {
    const {
      label,
      errorMessage,
      id,
      required,
      type,
      labelSuffix,
      mods,
      mix,
      helperText,
      leftSlot,
      rightSlot,
      tooltip,
      ...rest
    } = props;
    const fieldId = useId();
    const [eyeOpen, setEyeOpen] = React.useState(false);

    const handleEyeClick = (e: React.MouseEvent<HTMLElement>) => {
      // prevent form validation on button click
      e.preventDefault();
      setEyeOpen(!eyeOpen);
    };

    const isPassword = type === 'password';
    let fieldType = type || 'text';

    if (isPassword) {
      fieldType = eyeOpen ? 'text' : 'password';
    }

    return (
      <div className={b('input', { mods, mix })} data-testid="input">
        {label && (
          <Flex
            gap="2"
            align="center"
            mb="1"
            display="inline-flex"
            width="100%"
          >
            <Label
              id={id || fieldId}
              label={label}
              required={required}
              labelSuffix={labelSuffix}
            ></Label>

            {!!tooltip && (
              <Tooltip content={tooltip}>
                <InfoCircledIcon color="gray" />
              </Tooltip>
            )}
          </Flex>
        )}
        <RadixTextField.Root
          className="input__control"
          ref={ref}
          id={fieldId}
          {...rest}
          type={fieldType}
        >
          {leftSlot && <RadixTextField.Slot>{leftSlot}</RadixTextField.Slot>}

          {rightSlot && <RadixTextField.Slot>{rightSlot}</RadixTextField.Slot>}

          {isPassword && (
            <RadixTextField.Slot side="right">
              <IconButton
                size="1"
                variant="ghost"
                onClick={handleEyeClick}
                title={eyeOpen ? 'Hide password' : 'Show password'}
                type="button"
              >
                {eyeOpen ? (
                  <EyeOpenIcon height="14" width="14" />
                ) : (
                  <EyeClosedIcon height="14" width="14" />
                )}
              </IconButton>
            </RadixTextField.Slot>
          )}
        </RadixTextField.Root>
        {!!helperText && (
          <HelperText mix="input__helper-text">{helperText}</HelperText>
        )}

        {!!errorMessage && (
          <div className="input__error">
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
