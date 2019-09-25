/* eslint-disable no-tabs */
import { id, throwUnimplemented, toBool, toNumber } from './utils';

/** Base abstract superclass for all iterable types.
 */
export default class AbstractIterable {
  /** The base constructor simply defines the `source` property.
   *
   * @param {any} source - The iterable source may be a function that makes
   *   the iterator, or other way to get the sequence's values.
   */
  constructor(source) {
    Object.defineProperty(this, 'source', { value: source });
  }

  /** Instruments an asynchronous iterator with a `return` method if it lacks
   * one. This is necessary in order to interrupt an iteration, which is
   * required for many optimization strategies.
   * @protected
   */
  static __aiter__(iterator) {
    if (iterator.return) {
      return iterator;
    }
    let done = false;
    const oldNext = iterator.next.bind(iterator);
    return {
      next() {
        return done ? Promise.resolve({ done: true }) : oldNext();
      },
      return() {
        done = true;
        return Promise.resolve({ done: true });
      },
    };
  }

  /** Instruments an iterator with a `return` method if it lacks one. This is
   * necessary in order to interrupt an iteration, which is required for many
   * optimization strategies.
   * @protected
   */
  static __iter__(iterator) {
    if (!iterator.return) {
      let done = false;
      const oldNext = iterator.next.bind(iterator);
      iterator = {
        next() {
          return done ? { done: true } : oldNext();
        },
        return() {
          done = true;
          return { done: true };
        },
      };
    }
    return iterator;
  }

  /** The abstract iterable base class cannot be iterated.
   * @abstract
   */
  [Symbol.iterator]() {
    throwUnimplemented('[@@iterator]', this.constructor.name);
  }

  /** The abstract iterable base class cannot be asynchronously iterated.
   * @abstract
   */
  [Symbol.asyncIterator]() {
    throwUnimplemented('[@@asyncIterator]', this.constructor.name);
  }

  /** Makes a new sequence, with the values of this sequence that comply with
   * the `checkFunction`, transformed by the `valueFunction`. Both arguments
   * can be ommited.
   *
   * @param {function} [valueFunction=null] - A callback function that
   *   transforms the value of this sequence into the values of the resuling
   *   sequence.
   * @param {function} [checkFunction=null] - A condition all values of this
   *   sequence have to comply in order to be in the resulting sequence. If
   *   `null` all values are considered.
   * @returns {AbstractIterable} A new iterable.
   *
   * @abstract
   */
  filteredMap() {
    throwUnimplemented('filteredMap', this.constructor.name);
  }

  /** Iterates over this sequence. The `doFunction` is called with all the
   * values that comply with `ifFunction`. The last result of `doFunction` is
   * returned when the iteration finishes.
   *
   * @param {function(T):R} doFunction - A function to call with each value
   *   that complies with `ifFunction`.
   * @param {function(T):boolean} [ifFunction=null] - A function to check
   *   each value in the iteration. If `null` all values are accepted.
   * @returns {R} The last result of calling `doFunction`.
   *
   * @abstract
   */
  forEach() {
    throwUnimplemented('forEach', this.constructor.name);
  }

  // Conversions /////////////////////////////////////////////////////////////////

  /** Makes a new iterable, with the values of this one transformed by the
   * `mapFunction`.
   *
   * @param {function(T):R} mapFunction - A callback function that calculates
   *   the values for the new sequence.
   * @returns {AbstractIterable<R>}
   *
   * @see AbstractIterable.filteredMap
   */
  map(mapFunction) {
    return this.filteredMap(mapFunction);
  }

  /** Builds a new iterable with values calculated using values from this
   * iterable, in a similar fashion that `map`. The main difference is that
   * the `mapFunction` is called with `n` consequent values.
   *
   * @param {integer} [n=1] - The number of consequent values with which the
   *   `mapFunction` is called.
   * @param {function(T[]):R} mapFunction - A callback function that
   *   calculates the values for the new sequence.
   * @returns {AbstractIterable<R>}
   */
  peephole(n, mapFunction = null) {
    n = Number.isNaN(n) ? 1 : Math.floor(n);
    let window;
    return this.filteredMap(() => {
      const args = window.slice(); // Shallow copy.
      return mapFunction ? mapFunction(args) : args;
    }, (value, i) => {
      if (i === 0) {
        window = [];
      }
      window.push(value);
      if (window.length > n) {
        window.shift();
      }
      return window.length === n;
    });
  }

  /** Appends to `array` the elements of the sequence and returns it. If no
   * array is given, a new one is used.
   *
   * @param {any[]} [array=null] - The array to which to add this sequence's
   *   values. If `null` a new one is created.
   * @returns {any[]} The `array` argument, if given.
   */
  toArray(array = null) {
    array = array || [];
    return this.reduce((obj, value) => {
      array.push(value);
      return array;
    }, array);
  }

  /** Takes a sequence of `[key,value]` pairs and puts each in the given
   * `map` (or a new one by default).
   *
   * @param {Map} [map=null] - The `Map` to which to add this sequence's
   *   values. If `null` a new one is created.
   * @returns {Map} The argument `map`, if given.
   */
  toMap(map = null) {
    return this.reduce((accum, [key, value]) => {
      accum.set(key, value);
      return accum;
    }, map || new Map());
  }

  /** Takes a sequence of `[key,value]` pairs and assigns each as a property
   * of `obj` (or a new object by default).
   *
   * @param {object} [obj=null] - The object to which to add this sequence's
   *   values. If `null` a new one is created.
   * @returns {object} The argument `obj`, if given.
   */
  toObject(obj = null) {
    return this.reduce((accum, [key, value]) => {
      accum[key] = value;
      return accum;
    }, obj || {});
  }

  /** Adds all the values in this sequence to the given `set`, or a new one
   * by default.
   *
   * @param {Set} [set=null] - The `Set` instance to which to add this
   *   sequence's values. If `null` a new one is created.
   * @returns {Set} The argument `set`, if given.
   */
  toSet(set = null) {
    return this.reduce((accum, value) => {
      accum.add(value);
      return accum;
    }, set || new Set());
  }

  // Properties //////////////////////////////////////////////////////////////////

  /** Checks if the given `value` occurs in the iterable.
   *
   * @param {T} value - The value to seek in the sequence.
   * @param {function(T,T):boolean} [equality=null] - An equality function to
   *   compare values with. If `null`, the standard `(===)` operator is used.
   * @return {boolean} Whether the given `value` is in the sequence or not.
   * @abstract
   */
  has() {
    throwUnimplemented('has', this.constructor.name);
  }

  /** Analogously to the array's namesake method, returns the first position
   * of the given `value`, or -1 if it is not found.
   *
   * @param {any} value - The value to seek in the sequence.
   * @param {integer} [from=0] - The index from which to start seeking.
   * @returns {integer} The index of the value in the sequence, or `-1` if
   *   absent.
   */
  indexOf(value, from = 0) {
    return this.indicesOf(value, from).head(-1);
  }

  /** Returns a sequence of the positions of the value in this sequence.
   *
   * @param {any} value - The value to seek in the sequence.
   * @param {integer} [from=0] - The index from which to start seeking.
   * @returns {AbstractIterable<integer>} A sequence of the indices of the
   *   given `value` in this sequence.
   */
  indicesOf(value, from = 0) {
    from = Math.floor(from) || 0;
    return this.filteredMap(
      (_, i) => i,
      (v, i) => v === value && i >= from,
    );
  }

  /** Returns the position of the first value in this sequence that comply
   * with the given `condition`, or -1 if it is not found.
   *
   * @param {function(T):boolean} condition - The condition for the values to
   *   seek in the sequence.
   * @param {integer} [from=0] - The index from which to start seeking.
   * @returns {integer} The index of the compliant value in the sequence, or
   *   `-1` if absent.
   */
  indexWhere(condition, from = 0) {
    return this.indicesWhere(condition, from).head(-1);
  }

  /** Returns a sequence of the positions of the values in this sequence that
   * comply with the given `condition`.
   *
   * @param {function(T):boolean} condition - The condition for the values to
   *   seek in the sequence.
   * @param {integer} [from=0] - The index from which to start seeking.
   * @returns {AbstractIterable<integer>} A sequence of the indices of the
   *   values in this sequence compliant with the given `condition`.
   */
  indicesWhere(condition, from = 0) {
    return this.filteredMap(
      (_, i) => i,
      (v, i, iter) => condition(v, i, iter) && i >= from,
    );
  }

  /** Returns whether the sequence has elements or not.
   *
   * @returns {boolean} `true` if this sequence is empty, or `false`
   *   otherwise.
   */
  isEmpty() {
    return this.reduce((accum, _value, _i, iter) => {
      iter.return();
      return false;
    }, true);
  }

  /** Returns the amount of values in the sequence.
   *
   * @returns {integer}
   */
  get length() {
    return this.reduce((accum) => accum + 1, 0);
  }

  // Reductions //////////////////////////////////////////////////////////////////

  /** Returns `true` if for all elements in the sequence comply with the
   * given `predicate`, or if they are all truthy if no predicate is given.
   * If the sequence is empty, `true` is returned.
   *
   * @param {function(T):boolean} [predicate=null] - The condition to check
   *   with all values in this sequence.
   * @param {boolean} [strict=false] - If `false` the iteration is stopped at
   *   the first non compliant value encountered in the sequence. Else, all
   *   values are checked.
   * @returns {boolean}
   */
  all(predicate = null, strict = false) {
    predicate = typeof predicate === 'function' ? predicate : toBool;
    return this.reduce((result, value, i, iter) => {
      if (!predicate(value, i, iter)) {
        result = false;
        if (!strict) {
          iter.return(); // Shortcircuit.
        }
      }
      return result;
    }, true);
  }

  /** Returns `false` if for all elements in the sequence do not comply with
   * the given `predicate`, or if they are all truthy if no predicate is
   * given. If the sequence is empty, `false` is returned.
   *
   * @param {function(T):boolean} [predicate=null] - The condition to check
   *   with all values in this sequence.
   * @param {boolean} [strict=false] - If `false` the iteration is stopped at
   *   the first compliant value encountered in the sequence. Else, all
   *   values are checked.
   * @returns {boolean}
   */
  any(predicate, strict = false) {
    predicate = typeof predicate === 'function' ? predicate : toBool;
    return this.reduce((result, value, i, iter) => {
      if (predicate(value, i, iter)) {
        result = true;
        if (!strict) {
          iter.return(); // Shortcircuit.
        }
      }
      return result;
    }, false);
  }

  /** Iterates over the whole sequence, counting the occurance of each value.
   * The results are kept in the given `map`, or in a new one by default.
   *
   * @param {function(T,integer):K} [key=null] - A function to get a key
   *   for every value in the sequence. Values are grouped by this keys. If
   *   `null`, the values are grouped with themselves.
   * @param {Map<K,integer>} [map=null] - A map to use to store the
   *   frequencies. If `null` a new one is created.
   * @returns {Map<K, integer>} The `map` argument if given.
   */
  histogram(key = null, map = null) {
    const grouping = (count) => (count || 0) + 1;
    return this.groupBy(key, grouping, map);
  }

  /** Iterates over the whole sequence, grouping its values according to the
   * `key` function. These keys are used to build a `Map`, where groups are
   * stored. If no `key` is given, the values themselves are used as keys.
   *
   * @param {function(T,integer):K} [key=null] - A function to get a key
   *   for every value in the sequence. Values are grouped by this keys. If
   *   `null`, the values are grouped with themselves.
   * @param {function(G,K,integer):G} [grouping=null] - A function to add
   *   values to each group. By default values are grouped in arrays.
   * @param {Map<K,G>} [map=null] - A map to use to store the groups of
   *   values. If `null` a new one is created.
   * @returns {Map<K,G>} The `map` argument if given.
   */
  groupBy(key = null, grouping = null, map = null) {
    grouping = grouping || ((group, value) => {
      group = group || [];
      group.push(value);
      return group;
    });
    map = map || new Map();
    return this.reduce((groupMap, value, i) => {
      const k = key ? key(value, i) : value;
      groupMap.set(k, grouping(groupMap.get(k), value, i));
      return groupMap;
    }, map);
  }

  /** Concatenates all values in the sequence as strings, using `sep` as
   * separator (or `''` is assumed).
   *
   * @param {string} [sep=''] - The string to intersperse betwen values in
   *   the resulting string.
   * @param {string} [prefix=''] - A string to add at the beginning of the
   *   result.
   * @returns {string}
   */
  join(sep = '', prefix = '') {
    sep = `${sep}`;
    if (sep) {
      return this.reduce((accum, value, i) => (
        accum + ((i === 0) ? value : sep + value)
      ), prefix);
    }
    return this.reduce((accum, value) => accum + value, prefix);
  }

  /** Returns the maximum of all numbers in the sequence.
   *
   * @param {number} [n=-Infinity] - A minimum number to consider. If all
   *   numbers in the sequence are smaller than `n`, it will be returned as
   *   the result.
   * @returns {number}
   */
  max(n = -Infinity) {
    n = Number.isNaN(n) ? -Infinity : +n;
    return this.reduce((n1, n2) => Math.max(n1, n2), n);
  }

  /** Returns the maximum of all values in the sequence, using the given
   * `compareFunction`.
   *
   * @param {function(T,T):number} compareFunction - The function used to
   *   compare two values in the sequence. It must follow the protocol of
   *   functions [used to sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Syntax).
   * @param {number} [defaultValue=-Infinity] - A minimum number to consider.
   *   If all numbers in the sequence are smaller than `defaultValue`, it
   *   will be returned as the result.
   * @returns {number}
   */
  maxBy(compareFunction, defaultValue = -Infinity) {
    return this.reduce(
      (v1, v2) => (compareFunction(v1, v2) < 0 ? v2 : v1),
      defaultValue,
    );
  }

  /** Returns the minimum of all numbers in the sequence.
   *
   * @param {number} [n=+Infinity] - A maximum number to consider. If all
   *   numbers in the sequence are bigger than `n`, it will be returned as
   *   the result.
   * @returns {number}
   */
  min(n = +Infinity) {
    n = Number.isNaN(n) ? +Infinity : +n;
    return this.reduce((n1, n2) => Math.min(n1, n2), n);
  }

  /** Returns the minimum of all values in the sequence, using the given
   * `compareFunction`.
   *
   * @param {function(T,T):number} compareFunction - The function used to
   *   compare two values in the sequence. It must follow the protocol of
   *   functions [used to sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Syntax).
   * @param {number} [defaultValue=+Infinity] - A maximum number to consider.
   *   If all numbers in the sequence are bigger than `defaultValue`, it will
   *   be returned as the result.
   * @returns {number}
   */
  minBy(compareFunction, defaultValue = +Infinity) {
    return this.reduce(
      (v1, v2) => (compareFunction(v1, v2) > 0 ? v2 : v1),
      defaultValue,
    );
  }

  /** Returns the product of all numbers in the sequence, or `n` if the
   * sequence is empty.
   *
   * @param {number} [n=1] - A starting value for the multiplication.
   * @returns {number}
   */
  multiplication(n = 1) {
    n = Number.isNaN(n) ? 1 : +n;
    return this.reduce((n1, n2) => n1 * n2, n);
  }

  /** Folds the elements of this iterable with `foldFunction` as a left
   * associative accumulator.
   *
   * @param {function(A,T,integer):A} foldFunction - The operation is to
   *   reduce this sequence's values into one.
   * @param {A} initial - The `initial` value is used as a starting point.
   * @return {A}
   */
  reduce(foldFunction, initial) {
    return this.scanl(foldFunction, initial).lastValue(initial);
  }

  /** Folds the elements of this iterable with `foldFunction` as a left
   * associative accumulator. Instead of returning the last result (as
   * `reduce` does), it iterates over the intermediate values in the folding
   * sequence.
   *
   * @param {function(A,T,integer):A} foldFunction - The operation is to
   *   reduce this sequence's values into one.
   * @param {A} initial - The `initial` value is used as a starting point.
   * @return {AbstractIterable<A>}
   */
  scanl() {
    throwUnimplemented('scanl', this.constructor.name);
  }

  /** Returns the sum of all numbers in the sequence, or `n` if the sequence
   * is empty.
   *
   * @param {number} [n=0] - A starting value for the sum.
   * @returns {number}
   */
  sum(n = 0) {
    n = Number.isNaN(n) ? 0 : +n;
    return this.reduce((n1, n2) => n1 + n2, n);
  }

  // Selections //////////////////////////////////////////////////////////////////

  /** Selects values from this iterable that have a truthy flag in the same
   * position in the argument `flags`. It is inspired by the [namesake
   * function](https://docs.python.org/3.7/library/itertools.html?highlight=itertools#itertools.compress)
   * in the [Python standard library `itertools`](http://docs.python.org).
   *
   * @param {iterable<boolean>} flags - A sequence of flags
   * @returns {iterable<T>} Selected values from this sequence.
   */
  compress(flags) {
    return this.zip(flags)
      .filteredMap(([value]) => value, ([, flag]) => flag);
  }

  /** Returns an iterable with the same elements than this, except the first
   * `n` ones.
   *
   * @param {integer} [n=1] - An amount of values to drop.
   * @returns {iterable<T>} The values not dropped.
   */
  drop(n = 1) {
    n = Number.isNaN(n) ? 1 : Math.floor(n);
    return this.slice(n);
  }

  /** Returns an iterable with the same elements than this, except the first
   * consecutive ones that comply with the condition.
   *
   * @param {function(T):boolean} [condition=null] - A predicate to check
   *   this sequence values with. If `null`, each values boolean
   *   interpretation is assumed.
   * @returns {iterable<T>}
   */
  dropWhile(condition = null) {
    condition = condition || toBool;
    let dropping = false;
    return this.filteredMap(null, (value, i, iter) => {
      dropping = (i === 0 || dropping) && condition(value, i, iter);
      return !dropping;
    });
  }

  /** Returns an iterable of this iterable elements for which `condition`
   * returns true.
   *
   * @param {function(T):boolean} [condition=null] - A predicate to check
   *   this sequence values with. If `null`, each values boolean
   *   interpretation is assumed.
   * @returns {iterable<T>}
   */
  filter(condition = null) {
    return this.filteredMap(null, condition || toBool);
  }

  /** Returns the first element. If the sequence is empty it returns
   * `defaultValue`, or raise an exception if none is given.
   *
   * @param {T} [defaultValue=undefined] - A default value to return if this
   *   sequence is empty.
   * @returns {T} The first value in this sequence.
   */
  head() {
    throwUnimplemented('head', this.constructor.name); //TODO Can this be implemented like isEmpty()?
  }

  /** Returns the value at the given `index`, or `defaultValue` if there is
   * not one.
   *
   * @param {integer} [index] - The index of the value to get from this
   *   sequence. The first one is zero.
   * @param {T} [defaultValue=undefined] - A default value to return if this
   *   sequence is empty.
   * @returns {T}
   */
  get(index, defaultValue) {
    const filtered = this.filter((_value, i) => i === index);
    return (arguments.length < 2) ? filtered.head() : filtered.head(defaultValue);
  }

  /** Returns an array with the elements of the iterable with the greater
   * evaluation (or numerical conversion by default).
   *
   * @param {function(T):number} [evaluation=null] - A function with which to
   *   evaluate the values in this sequence.
   * @returns {T[]}
   */
  greater(evaluation = null) {
    evaluation = evaluation || toNumber;
    let maxEval = -Infinity;
    return this.reduce((result, value) => {
      const e = evaluation(value);
      if (maxEval < e) {
        maxEval = e;
        result = [value];
      } else if (maxEval === e) {
        result.push(value);
      }
      return result;
    }, []);
  }

  /** Returns an array with the elements of the iterable with the lesser
   * evaluation (or numerical conversion by default).
   *
   * @param {function(T):number} [evaluation=null] - A function with which to
   *   evaluate the values in this sequence.
   * @returns {T[]}
   */
  lesser(evaluation = null) {
    evaluation = evaluation || toNumber;
    let minEval = +Infinity;
    return this.reduce((result, value) => {
      const e = evaluation(value);
      if (minEval > e) {
        minEval = e;
        result = [value];
      } else if (minEval === e) {
        result.push(value);
      }
      return result;
    }, []);
  }

  /** A sequence with each value of this sequence only appearing once.
   * Equal elements are removed, according to the `equality` function, or
   * `(===)` by default.
   *
   * _Warning!_ All the elements of the result are stored in memory.
   *
   * @param {function(T,T):boolean} [equality=null] - A function to compare
   *   the sequence's values.
   * @returns {iterable<T>}
   */
  nub(equality = null) {
    //TODO Split in `nub` and `nubBy`.
    let buffer;
    if (equality) {
      return this.filter((value, i) => {
        if (i === 0) {
          buffer = [value];
          return true;
        }
        for (const prev of buffer) {
          if (equality(value, prev)) {
            return false;
          }
        }
        buffer.push(value);
        return true;
      });
    }
    return this.filter((value, i) => {
      if (i === 0) {
        buffer = new Set();
        buffer.add(value);
        return true;
      }
      if (buffer.has(value)) {
        return false;
      }
      buffer.add(value);
      return true;
    });
  }

  /** Gathers `n` values from this iterable at random, and returns them in
   * an array.
   *
   * @param {integer} [n=1] - The amount of values to randomly select from
   *   this sequence.
   * @param {function():number} [rng=null] - A pseudo-random generator
   *   function. Results should always in the range _[0,1)_.
   * @returns {T[]}
   */
  sample(n, rng = null) {
    n = +n >= 1 ? Math.floor(n) : 1;
    rng = rng || Math.random;
    return this.reduce((selected, value, i) => {
      if (i < n) {
        selected.push(value);
      } else {
        const r = Math.floor(rng() * i);
        if (r < n) {
          selected[r] = value;
        }
      }
      return selected;
    }, []);
  }

  /** Return an iterable over a portion of the this sequence from `begin` to
   * `end`.
   *
   * @param {integer} [begin=0] - The index of the first value of the slice.
   * @param {integer} [end=+Infinity] - The index of the last value of the
   *   slice.
   * @returns {T[]}
   */
  slice(begin = 0, end = Infinity) {
    begin = Number.isNaN(begin) ? 0 : Math.floor(begin);
    end = Number.isNaN(end) ? Infinity : Math.floor(end);
    return this.filteredMap(null, (_, i, iter) => {
      if (i >= end) {
        iter.return();
        return false;
      }
      return i >= begin;
    });
  }

  /** Returns an iterable with the same elements than this, except the first
   * one.
   *
   * @returns {iterable<t>}
   */
  tail() {
    return this.drop(1); //FIXME Should raise an error if this is empty.
  }

  /** Return an iterable with the first `n` elements of this one.
   *
   * @param {integer} [n=1] - The amount of values to take.
   * @returns {iterable<T>}
   */
  take(n = NaN) {
    n = Number.isNaN(n) ? 1 : Math.floor(n);
    return this.slice(0, n);
  }

  /** Return an iterable with the first consecutive elements that verify the
   * given `condition`.
   *
   * @param {function(T):boolean} [condition=null] - A predicate to check
   *   this sequence values with. If `null`, each values boolean
   *   interpretation is assumed.
   * @returns {iterable<T>}
   */
  takeWhile(condition = null) {
    condition = condition || toBool;
    return this.filteredMap(null, (value, i, iter) => {
      if (!condition(value, i, iter)) {
        iter.return();
        return false;
      }
      return true;
    });
  }

  // Unary operations ////////////////////////////////////////////////////////////

  //TODO buffered
  //TODO combinations
  //TODO cons
  //TODO cycle
  //TODO permutations
  //TODO reverse
  //TODO sorted

  // Variadic operations /////////////////////////////////////////////////////////

  /** Returns an iterable that goes over the concatenation of this and all
   * the given iterables.
   *
   * @param {...iterable<T>} iterables
   * @returns {iterable<T>}
   */
  concat(...iterables) {
    return this.constructor.concat(this, ...iterables);
  }

  /** Calculates the difference of the first with the rest of them. All
   * arguments treat the given `iterables` as sets. The `equality` function
   * is used to compare values.
   *
   * _Warning!_ Repeated values in this iterable will still be repeated.
   *
   * @param {function(T,T):boolean} equality - A function used to compare
   *   values. If `null`, the standard equality operator (`===`) is used.
   * @param {...iterable<T>} iterables - Sequences with values to remove.
   * @returns {iterable<T>}
   */
  differenceBy(equality, ...iterables) {
    equality = equality || ((v1, v2) => v1 === v2);
    return this.filter((value) => {
      for (const iterable of iterables) {
        for (const other of iterable) {
          if (equality(value, other)) {
            return false;
          }
        }
      }
      return true;
    });
  }

  /** Calculates the difference of the first with the rest of them. All
   * arguments treat the given `iterables` as sets.
   *
   * _Warning!_ Repeated values in this iterable will still be repeated.
   *
   * @param {...iterable<T>} iterables - Sequences with values to remove.
   * @returns {iterable<T>}
   */
  difference(...iterables) {
    return this.differenceBy(null, ...iterables);
  }

  /** Calculates the intersection of this sequence and the given `iterables`
   * as sets. The `equality` function is used to compare values. If `null`,
   * the standard equality operator (`===`) is used.
   *
   * _Warning!_ Repeated values in this iterable will still be repeated.
   *
   * @param {function(T,T):boolean} equality - A function used to compare
   *   values. If `null`, the standard equality operator (`===`) is used.
   * @param {...iterable<T>} iterables - Sequences with to intersect with.
   * @returns {iterable<T>}
   */
  intersectionBy(equality, ...iterables) {
    equality = equality || ((v1, v2) => v1 === v2);
    return this.filter((value) => {
      for (const iterable of iterables) {
        let found = false;
        for (const other of iterable) {
          if (equality(value, other)) {
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
      }
      return true;
    });
  }

  /** Calculates the intersection of this sequence and the given `iterables`
   * as sets.
   *
   * _Warning!_ Repeated values in this iterable will still be repeated.
   *
   * @param {...iterable<T>} iterables - Sequences with values to remove.
   * @returns {iterable<T>}
   */
  intersection(...iterables) {
    return this.intersectionBy(null, ...iterables);
  }

  /** Returns an iterable of the [cartesian product](http://en.wikipedia.org/wiki/Cartesian_product)
   * of this sequence and the given `iterables`. Each value of the returned
   * sequence is an array of values.
   *
   * @param {...iterable<T>} iterables
   * @returns {iterable<T[]>}
   */
  product(...iterables) {
    return this.constructor.product(this, ...iterables);
  }

  /** The `union` method treats the given `iterables` as sets, and calculates
   * the union of all of them. The `equality` function is used to compare values
   * to avoid repeating them. If it is not given, the standard equality operator
   * (`===`) is used.
   *
   * _Warning!_ All the elements of the result are stored in memory.
   *
   * @param {function(T,T):boolean} equality - A function used to compare
   *   values. If `null`, the standard equality operator (`===`) is used.
   * @param {...iterable<T>} iterables - Sequences with to unite with.
   * @returns {iterable<T>}
   */
  unionBy(equality, ...iterables) {
    return this.concat(...iterables).nub(equality);
  }

  /** Builds an iterable that goes all the given iterables in parallel,
   * stopping at the first sequence that finishes. Each value in the
   * generated sequence is an array of the values of each sequence.
   *
   * @param {...iterable<T>} iterables
   * @returns {iterable<R>}
   */
  static zip(...iterables) { //TODO Refactor out of class
    return this.zipWith(id, ...iterables);
  }

  /** Builds an iterable that goes over this sequence and all the given
   * iterables in parallel, stopping at the first sequence that finishes.
   * Each value in the generated sequence is an array of the values of each
   * sequence.
   *
   * @param {...iterable<T>} iterables
   * @returns {iterable<R>}
   */
  zip(...iterables) {
    return this.constructor.zip(this, ...iterables);
  }

  /** Builds an iterable that goes over this sequence and all the given
   * iterables in parallel, stopping at the first sequence that finishes.
   * Each value in the generated sequence is made by calling the given
   * `zipFunction` with an array of the values of each sequence.
   *
   * @param {function(T[]):R} zipFunction - The function to combine an
   *   array values into one.
   * @param {...iterable<T>} iterables
   * @returns {iterable<R>}
   */
  zipWith(zipFunction, ...iterables) {
    return this.constructor.zipWith(zipFunction, this, ...iterables);
  }
} // class AbstractIterable
