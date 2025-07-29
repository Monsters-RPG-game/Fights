import { describe, expect, it } from '@jest/globals';

describe('Sample', () => {
  describe('Should fail', () => {
    it('Should fail', async () => {
      expect(2+3).not.toEqual(4)
    });
  });

  describe('Should pass', () => {
    it('Should pass', async () => {
      expect(2+2).toEqual(4)
    });
  });
});
