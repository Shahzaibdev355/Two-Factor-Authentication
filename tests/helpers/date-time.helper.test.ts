import {
  generateMinutesSeconds,
  generateMinutesMilliSeconds,
  generateDaysSeconds,
  generateDaysMilliSeconds
} from '@/helpers/date-time.helper';

describe('Date Time Helper', () => {
  describe('generateMinutesSeconds', () => {
    it('should convert minutes to seconds correctly', () => {
      expect(generateMinutesSeconds(1)).toBe(60);
      expect(generateMinutesSeconds(5)).toBe(300);
      expect(generateMinutesSeconds(10)).toBe(600);
      expect(generateMinutesSeconds(0)).toBe(0);
    });
  });

  describe('generateMinutesMilliSeconds', () => {
    it('should convert minutes to milliseconds correctly', () => {
      expect(generateMinutesMilliSeconds(1)).toBe(60000);
      expect(generateMinutesMilliSeconds(5)).toBe(300000);
      expect(generateMinutesMilliSeconds(10)).toBe(600000);
      expect(generateMinutesMilliSeconds(0)).toBe(0);
    });
  });

  describe('generateDaysSeconds', () => {
    it('should convert days to seconds correctly', () => {
      expect(generateDaysSeconds(1)).toBe(86400); // 24 * 60 * 60
      expect(generateDaysSeconds(7)).toBe(604800); // 7 days
      expect(generateDaysSeconds(0)).toBe(0);
    });
  });

  describe('generateDaysMilliSeconds', () => {
    it('should convert days to milliseconds correctly', () => {
      expect(generateDaysMilliSeconds(1)).toBe(3600000); // 60 * 60 * 1000
      expect(generateDaysMilliSeconds(7)).toBe(25200000); // 7 days
      expect(generateDaysMilliSeconds(0)).toBe(0);
    });

    it('should handle fractional days', () => {
      expect(generateDaysMilliSeconds(0.5)).toBe(1800000); // Half day
    });
  });
});