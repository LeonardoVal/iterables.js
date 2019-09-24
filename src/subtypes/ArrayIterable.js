import Iterable from '../Iterable';

/** Class for representing sequences based on an array, as a whole or in part.
 *
 * @augments Iterable
 */
export class ArrayIterable extends Iterable {
  /** The constructor takes an array as a source, and optionally the indices
   * of a slice of it.
   *
   * @param {array} array - The array to be used as a source of the sequence.
   * @param {integer} [indexFrom=0] - The starting index of the slice of the
   *   array to be used.
   * @param {integer} [indexTo=+Infinity] - The ending index of the slice of
   *   the array to be used.
   * @throws {TypeError} Raises an error if the given source is not an array.
  */
  constructor(array, indexFrom = 0, indexTo = Infinity) {
    if (!Array.isArray(array)) {
      throw new TypeError(`Argument must be an array, but is a \`${typeof array}\`!`);
    }
    super(array);
    this.__indexFrom__ = Number.isNaN(indexFrom) ? 0 : Math.max(0, +indexFrom);
    this.__indexTo__ = Number.isNaN(indexTo) ? Infinity : Math.max(0, +indexTo);
  }

  /** @inheritdoc */
  [Symbol.iterator]() {
    let iter;
    if (this.__indexFrom__ === 0 && this.__indexTo__ >= this.source.length) {
      iter = this.source[Symbol.iterator]();
    } else {
      const generator = function* generator(array, indexFrom, indexTo) {
        for (let i = indexFrom; i < indexTo; i += 1) {
          yield array[i];
        }
      };
      iter = generator(this.source, this.__indexFrom__, this.__indexTo__);
    }
    return Iterable.__iter__(iter);
  }

  // Conversions /////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  toArray(array = null) {
    if (!array) {
      return this.source.slice(this.__indexFrom__, this.__indexTo__);
    }
    return super.toArray(array);
  }

  // Properties //////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  isEmpty() {
    return this.length === 0;
  }

  /** @inheritdoc */
  get length() {
    return Math.max(0,
      Math.min(this.source.length, this.__indexTo__) - this.__indexFrom__);
  }

  // Reductions //////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  reduce(foldFunction, initial) {
    if (this.__indexFrom__ === 0 && this.__indexTo__ >= this.source.length) {
      return this.source.reduce(foldFunction, initial);
    }
    return super.reduce(foldFunction, initial);
  }

  // Selections //////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  get(index, defaultValue) {
    const found = index >= 0 && index < this.length;
    if (!found && arguments.length < 2) {
      throw new Error(`Cannot get value at ${index}!`);
    }
    return found ? this.source[index + this.__indexFrom__] : defaultValue;
  }
} // class ArrayIterable

/** Makes an `Iterable` for the given `array`.
 *
 * @param {T[]} array
 * @returns {ArrayIterable<T>}
 */
export function fromArray(array) {
  if (!Array.isArray(array)) {
    throw new Error(`Expected an array, but got ${array}!`);
  }
  return new ArrayIterable(array);
}

/** Makes an `Iterable` for the given arguments.
 *
 * @param {...T} values
 * @returns {ArrayIterable<T>}
 */
export function fromValues(...values) {
  return this.fromArray(values);
}
