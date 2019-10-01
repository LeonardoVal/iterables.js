/* globals describe expect it */
/* eslint-disable import/no-unresolved */
import { fromString, fromValues, Iterable } from '../../src/index';
import { expectList } from './tests-common';

describe('Lists of tuples:', () => {
  it('zip()', () => {
    expect(Iterable.prototype.zip).toBeOfType('function');
    expect(Iterable.zip).toBeOfType('function');
    const test = (testCase) => {
      const { lists } = testCase;
      expectList(Iterable.prototype.zip.apply(lists[0], lists.slice(1)),
        testCase.expectedResult);
      expectList(Iterable.zip(...lists), testCase.expectedResult);
    };
    test({
      lists: [fromString('abc'), fromString('xyz')],
      expectedResult: [['a', 'x'], ['b', 'y'], ['c', 'z']],
    });
    test({
      lists: [fromString('abc'), fromString('x')],
      expectedResult: [['a', 'x']],
    });
    test({
      lists: [fromString('a'), fromString('xyz')],
      expectedResult: [['a', 'x']],
    });
    test({
      lists: [fromString(''), fromString('xyz')],
      expectedResult: [],
    });
    test({
      lists: [fromString('abc'), fromString('')],
      expectedResult: [],
    });
  });

  it('zipWith()', () => {
    expect(Iterable.prototype.zipWith).toBeOfType('function');
    expect(Iterable.zipWith).toBeOfType('function');
    const test = (testCase) => {
      const { func, lists } = testCase;
      expectList(new Iterable(lists[0]).zipWith(func, ...lists.slice(1)),
        testCase.expectedResult);
      expectList(Iterable.zipWith(func, ...lists), testCase.expectedResult);
    };
    test({
      func: (vs) => vs[0] + vs[1],
      lists: [fromString('abc'), fromString('xyz')],
      expectedResult: ['ax', 'by', 'cz'],
    });
    test({
      func: (vs) => (+vs[0]) + (+vs[1]),
      lists: [fromString('123'), fromString('77')],
      expectedResult: [8, 9],
    });
    test({
      func: (vs) => (+vs[0]) + (+vs[1]),
      lists: [fromString('123'), fromString('')],
      expectedResult: [],
    });
    test({
      func: (vs) => [vs[2], vs[0], vs[1]],
      lists: [fromValues(1, 2, 3), fromString('abc'), fromValues(true, false, null)],
      expectedResult: [[true, 1, 'a'], [false, 2, 'b'], [null, 3, 'c']],
    });
  });

  it('product()', () => {
    expect(Iterable.prototype.product).toBeOfType('function');
    expect(Iterable.product).toBeOfType('function');
    const test = (testCase) => {
      const { lists } = testCase;
      expectList(new Iterable(lists[0]).product(...lists.slice(1)),
        testCase.expectedResult);
      expectList(Iterable.product(...lists), testCase.expectedResult);
    };
    test({
      lists: ['ab', 'xy'],
      expectedResult: [['a', 'x'], ['b', 'x'], ['a', 'y'], ['b', 'y']],
    });
    test({
      lists: ['ab', 'x'],
      expectedResult: [['a', 'x'], ['b', 'x']],
    });
    test({
      lists: ['a', 'xy'],
      expectedResult: [['a', 'x'], ['a', 'y']],
    });
    test({
      lists: ['ab', ''],
      expectedResult: [],
    });
    test({
      lists: ['', 'xy'],
      expectedResult: [],
    });
  });
}); // describe "Empty lists:"
