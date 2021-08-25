/* globals describe expect it */
/* eslint-disable import/no-unresolved */
import { Iterable } from '../../src/index';

describe('Core definitions:', () => {
  it('`Iterable` class', () => {
    expect(Iterable).toBeOfType('function');
    [
      'abc', [1, 2, 3], { x: 1, y: 2 },
    ].forEach((source) => {
      const iter = new Iterable(source);
      expect(iter.source).toBe(source);
    });
  });
}); // describe "Core definitions:"
