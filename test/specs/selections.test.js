/* eslint-disable import/no-unresolved */
import { fromArray, Iterable } from '../../src/index';
import { expectList } from './tests-common';

describe('Lists selections:', () => {
  it('`Iterable.filter` function', () => {
    expect(Iterable.prototype.filter).toBeOfType('function');
    expectList(fromArray([false, true, false]).filter(), [true]);
    expectList(fromArray([0, 1, 2]).filter(), [1, 2]);
    expectList(fromArray(['', 'a', 'aa', 'aaa']).filter(), ['a', 'aa', 'aaa']);
    expectList(fromArray(['', 0, null, false]).filter(), []);
    expectList(fromArray([0, 1, 2, 3, 4]).filter((n) => n % 2), [1, 3]);
    expectList(fromArray([0, 1, 2, 3, 4]).filter((n) => n > 2), [3, 4]);
    expectList(fromArray(['', 'a', 'aa', 'aaa']).filter((x) => x.length % 2), ['a', 'aaa']);
  });

  it('`Iterable.takeWhile` function', () => {
    const notFunc = (n) => !n;
    expect(Iterable.prototype.takeWhile).toBeOfType('function');
    expectList(fromArray([0, 1, 0, 1, 0, 1]).takeWhile(), []);
    expectList(fromArray([1, 1, 0, 1, 0, 1]).takeWhile(), [1, 1]);
    expectList(fromArray([0, 1, 0, 1, 0, 1]).takeWhile(notFunc), [0]);
    expectList(fromArray([0, 0, 0, 1, 0, 1]).takeWhile(notFunc), [0, 0, 0]);
  });

  it('`Iterable.take` function', () => {
    expect(Iterable.prototype.take).toBeOfType('function');
    const array = [0, 1, 2, 3, 4, 5];
    for (let i = 0; i <= array.length; i += 1) {
      expectList(fromArray(array).take(i), array.slice(0, i));
    }
  });

  it('`Iterable.head` function', () => {
    expect(Iterable.prototype.head).toBeOfType('function');
    expect(fromArray([false, true, false]).head()).toBe(false);
    expect(fromArray([0, 1, 2]).head()).toBe(0);
    expect(fromArray([77, 7]).head()).toBe(77);
    expect(fromArray(['a']).head()).toBe('a');
    expect(Iterable.prototype.head.bind(fromArray([]))).toThrow();
    expect(fromArray([]).head(null)).toBe(null);
  });

  it('`Iterable.dropWhile` function', () => {
    const notFunc = (n) => !n;
    expect(Iterable.prototype.dropWhile).toBeOfType('function');
    expectList(fromArray([0, 1, 0]).dropWhile(), [0, 1, 0]);
    expectList(fromArray([0, 1, 0]).dropWhile(notFunc), [1, 0]);
    expectList(fromArray([1, 1, 0, 1, 0, 1]).dropWhile(), [0, 1, 0, 1]);
    expectList(fromArray([0, 0, 0, 1, 0, 1]).dropWhile(notFunc), [1, 0, 1]);
  });

  it('`Iterable.drop` function', () => {
    expect(Iterable.prototype.drop).toBeOfType('function');
    const array = [0, 1, 2, 3, 4, 5];
    for (let i = 0; i <= array.length; i += 1) {
      expectList(fromArray(array).drop(i), array.slice(i));
    }
  });
}); // describe "Lists from arrays:"
