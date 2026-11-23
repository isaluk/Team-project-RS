import { describe, expect, it } from 'vitest';
import { formatPrice, parseDollars, pluralize } from './format';

describe('formatPrice', () => {
  it.each([
    [0, '$0.00'],
    [199, '$1.99'],
    [1500, '$15.00'],
    [13990, '$139.90'],
    [123456, '$1,234.56'],
  ])('форматирует %s центов как %s', (cents, expected) => {
    expect(formatPrice(cents)).toBe(expected);
  });
});

describe('parseDollars', () => {
  it.each([
    ['15', 1500],
    ['19.9', 1990],
    ['19,90', 1990],
    [' 100 ', 10000],
    ['0', 0],
  ])('читает "%s" как %s центов', (input, expected) => {
    expect(parseDollars(input)).toBe(expected);
  });

  it.each(['', '   ', 'abc', '-5'])('возвращает null для "%s"', (input) => {
    expect(parseDollars(input)).toBeNull();
  });
});

describe('pluralize', () => {
  const forms: [string, string, string] = ['зелье', 'зелья', 'зелий'];

  it.each([
    [1, 'зелье'],
    [2, 'зелья'],
    [4, 'зелья'],
    [5, 'зелий'],
    [0, 'зелий'],
    [11, 'зелий'],
    [14, 'зелий'],
    [21, 'зелье'],
    [22, 'зелья'],
    [112, 'зелий'],
  ])('%s → %s', (count, expected) => {
    expect(pluralize(count, forms)).toBe(expected);
  });
});
