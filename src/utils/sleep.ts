export const sleep = async (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs))
