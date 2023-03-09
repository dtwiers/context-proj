export type Serializable<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

export const hydrateDates = <
  T,
  NonNullableKeys extends keyof {
    [K in keyof T]: T[K] extends Date ? string : never;
  },
  NullableKeys extends keyof {
    [K in keyof T]: T[K] extends Date | null
      ? T[K] extends Date
        ? never
        : string
      : never;
  }
>(
  input: Serializable<T>,
  ...keys: (NonNullableKeys | NullableKeys)[]
): Omit<T, NonNullableKeys | NullableKeys> & {
  [K in NullableKeys]: Date | null;
} & { [K in NonNullableKeys]: Date } => {
  const newValues = keys.reduce((obj, key) => {
    const value = input[key];
    return { ...obj, [key]: value ? new Date(value) : null };
  }, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { ...input, ...newValues } as any;
};
