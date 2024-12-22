import React from 'react';
import b, { type Mods, type Mix } from 'bem-react-helper';
import './ErrorMessage.css';

type ErrorMessageProps = {
  mods?: Mods;
  mix?: Mix;
  children?: React.ReactNode;
};

export function ErrorMessage(props: ErrorMessageProps) {
  return <div className={b('error-message', props)}>{props.children}</div>;
}
