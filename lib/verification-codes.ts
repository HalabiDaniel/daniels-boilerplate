import { randomInt } from 'crypto';

// Temporary in-memory storage for verification codes
// In production, use Redis or a database
interface VerificationData {
  code: string;
  expiresAt: number;
}

// Use global to persist across hot reloads in development
const globalForCodes = globalThis as unknown as {
  verificationCodes: Map<string, VerificationData> | undefined;
};

class VerificationCodeStore {
  private codes: Map<string, VerificationData>;

  // Clean up expired codes periodically
  constructor() {
    // Reuse existing map if available (for hot reload persistence)
    this.codes = globalForCodes.verificationCodes ?? new Map<string, VerificationData>();
    globalForCodes.verificationCodes = this.codes;
    
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  set(userId: string, code: string, expiresInMs: number = 10 * 60 * 1000) {
    this.codes.set(userId, {
      code,
      expiresAt: Date.now() + expiresInMs,
    });
  }

  get(userId: string): VerificationData | undefined {
    const data = this.codes.get(userId);
    if (!data) return undefined;

    // Check if expired
    if (Date.now() > data.expiresAt) {
      this.codes.delete(userId);
      return undefined;
    }

    return data;
  }

  delete(userId: string) {
    this.codes.delete(userId);
  }

  verify(userId: string, code: string): boolean {
    const data = this.get(userId);
    if (!data) return false;
    return data.code.trim() === code.trim();
  }

  private cleanup() {
    const now = Date.now();
    for (const [userId, data] of this.codes.entries()) {
      if (now > data.expiresAt) {
        this.codes.delete(userId);
      }
    }
  }
}

// Export a singleton instance
export const verificationCodeStore = new VerificationCodeStore();

// Generate a cryptographically secure 6-digit code
export function generateVerificationCode(): string {
  return randomInt(100000, 1000000).toString();
}
