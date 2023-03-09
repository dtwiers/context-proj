export const unknownToNullableNumber = (
  arg: unknown
): number | null | undefined => {
  if (arg === undefined || arg === null) {
    return arg as undefined | null;
  }
  return Number(arg);
};
