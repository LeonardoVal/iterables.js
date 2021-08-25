/* globals describe expect xit */
/* eslint-disable import/no-unresolved */
import { Iterable } from '../../src/index';
import { expectAsyncList, expectAsyncIterator } from './tests-common';

describe('Asynchronous lists:', () => {
  xit('`Iterable.mockAsyncIterator` function', (done) => {
    expect(Iterable.mockAsyncIterator).toBeOfType('function');
    expectAsyncIterator(Iterable.mockAsyncIterator('abc'), ['a', 'b', 'c']).then(
      () => {
        const mockAsyncList = new Iterable(Iterable.mockAsyncIterator, 'xyz');
        return expectAsyncList(mockAsyncList, ['x', 'y', 'z']);
      },
    ).then(done, done);
  });
}); // describe "Empty lists:"
