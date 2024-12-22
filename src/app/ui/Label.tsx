import React from 'react';
import { RequiredMark } from '@/app/ui/RequiredMark';

import './Label.css';

type LabelProps = {
  id: string;
  label?: string | React.ReactNode;
  required?: boolean;
  labelSuffix?: React.ReactNode;
};

export function Label({ id, label, required, labelSuffix }: LabelProps) {
  return (
    <label className="label" htmlFor={id}>
      <span>
        {label} {required && <RequiredMark />}
      </span>
      {labelSuffix}
    </label>
  );
}
