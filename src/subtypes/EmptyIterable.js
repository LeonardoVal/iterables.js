import { empty } from '../generators';
import { Iterable } from '../Iterable';

/** @ignore */
let singletonEmptyIterable;

/** Class for representing empty sequences efficiently.
 *
 * @augments Iterable
 */
export class EmptyIterable extends Iterable {
  /** The constructor actually returns a singleton, created the first time it
   * is called.
  */
  constructor() {
    if (singletonEmptyIterable) {
      return singletonEmptyIterable;
    }
    const source = empty;
    super(source);
    singletonEmptyIterable = this;
  }

  // Conversions /////////////////////////////////////////////////////////////////

  /** An empty sequence converts to an empty array.
  */
  toArray(array) {
    return (array || []);
  }

  /** An empty sequence converts to an empty set.
  */
  toSet(set = null) {
    return set || new Set();
  }

  // Properties //////////////////////////////////////////////////////////////////

  /** An empty sequence is always empty, by definition.
  */
  isEmpty() {
    return true;
  }

  /** An empty sequence is always zero, of course.
  */
  get length() {
    return 0;
  }

  // Reductions //////////////////////////////////////////////////////////////////

  /** All reductions of empty sequences result in the initial value.
  */
  reduce(foldFunction, initial) {
    return initial;
  }

  // Selections //////////////////////////////////////////////////////////////////

  /** Nothing can be got from an empty sequence. So `get` will always fail
   * unless.
   */
  get(index, defaultValue) {
    if (arguments.length < 2) {
      throw new Error(`Cannot get value at ${index}!`);
    } else {
      return defaultValue;
    }
  }
} // class EmptyIterable

export const EMPTY = new EmptyIterable();
