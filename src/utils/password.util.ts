import bcrypt from 'bcryptjs';

const BCRYPT_COST_FACTOR = 12;

// Top 100 most common passwords (subset of well-known breach corpora, lowercased).
export const COMMON_PASSWORDS: ReadonlySet<string> = new Set(
  [
    '123456', '123456789', 'qwerty', 'password', '12345', '12345678',
    '111111', '1234567', 'sunshine', 'qwerty123', 'iloveyou', '000000',
    '1q2w3e4r5t', '123123', 'abc123', '1234567890', 'dragon', 'football',
    'letmein', 'monkey', '696969', 'shadow', 'master', '666666', 'qwertyuiop',
    '123321', 'mustang', '1234567891', '654321', 'superman', '1qaz2wsx',
    '7777777', 'fuckyou', '121212', 'qazwsx', '123qwe', 'killer',
    'trustno1', 'jordan', 'jennifer', 'zxcvbnm', 'asdfgh', 'hunter', 'buster',
    'soccer', 'harley', 'batman', 'andrew', 'tigger', 'sunshine1', 'iloveu',
    '2000', 'charlie', 'robert', 'thomas', 'hockey', 'ranger', 'daniel',
    'starwars', 'klaster', '112233', 'george', 'computer', 'michelle',
    'jessica', 'pepper', '1111', '11111111', '1qaz2wsx3edc', 'freedom',
    'whatever', 'nicole', 'jackson', 'cameron', 'secret', 'summer', 'internet',
    'blahblah', 'password1', 'passw0rd', 'p@ssw0rd', 'p@ssword', 'admin123',
    'welcome', 'welcome1', 'login', 'princess', 'flower', 'hottie',
    'loveme', 'chocolate', 'ashley', 'michael', 'ninja', 'mustang1',
    'access', 'yankees', 'baseball', 'lovely', 'monkey1', 'qwerty1',
    'football1', 'dragon1', 'shadow1', 'baseball1',
  ].map((p) => p.toLowerCase()),
);

export const PASSWORD_SPECIAL_CHAR_REGEX = /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/;

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase());
}

/**
 * True if the password embeds the caller's email local-part or name — the
 * two most-guessable secrets an attacker with a leaked email would try first.
 */
export function containsProfileInfo(
  password: string,
  profile: { email: string; name: string },
): boolean {
  const lowerPassword = password.toLowerCase();

  const localPart = profile.email.split('@')[0]?.toLowerCase() ?? '';
  if (localPart.length >= 3 && lowerPassword.includes(localPart)) {
    return true;
  }

  const nameParts = profile.name
    .toLowerCase()
    .split(/\s+/)
    .filter((part) => part.length >= 3);
  return nameParts.some((part) => lowerPassword.includes(part));
}

export async function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, BCRYPT_COST_FACTOR);
}

export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
