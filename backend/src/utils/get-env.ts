export const getEnv = (key: string, defaultValues?: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValues === undefined) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return defaultValues;
  }
  return value;
};
