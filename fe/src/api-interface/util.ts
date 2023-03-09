export const unknownToNullableNumber = (
  arg: unknown
): number | null | undefined => {
  if (arg === undefined || arg === null) {
    return arg;
  }
  return Number(arg);
};
