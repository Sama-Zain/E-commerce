import bcrypt from 'bcrypt';

export async function hash(
  plainText: string,
  salt = Number(process.env.SALT),
): Promise<string> {
  return await bcrypt.hash(plainText, salt);
}

export async function compare(
  plainText: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}
