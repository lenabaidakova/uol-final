import React from 'react';
import { useId } from 'react-aria';
import b, { type Mods, type Mix } from 'bem-react-helper';
import { ErrorMessage } from '@/app/ui/ErrorMessage';
import { RequiredMark } from '@/app/ui/RequiredMark';
import { Select } from '@radix-ui/themes';
import { ReloadIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import './SelectField.css';

type SelectFieldProps = {
  mods?: Mods;
  mix?: Mix;
  label?: string;
  errorMessage?: string;
  id?: string;
  required?: boolean;
  value?: string;
  onChange: (value: string) => void;
  options: { id: string; label: string | React.ReactNode }[];
  placeholder?: string;
  isLoading?: boolean;
  dataTestId?: string;
  disabled?: boolean;
};

export const SelectField = (props: SelectFieldProps) => {
  const {
    label,
    errorMessage,
    id,
    required,
    value,
    onChange,
    options,
    placeholder,
    isLoading,
    dataTestId,
    disabled,
  } = props;
  const fieldId = useId();

  return (
    <div className={b('select-field', props)} data-testid={dataTestId}>
      {label && (
        <label className="select-field__label" htmlFor={id || fieldId}>
          <span>
            {label} {required && <RequiredMark />}
          </span>
        </label>
      )}
      {/* radix doesn't render placeholder if a value is empty string */}
      <Select.Root
        value={value || undefined}
        onValueChange={onChange}
        disabled={!!isLoading || disabled}
      >
        {/* use SelectPrimitive so it easier to adjust styles for loading state */}
        <SelectPrimitive.Trigger id={fieldId} asChild>
          <button
            data-accent-color="gray"
            className="rt-reset rt-SelectTrigger select-field__trigger rt-r-size-2 rt-variant-surface"
            data-testid={`${dataTestId}-selected`}
          >
            <span className="rt-SelectTriggerInner">
              {isLoading ? (
                <SelectPrimitive.Value placeholder="Loading...">
                  Loading...
                </SelectPrimitive.Value>
              ) : (
                <SelectPrimitive.Value placeholder={placeholder} />
              )}
            </span>
            <SelectPrimitive.Icon asChild>
              {/* <> need for radix so asChild works properly */}
              <>
                {isLoading ? (
                  <ReloadIcon
                    width="15"
                    height="15"
                    className="select-field__loading-icon"
                  />
                ) : (
                  <ChevronDownIcon className="rt-SelectIcon" />
                )}
              </>
            </SelectPrimitive.Icon>
          </button>
        </SelectPrimitive.Trigger>
        <Select.Content variant="soft">
          <Select.Group>
            {!options.length && <Select.Label>List empty</Select.Label>}
            {options.map((item) => (
              <Select.Item key={item.id} value={item.id}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      {errorMessage && (
        <div className="select-field__error">
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </div>
      )}
    </div>
  );
};

SelectField.displayName = 'SelectField';
