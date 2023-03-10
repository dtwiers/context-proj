export const delayMs = (millis: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, millis));
}