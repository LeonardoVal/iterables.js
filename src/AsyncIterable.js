import { filteredMap } from './generators-async';
import AbstractIterable from './AbstractIterable';

/** General class for representing asynchronous sequences.
 *
 * @augments AbstractIterable
 */
// eslint-disable-next-line import/prefer-default-export
export class AsyncIterable extends AbstractIterable {
  /** @inheritdoc */
  constructor(source) {
    super(source);
  }

  /** Instances of `AsyncIterable` are always asynchronous, hence `isAsync`
   * is always `true`.
   */
  get isAsync() {
    return true;
  }

  /** All `AsyncIterable` instances are (of course) _iterable_, hence they
   * have a `Symbol.asyncIterator` method that returns an asynchronous
   * iterator.
   */
  [Symbol.asyncIterator]() {
    const { source } = this;
    const iterator = typeof source === 'function' ? source()
      : source[Symbol.asyncIterator]();
    return AsyncIterable.__aiter__(iterator);
  }

  /** @inheritdoc */
  filteredMap(valueFunction, checkFunction) {
    const source = filteredMap.bind(null, this, valueFunction, checkFunction);
    return new AsyncIterable(source);
  }

  /** @inheritdoc */
  async forEach(doFunction, ifFunction) {
    let result;
    for await (result of this.filteredMap(doFunction, ifFunction)) {
      if (!ifFunction || await ifFunction(value, i, iter)) {
        result = doFunction ? await doFunction(value, i, iter)
          : value;
      }
    }
    return result;
  }

  // Builders ////////////////////////////////////////////////////////////////////

  /** Generates an asynchronous sequence of timestamps, every `step`
   * milliseconds until `end` is reached.
   *
   * @param {number} [step=1000] - The time lapse between each value.
   * @param {number} [end=+Infinity] - The time when the sequence must stop.
   * @yields {asyncIterable<number>}
   */
  ticks(step, end) {
    let source = generators.async.bind(generators, ticks, step, end);
    return new AsyncIterator(source);
  }

  // Conversions /////////////////////////////////////////////////////////////////

  // Properties //////////////////////////////////////////////////////////////////

  // Reductions //////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  async reduce(foldFunction, initial) {
    let folded = initial,
      iter = this[Symbol.iterator](),
      i = 0;
    for (let entry = await iter.next(); !entry.done; entry = await iter.next()) {
      folded = foldFunction(folded, entry.value, i, iter);
      i++;
    }
    return folded;
  }

  /** @inheritdoc */
  scanl(foldFunction, initial) {
    return new AsyncIterable(generators.async.scanl, this, foldFunction,
      initial);
  }

  // Selections //////////////////////////////////////////////////////////////////

  // Unary operations ////////////////////////////////////////////////////////////

  // Variadic operations /////////////////////////////////////////////////////////

  //TODO static concat

  //TODO static product

  //TODO static zipWith

} // class AsyncIterable
