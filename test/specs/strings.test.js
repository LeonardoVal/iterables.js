/* globals describe expect it */
/* eslint-disable import/no-unresolved */
import { fromString, Iterable, StringIterable } from '../../src/index';
import { expectList } from './tests-common';

describe('Lists from strings:', () => {
  it('`StringIterable` class', () => {
    expect(StringIterable).toBeOfType('function');
    expectList(new StringIterable(''), []);
    expectList(new StringIterable('a'), ['a']);
    expectList(new StringIterable('ab'), ['a', 'b']);
    expectList(new StringIterable('abc'), ['a', 'b', 'c']);
  });

  it('`Iterable.fromString` function', () => {
    expect(fromString).toBeOfType('function');
    expectList(fromString(''), []);
    expectList(fromString('a'), ['a']);
    expectList(fromString('ab'), ['a', 'b']);
    expectList(fromString('abc'), ['a', 'b', 'c']);
  });

  it('`Iterable.join` function', () => {
    expect(Iterable.prototype.join).toBeOfType('function');
    expect(fromString('').join()).toBe('');
    expect(fromString('').join(',')).toBe('');
    expect(fromString('a').join()).toBe('a');
    expect(fromString('a').join(',')).toBe('a');
    expect(fromString('ab').join()).toBe('ab');
    expect(fromString('ab').join(',')).toBe('a,b');
    expect(fromString('abc').join()).toBe('abc');
    expect(fromString('abc').join('|')).toBe('a|b|c');
  });
}); // describe "Lists from arrays:"
