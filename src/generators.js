import { factorial, MAX_INTEGER } from './utils';

/** A namespace for utility functions related to (synchronous) [iterators and
 * generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators).
 * @namespace generators
 */

// Sequence builders ///////////////////////////////////////////////////////////

/** An iterator of an empty sequence.
 *
 * @returns {Iterator<any>}
 */
export function empty() {
  return {
    next() {
      return { done: true };
    },
    return() {
      return { done: true };
    },
  };
}

/** Generates an enumeration defined by the given values. The big
 * difference with `range` is that the enumeration can go in either
 * direction.
 *
 * @param {number} [from=0] - The first value.
 * @param {number} [then=1] - The second value.
 * @param {number} [to=+Infinity] - A bound for the sequence's values.
 * @yields {number}
 *
 * @example <caption>Represents the sequence: 1, 3, 5, 7.</caption>
 * enumFromThenTo(1,3,8)
 * @example <caption>Represents the sequence: 10, 7, 4, 1.</caption>
 * enumFromThenTo(10,7,0)
 *
 * @see range
 */
export function enumFromThenTo(from, then, to) {
  from = Number.isNaN(from) ? 0 : +from;
  then = Number.isNaN(then) ? from + 1 : +then;
  return range(from, then, to, true);
}

/** @see enumFromThenTo  */
export function* enumFromThen(from, then) {
  yield* this.enumFromThenTo(from, then, undefined);
}

/** @see enumFromThenTo  */
export function* enumFrom(from = 0) {
  yield* this.enumFromThen(from, undefined);
}

/** Generates a sequence that repeatedly applies the function `f` to the
 * value `arg`, `n` times (or indefinitely by default).
 *
 * @param {function (T):T} f - The function to be called.
 * @param {T} arg - The first argument with which to call `f`.
 * @param {integer} [n=+Infinity] - The length of the sequence.
 * @yields {T}
 */
export function* iterate(f, arg, n) {
  n = Number.isNaN(n) ? Infinity : +n;

  for (let i = 0; i < n; i += 1) {
    yield arg;
    arg = f.call(null, arg, i);
  }
}

/** Generates a sequence of `[key,value]` pairs, with a key taken from
 * `keys` and the value of the corresponding property of `obj`. If `keys`
 * is not given, all of the `obj`'s keys are used.
 *
 * @param {object} obj - The object to take properties from.
 * @param {string[]} [keys=null] - The keys of the properties whose values
 *   form the sequence.
 * @yields {any}
 *
 * @see Object.entries
 */
export function* properties(obj, keys = null) {
  if (keys) {
    for (const key of keys) {
      yield [key, obj[key]];
    }
  } else {
    for (const key in obj) {
      yield [key, obj[key]];
    }
  }
}

/** `range()` Iterates over a sequence of numbers from `from` upto `to` with the
 * given `step`.
 *
 * @param {number} from - The first value in the sequence.
 * @param {number} to - The last value in the sequence.
 * @param {number} [step=1] - The difference between each value and the
 *   next in the sequence.
 * @param {boolean} [rightInclusive=false] - Whether the last values is
 *   included in the sequence or not.
 * @yields {number}
 *
 * @example <caption>Iterates over the sequence :2, 5, 8, 11.</caption>
 * range(2,12,3)
 */
export function* range(from, to, step, rightInclusive = false) {
  from = Number.isNaN(+from) ? 0 : +from;
  if (Number.isNaN(+step)) {
    step = Number.isNaN(+to) || to >= from ? 1 : -1;
  } else {
    step = +step;
  }
  if (Number.isNaN(+to)) {
    to = step > 0 ? +Infinity : -Infinity;
  } else {
    to = +to;
  }
  const stepSign = Math.sign(step);
  let diff = (to - from) * stepSign;
  while (rightInclusive ? diff >= 0 : diff > 0) {
    yield from;
    from += step;
    diff = (to - from) * stepSign;
  }
}

/** Generates a sequence that repeats the given `value` `n` times (or
 * forever by default).
 *
 * @param {T} value - The value to be repeated.
 * @param {integer} [n=+Infinity] - The length of the sequence.
 * @yields {T}
 */
export function* repeat(value, n) {
  n = Number.isNaN(n) ? Infinity : +n;
  for (let i = 0; i < n; i += 1) {
    yield value;
  }
}

/** An iterator of a sequence with one `value`.
 *
 * @param {T} [value] - The only value in the iterator's sequence.
 * @yields {T}
 */
export function* singleton(value) {
  yield value;
}

// Operations on one sequence //////////////////////////////////////////////////

/** Iterates over the given sequence `seq` once, storing the values in an
 * array. Any subsequent iteration will go over the array and not the
 * original sequence. It is useful to avoid recalculating the sequence's
 * values if it is to be iterated more than once.
 *
 * @param {iterable<T>} seq - The original sequence.
 * @param {T[]} [array=null] - The buffer array. If not given a new one
 *   will be created.
 * @returns {iterable<T>}
 */
export function buffered(seq, array = null) {
  array = array || [];
  const iter = seq[Symbol.iterator]();
  return function* bufferedGenerator() {
    for (const value of array) {
      yield value;
    }
    for (let entry = iter.next(); !entry.done; entry = iter.next()) {
      array.push(entry.value);
      yield entry.value;
    }
  };
}

/** An iterator that runs over the combinations of `count` elements of the
 * given sequence `seq`. Combinations are generated in lexicographical
 * order.
 *
 * _Warning!_ All `seq`'s values are stored in memory during the iteration.
 *
 * @param {iterable<T>} seq - The sequence with the values to combine.
 * @param {integer} [count=1] - The number of values in each combination.
 * @yields {T[]}
 *
 * @see permutations
 */
export function* combinations(seq, count = 1) {
  const elements = [...seq];
  const suffixes = [...range(0, elements.length)]
    .map((i) => elements.slice(i));
  const emptyArray = [];
  const combRec = function* combinationsGenerator(i, k) {
    if (k < 1 || i >= suffixes.length) {
      yield emptyArray;
    } else {
      let j = 0;
      for (const value of suffixes[i]) {
        if (i + j + (k - 1) < suffixes.length) {
          for (const comb of combRec(i + j + 1, k - 1)) {
            yield [value, ...comb];
          }
        } else {
          break;
        }
        j += 1;
      }
    }
  };
  yield* combRec(0, count);
}

/** As the namesake from functional programming, `cons` generates a new
 * sequence with the `head` first and the `tail` afterwards.
 *
 * @param {T} head - The first value in the new sequence.
 * @param {iterable<T>} tail - The following values in the new sequence.
 * @yields {T}
 */
export function* cons(head, tail) {
  yield head;
  yield* tail;
}

/** An iteration that loops `n` times (or forever by default) over the
 * elements of the given sequence `seq`.
 *
 * @param {iterable<T>} seq - The values to be cycled.
 * @param {integer} [number=+Infinity] - The number of cycles.
 * @yields {T}
 */
export function* cycle(seq, n = +Infinity) {
  for (; n > 0; n -= 1) {
    yield* seq;
  }
}

/** Iterates over a new sequence, with the values of the given sequence
 * `seq` which comply with the `checkFunction`, transformed by the
 * `valueFunction`.
 *
 * @param {iterable<T>} seq - The original sequence.
 * @param {function(T):R} [valueFunction=null] - A callback function that
 *   transforms the value of `seq`.
 * @param {function(T):boolean} [checkFunction=null] - A condition all
 *   values of `seq` have to comply in order to be included in this
 *   iteration.
 * @yields {R}
 */
export function* filteredMap(seq, valueFunction, checkFunction) {
  let i = 0;
  const iter = seq[Symbol.iterator]();
  for (let entry = iter.next(); !entry.done; entry = iter.next()) {
    const { value } = entry;
    if (!checkFunction || checkFunction(value, i, iter)) {
      yield (valueFunction ? valueFunction(value, i, iter) : value);
    }
    i += 1;
  }
}

/** Iterates over the values of a sequence of iterables (`seq`)
 * recursively iterating over each one, upto `depth`.
 *
 * @param {iterable<any>} seq - The sequence of values, some or all of
 *   which are iterable themselves.
 * @param {integer} [depth=+Infinity] - The maximum amount of recursive
 *   calls.
 *
 * @example <caption>Generates the sequence: 1, 2, 3.</caption>
 *   flat([[1,[2]],[3]])
 * @example <caption>Generates the sequence: 1, [2], 3.</caption>
 *   flat([[1,[2]],[3]], 1)
 *
 * @see Array.flat
 * @see concat
*/
export function* flat(seq, depth = +Infinity) {
  depth = Number.isNaN(depth) ? Infinity : +depth;
  for (const value of seq) {
    if (typeof value[Symbol.iterator] === 'function' && depth > 0) {
      yield* flat(value, depth - 1);
    } else {
      yield value;
    }
  }
}

/** Iterates over a new sequence, with the values of the given sequence
 * `seq` transformed by the `mapFunction`.
 *
 * @param {iterable<T>} seq - The original sequence.
 * @param {function(T):R} [mapFunction=null] - A callback function that
 *   transforms the value of `seq`.
 * @yields {R}
 *
 * @see filteredMap
 */
export function map(seq, mapFunction) {
  return filteredMap(seq, mapFunction, null);
}

/** Iterates over the permutations of `k` elements of the given sequence
 * `seq`. Permutations are not generated in any particular order.
 *
 * _Warning!_ All `seq`'s values are stored in memory during the iteration.
 *
 * @param {iterable<T>} seq - The sequence whose values are permutated.
 * @param {integer} [k=NaN] - The amount of values in each permutation. By
 *   default the length of `seq` is assumed.
 * @yields {T[]}
 *
 * @see combinations
 */
export function* permutations(seq, k = NaN) { // FIXME
  const pool = [...seq];
  const n = pool.length;
  k = Number.isNaN(k) ? n : +k;
  if (k > 0 && k <= n) {
    const count = factorial(n, n - k);
    if (count > MAX_INTEGER) {
      throw new Error(`Number of permutations cannot be greater than ${MAX_INTEGER}, and it is ${count}!`);
    }
    const indices = [...range(0, n)];
    let result;
    let is;
    let i;
    for (let current = 0; current < count; current += 1) {
      result = new Array(k);
      is = indices.slice();
      i = current;
      for (let p = 0; p < k; p += 1) {
        result[p] = pool[is.splice(i % (n - p), 1)[0]];
        i = Math.floor(i / (n - p));
      }
      yield result;
    }
  }
}

/** Iterates over the subsequent folds the values of the sequence `seq`,
 * with `foldFunction` as a left associative operator. Instead of returning
 * the last result (as the classic `fold` or `reduce` does), it iterates
 * over the intermediate values in the folding sequence.
 *
 * @param {iterable<T>} seq - The sequence whose values will be folded.
 * @param {function(A,T):A} foldFunction - The folding function.
 * @param {A} initial - The first value of the sequence.
 * @yields {A}
 */
export function* scanl(seq, foldFunction, initial) {
  const iter = seq[Symbol.iterator]();
  let i = arguments.length < 3 ? -1 : 0;
  let folded = initial;
  if (i >= 0) {
    yield folded;
  }
  for (const value of iter) {
    if (i >= 0) {
      folded = foldFunction(folded, value, i, iter);
    } else {
      folded = value;
    }
    yield folded;
    i += 1;
  }
}

// Operations on many sequences ////////////////////////////////////////////////

/** Iterates over the concatenation of all the given iterables.
 *
 * @param {...iterable<T>} iterables
 * @yields {T}
 */
export function* concat(...iterables) {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

/** Gets the iterators of an array of iterables.
 *
 * @param {...iterable} iterables
 * @returns {iterator[]}
*/
export function iterators(...iterables) {
  return iterables.map((iterable) => {
    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new Error(`Object ${iterable} is not iterable!`);
    }
    return iterable[Symbol.iterator]();
  });
}

/** Iterates over the [cartesian product](http://en.wikipedia.org/wiki/Cartesian_product)
 * of the given iterables, yielding an array of the values of each.
 *
 * @param {...iterable<T>} iterables
 * @yields {T[]}
 */
export function* product(...iterables) {
  const iters = iterators(...iterables);
  const tuple = iters.map((iter) => iter.next());
  const { length } = iters;
  let done = tuple.reduce((acc, entry) => acc || entry.done, false);
  while (!done) {
    yield tuple.map((entry) => entry.value);
    for (let i = 0; i < length; i += 1) {
      tuple[i] = iters[i].next();
      if (tuple[i].done) {
        done = i === length - 1;
        if (done) {
          break;
        }
        iters[i] = iterables[i][Symbol.iterator]();
        tuple[i] = iters[i].next();
      } else {
        break;
      }
    }
  }
}

/** Iterates over all the given iterables at the same time, stopping at
 * the first sequence that finishes. Each value in the generated sequence
 * is made by calling the given `zipFunction` with an array of the values
 * of each iterable.
 *
 * @param {function(any[]):R} zipFunction - The function to combine an
 *   array values into one.
 * @param {...iterable<any>} iterables
 * @yields {R}
 */
export function* zipWith(zipFunction, ...iterables) {
  const iters = iterators(...iterables);
  let done = false;
  let values;
  while (!done) {
    // eslint-disable-next-line no-loop-func
    values = iters.map((iter) => {
      const entry = iter.next();
      done = done || entry.done;
      return entry.value;
    });
    if (!done) {
      yield zipFunction(values);
    }
  }
}

/* eslint-disable object-property-newline */
export default {
  buffered,
  combinations,
  concat,
  cons,
  cycle,
  empty,
  enumFromThenTo, enumFromThen, enumFrom,
  filteredMap,
  flat,
  iterate,
  iterators,
  map,
  permutations,
  product,
  properties,
  range,
  repeat,
  scanl,
  singleton,
  zipWith,
};
