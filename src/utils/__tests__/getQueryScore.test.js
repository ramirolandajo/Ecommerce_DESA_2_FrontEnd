import { describe, it, expect } from 'vitest';
import { getQueryScore } from '../getQueryScore.js';

describe('getQueryScore', () => {
  it('returns 0 when base score is zero even if extra fields match', () => {
    const item = { eyebrow: 'laptop' };
    expect(getQueryScore(item, 'laptop')).toBe(0);
  });

  it('adds 0.5 bonus when query is found in extra fields', () => {
    const item = { title: 'laptopcase', description: 'laptop' };
    expect(getQueryScore(item, 'laptop')).toBe(8.5);
  });

  it('caps total score at 12 even with extra field bonus', () => {
    const item = {
      title: 'iphone 14 smartphone',
      brand: 'iphone',
      categories: [{ name: 'mobile smartphone' }],
      description: 'iphone',
    };
    expect(getQueryScore(item, 'iphone')).toBe(12);
  });
});
