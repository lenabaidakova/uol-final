export type StringObject = {
  [key: string]: string;
};

export type BooleanObject = {
  [key: string]: boolean;
};

export type ObjectValues<T> = T[keyof T];

export type EmptyObject = Record<string, never>;
