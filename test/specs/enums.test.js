/* eslint-disable import/no-unresolved */
import { EnumerationIterable } from '../../src/index';
import { expectList } from './tests-common';

describe('EnumerationIterable:', () => {
  it('`EnumerationIterable` class', () => {
    expect(EnumerationIterable).toBeOfType('function');
    const enumeration = new EnumerationIterable(7, 33, 9);
    expect(typeof enumeration.source).toBe('function');
    expect(enumeration.numFrom).toBe(7);
    expect(enumeration.numTo).toBe(33);
    expect(enumeration.step).toBe(9);
  });

  it('values', () => {
    expectList(new EnumerationIterable(0, 5, 1), [0, 1, 2, 3, 4]);
    expectList(new EnumerationIterable(0, 5, 1, true), [0, 1, 2, 3, 4, 5]);
    expectList(new EnumerationIterable(0, 5, 2), [0, 2, 4]);
    expectList(new EnumerationIterable(0, 5, 2, true), [0, 2, 4]);
    expectList(new EnumerationIterable(0, 0, 1), []);
    expectList(new EnumerationIterable(0, 0, 1, true), [0]);
    expectList(new EnumerationIterable(0, -1, 1), []);
    expectList(new EnumerationIterable(5, 0, 1), []);
    expectList(new EnumerationIterable(5, 0, -1), [5, 4, 3, 2, 1]);
    expectList(new EnumerationIterable(5, 0, -1, true), [5, 4, 3, 2, 1, 0]);
    expectList(new EnumerationIterable(5, 0, -2), [5, 3, 1]);
    expectList(new EnumerationIterable(0, 0.25, 0.1), [0, 0.1, 0.2]);
  });

  it('constructor defaults', () => {
    function expectEnumArgs(enumeration, numFrom, numTo, step) {
      expect(enumeration.numFrom).toBe(numFrom);
      expect(enumeration.numTo).toBe(numTo);
      expect(enumeration.step).toBe(step);
    }
    expectEnumArgs(new EnumerationIterable(), 0, +Infinity, 1);
    expectEnumArgs(new EnumerationIterable(2), 2, +Infinity, 1);
    expectEnumArgs(new EnumerationIterable(0, 2), 0, 2, +1);
    expectEnumArgs(new EnumerationIterable(2, 0), 2, 0, -1);
    expectEnumArgs(new EnumerationIterable(0, NaN, 3), 0, +Infinity, 3);
    expectEnumArgs(new EnumerationIterable(0, NaN, -3), 0, -Infinity, -3);
  });
}); // describe "Lists from arrays:"
