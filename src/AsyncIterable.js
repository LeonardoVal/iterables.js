/* TODO concat, product, zipWith */
import {
  filteredMap,
  scanl,
  ticks,
} from './asyncGenerators';
import AbstractIterable from './AbstractIterable';

/** General class for representing asynchronous sequences.
 *
 * @augments AbstractIterable
 */
// eslint-disable-next-line import/prefer-default-export
export class AsyncIterable extends AbstractIterable {
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
    let i = 0;
    const iter = this[Symbol.iterator]();
    for await (const value of iter) {
      if (!ifFunction || await ifFunction(value, i, iter)) {
        result = (doFunction ? await doFunction(value, i, iter) : value);
      }
      i += 1;
    }
    return result;
  }

  // Builders //////////////////////////////////////////////////////////////////

  /** Generates an asynchronous sequence of timestamps, every `step`
   * milliseconds until `end` is reached.
   *
   * @param {number} [step=1000] - The time lapse between each value.
   * @param {number} [end=+Infinity] - The time when the sequence must stop.
   * @yields {asyncIterable<number>}
   */
  ticks(step, end) {
    const source = ticks.bind(null, step, end);
    return new AsyncIterable(source);
  }

  // Reductions ////////////////////////////////////////////////////////////////

  /** @inheritdoc */
  async reduce(foldFunction, initial) {
    let folded = initial;
    const iter = this[Symbol.iterator]();
    let i = 0;
    // eslint-disable-next-line no-await-in-loop
    for (let entry = await iter.next(); !entry.done; entry = await iter.next()) {
      folded = foldFunction(folded, entry.value, i, iter);
      i += 1;
    }
    return folded;
  }

  /** @inheritdoc */
  scanl(foldFunction, initial) {
    const source = scanl.bind(null, this, foldFunction, initial);
    return new AsyncIterable(source);
  }
} // class AsyncIterable
