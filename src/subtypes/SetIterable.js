import { Iterable } from '../Iterable';

/** Class for representing sequences based on a `Set` instance.
 *
 * @augments Iterable
 */
// eslint-disable-next-line import/prefer-default-export
export class SetIterable extends Iterable {
  /** The constructor takes a `Set` instance as a source.
   *
   * @param {Map} set - The `Set` instance to be used as a source of the
   *   sequence.
   * @throws {TypeError} Raises an error if the given source is not a `Set`
   *   instance.
  */
  constructor(set) {
    if (!(set instanceof Set)) {
      throw new TypeError(
        `Argument must be a \`Set\`, but is a \`[${typeof set} ${set.constructor.name}]\`!`,
      );
    }
    super(set);
  }

  /** @inheritdoc */
  [Symbol.iterator]() {
    return this.source[Symbol.iterator]();
  }

  // Properties //////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  has(value, equality = null) {
    return equality ? super.has(value, equality) : this.source.has(value);
  }

  /** @inheritdoc */
  isEmpty() {
    return this.length === 0;
  }

  /** @inheritdoc */
  get length() {
    return this.source.size();
  }

  // Selections //////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  nub(equality = null) {
    if (!equality) {
      return new this.constructor(new Set(this.source));
    }
    return super.nub(equality);
  }
} // class SetIterable
