/* globals describe expect it */
/* eslint-disable import/no-unresolved */
import { fromObject, fromValues, Iterable } from '../../src/index';
import { expectList } from './tests-common';

describe('Lists from objects:', () => {
  it('`fromObject` function', () => {
    expect(fromObject).toBeOfType('function');
    expectList(fromObject({}), []);
    expectList(fromObject({ true: true }), [['true', true]]);
    expectList(fromObject({ x: 1, y: 2 }, true), [['x', 1], ['y', 2]]);
    expectList(fromObject({ a: 'a', b: 'b', c: 'c' }, true),
      [['a', 'a'], ['b', 'b'], ['c', 'c']]);
  });

  it('`Iterable.toObject` function', () => {
    expect(Iterable.prototype.toObject).toBeOfType('function');
    expect(fromValues().toObject())
      .toEqual({});
    expect(fromValues(['t', true]).toObject())
      .toEqual({ t: true });
    expect(fromValues(['one', 1], ['two', 2]).toObject())
      .toEqual({ one: 1, two: 2 });
    expect(fromValues(['f1', 'a'], ['f2', 'b'], ['f3', 'c']).toObject())
      .toEqual({ f1: 'a', f2: 'b', f3: 'c' });
  });
}); // describe "Lists from objects:"
