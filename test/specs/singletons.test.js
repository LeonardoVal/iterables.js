/* globals describe expect it */
/* eslint-disable import/no-unresolved */
import { SingletonIterable } from '../../src/index';
import { expectList } from './tests-common';

describe('Singletons lists:', () => {
  it('`Iterable.singleton` function', () => {
    expect(SingletonIterable).toBeOfType('function');
    expectList(new SingletonIterable(Math.PI), [Math.PI]);
    expectList(new SingletonIterable(), [undefined]);
  });
}); // describe "Singletons lists:"
