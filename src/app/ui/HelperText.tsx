import React from 'react';
import b, { type Mods, type Mix } from 'bem-react-helper';
import './HelperText.css';

type HelperTextProps = {
  children: React.ReactNode;
  mods?: Mods;
  mix?: Mix;
};

export function HelperText(props: HelperTextProps) {
  return <div className={b('helper-text', props)}>{props.children}</div>;
}
