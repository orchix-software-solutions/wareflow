export type ID = string;

export type ISODateString = string;

export type Nullable<T> = T | null;

export type Maybe<T> = T | null | undefined;

export type Optional<T> = T | undefined;

export type Dictionary<T> = Record<string, T>;

export type UnknownRecord = Record<string, unknown>;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
