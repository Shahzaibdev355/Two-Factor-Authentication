import { hashValue, compareValues } from '@/helpers/encryption.helper';

describe('Encryption Helper', () => {
  describe('hashValue', () => {
    it('should hash a password successfully', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashValue(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashValue(password);
      const hash2 = await hashValue(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compareValues', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashValue(password);
      
      const isMatch = await compareValues(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await hashValue(password);
      
      const isMatch = await compareValues(wrongPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });

    it('should handle empty strings correctly', async () => {
      const emptyPassword = '';
      const hashedPassword = await hashValue(emptyPassword);
      
      const isMatch = await compareValues(emptyPassword, hashedPassword);
      expect(isMatch).toBe(true);
    });
  });
});