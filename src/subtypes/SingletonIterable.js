import { singleton } from '../generators';
import { Iterable } from '../Iterable';

/** Class for representing sequences with only one value.
 *
 * @augments Iterable
 */
// eslint-disable-next-line import/prefer-default-export
export class SingletonIterable extends Iterable {
  /** The constructor takes the only value in the sequence.
   *
   * @param {any} value - The first and only value in the sequence.
  */
  constructor(value) {
    const source = singleton.bind(null, value);
    super(source);
    this.__value__ = value;
  }

  // Properties //////////////////////////////////////////////////////////////////

  /** A singleton iterable cannot be empty, by definition.
  */
  isEmpty() {
    return false;
  }

  /** The length of a singleton iterable is always 1, by definition.
  */
  get length() {
    return 1;
  }

  // Conversions /////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  toArray(array) {
    return (array || []).concat([this.__value__]);
  }
} // class SingletonIterable
