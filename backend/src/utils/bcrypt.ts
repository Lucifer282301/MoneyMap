import bcrypt from "bcrypt";

// Generate a bcrypt hash for secure storage
export const hashValue = async (value: string, saltRounds: number = 10) =>
  await bcrypt.hash(value, saltRounds);

// Compare a plain value with its bcrypt hash
export const compareValue = async (value: string, hashedValue: string) =>
  await bcrypt.compare(value, hashedValue);
