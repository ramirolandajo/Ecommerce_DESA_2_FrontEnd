import { describe, it, expect } from 'vitest';
import getMatchScore from '../getMatchScore.js';

describe('getMatchScore', () => {
  it('returns 0 for empty query', () => {
    expect(getMatchScore({ title: 'something' }, '')).toBe(0);
  });

  it('matches synonyms', () => {
    const score = getMatchScore({ title: 'telefono nuevo' }, 'celular');
    expect(score).toBe(3);
  });

  it('applies phone category boost', () => {
    const item = { title: 'telefono basico', categories: [{ name: 'smartphone' }] };
    const score = getMatchScore(item, 'celular');
    expect(score).toBe(6.5);
  });

  it('caps score at 12', () => {
    const item = {
      title: 'iphone 14 smartphone',
      brand: 'iphone',
      categories: [{ name: 'mobile smartphone' }],
    };
    const score = getMatchScore(item, 'iphone');
    expect(score).toBe(12);
  });
});
