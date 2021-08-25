/* globals describe expect it */
/* eslint-disable import/no-unresolved */
import { ArrayIterable, fromArray, fromValues, Iterable } from '../../src/index';
import { expectList } from './tests-common';

describe('Lists from arrays:', () => {
  it('`ArrayIterable` class', () => {
    expect(ArrayIterable).toBeOfType('function');
    expectList(new ArrayIterable([]), []);
    expectList(new ArrayIterable([true]), [true]);
    expectList(new ArrayIterable([1, 2]), [1, 2]);
    expectList(new ArrayIterable(['a', 'b', 'c']), ['a', 'b', 'c']);
  });

  it('`Iterable.fromArray` function', () => {
    expect(fromArray).toBeOfType('function');
    expectList(fromArray([]), []);
    expectList(fromArray([true]), [true]);
    expectList(fromArray([1, 2]), [1, 2]);
    expectList(fromArray(['a', 'b', 'c']), ['a', 'b', 'c']);
  });

  it('`Iterable.fromValues` function', () => {
    expect(fromValues).toBeOfType('function');
    expectList(fromValues(), []);
    expectList(fromValues(true), [true]);
    expectList(fromValues(1, 2), [1, 2]);
    expectList(fromValues('a', 'b', 'c'), ['a', 'b', 'c']);
  });

  it('`Iterable.toArray` function', () => {
    expect(Iterable.prototype.toArray).toBeOfType('function');
    expect(fromValues().toArray()).toEqual([]);
    expect(fromValues(true).toArray()).toEqual([true]);
    expect(fromValues(1, 2).toArray()).toEqual([1, 2]);
    expect(fromValues('a', 'b', 'c').toArray()).toEqual(['a', 'b', 'c']);
  });
}); // describe "Lists from arrays:"
