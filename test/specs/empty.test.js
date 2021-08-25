/* eslint-disable import/no-unresolved */
import { Iterable, EmptyIterable } from '../../src/index';
import { expectList } from './tests-common';

describe('Empty lists:', () => {
  it('`EmptyIterable` class', () => {
    expect(EmptyIterable).toBeOfType('function');
    expect(EmptyIterable.prototype).toBeOfType(Iterable);
    expectList(new EmptyIterable(), []);
  });
}); // describe "Empty lists:"
