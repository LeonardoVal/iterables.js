/* globals describe expect it */
/* eslint-disable import/no-unresolved */
import { fromArray, Iterable } from '../../src/index';
import { expectList } from './tests-common';

describe('Lists indices:', () => {
  it('`Iterable.indexOf` function', () => {
    expect(Iterable.prototype.indexOf).toBeOfType('function');
    const array = [7, 'a', false, null];
    const arrayIterable = fromArray(array);
    array.forEach((value, index) => {
      expect(arrayIterable.indexOf(value)).toBe(index);
      expect(arrayIterable.indexOf(value, index + 1)).toBeLessThan(0);
    });
    expect(arrayIterable.indexOf(33)).toBeLessThan(0);
  });

  it('`Iterable.indicesOf` function', () => {
    expect(Iterable.prototype.indicesOf).toBeOfType('function');
    const array = [0, 1, 2, 3, 2, 4, 1, 0, 1, 3];
    const arrayIterable = fromArray(array);
    expectList(arrayIterable.indicesOf(0), [0, 7]);
    expectList(arrayIterable.indicesOf(1), [1, 6, 8]);
    expectList(arrayIterable.indicesOf(1, 2), [6, 8]);
    expectList(arrayIterable.indicesOf(1, 6), [6, 8]);
    expectList(arrayIterable.indicesOf(1, 7), [8]);
    expectList(arrayIterable.indicesOf(1, 8), [8]);
    expectList(arrayIterable.indicesOf(1, 10), []);
    expectList(arrayIterable.indicesOf(2), [2, 4]);
    expectList(arrayIterable.indicesOf(3), [3, 9]);
    expectList(arrayIterable.indicesOf(4), [5]);
    expectList(arrayIterable.indicesOf(4, 2), [5]);
    expectList(arrayIterable.indicesOf(4, 6), []);
    expectList(arrayIterable.indicesOf(5), []);
  });

  it('`Iterable.indexWhere` function', () => {
    expect(Iterable.prototype.indexWhere).toBeOfType('function');
    const array = [7, 'a', false, null];
    const arrayIterable = fromArray(array);
    array.forEach((value, index) => {
      expect(arrayIterable.indexWhere((v) => typeof v === typeof value))
        .toBe(index);
      expect(arrayIterable.indexWhere((v) => typeof v === typeof value, index + 1))
        .toBeLessThan(0);
    });
    expect(arrayIterable.indexWhere(() => false)).toBeLessThan(0);
  });
}); // describe "Lists indices:"
