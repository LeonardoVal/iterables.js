import { properties } from '../generators';
import Iterable from '../Iterable';

/** Class for representing sequences based on objects, i.e. a sequence of
 * `[key, value]` pairs taken from the object's properties.
 *
 * @augments Iterable
 */
export class ObjectIterable extends Iterable {
  /** The constructor takes an object as a source.
   *
   * @param {object} obj - The object instance to be used a the source of the
   *   sequence.
   * @param {boolean} [sortKeys=false] - If true, the sequence is build
   *   taking `obj`'s properties in lexicographical order by key.
   * @throws {TypeError} Raises an error if `obj` is not an object or if it
   *   is null.
  */
  constructor(obj, sortKeys = false) {
    if (typeof obj !== 'object' || !obj) {
      throw new TypeError(`Argument must be an object, but is a ${obj && typeof obj}!`);
    }
    super(obj);
    const keys = Object.keys(obj);
    if (sortKeys) {
      keys.sort();
    }
    Object.defineProperty(this, 'keys', { value: keys });
  }

  /** @inheritdoc */
  [Symbol.iterator]() {
    return properties(this.source, this.keys);
  }

  // Properties ////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  isEmpty() {
    return this.length === 0;
  }

  /** @inheritdoc */
  get length() {
    return this.keys.length;
  }
} // class ObjectIterable

/** Makes an `Iterable` for the given object `obj`. The sequence goes over
 * array in the shape `[key, value]`.
 *
 * @param {object} obj - The object to be used as a source.
 * @param {boolean} [sortKeys=false] - If truthy the object keys are
 *   sorted.
 * @returns {ObjectIterable<any[]>}
 */
export function fromObject(obj, sortKeys = false) {
  return new ObjectIterable(obj, sortKeys);
}
