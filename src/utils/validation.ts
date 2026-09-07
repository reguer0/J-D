export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

export interface RegisterResult {
  ok: boolean;
  error?: string;
}

export interface LoginResult {
  ok: boolean;
  error?: string;
}