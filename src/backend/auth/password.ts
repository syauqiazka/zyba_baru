import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 12; // Sesuai AGENTS.md D11: bcrypt cost 12

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

