/* eslint-disable import/no-unresolved */
import { fromArray, Iterable } from '../../src/index';
import { expectList } from './tests-common';

describe('Combinatorics:', () => {
  it('`Iterable.permutations` function', () => {
    expect(Iterable.prototype.permutations).toBeOfType('function');
    expectList(fromArray([0, 1, 2]).permutations(0), []);
    expectList(fromArray([0, 1, 2]).permutations(1), [[0], [1], [2]]);
    expectList(fromArray([0, 1, 2]).permutations(2),
      [[0, 1], [1, 0], [2, 0], [0, 2], [1, 2], [2, 1]]);
    expectList(fromArray([0, 1, 2]).permutations(3),
      [[0, 1, 2], [1, 0, 2], [2, 0, 1], [0, 2, 1], [1, 2, 0], [2, 1, 0]]);
    expectList(fromArray([0, 1, 2]).permutations(4), []);
  });

  it('`Iterable.combinations` function', () => {
    expect(Iterable.prototype.combinations).toBeOfType('function');
    expectList(fromArray([0, 1, 2]).combinations(0), [[]]);
    expectList(fromArray([0, 1, 2]).combinations(1), [[0], [1], [2]]);
    expectList(fromArray([0, 1, 2]).combinations(2), [[0, 1], [0, 2], [1, 2]]);
    expectList(fromArray([0, 1, 2]).combinations(3), [[0, 1, 2]]);
    expectList(fromArray([0, 1, 2]).combinations(4), []);
  });
}); // describe "Empty lists:"
