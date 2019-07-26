/** A namespace for utility functions related to (synchronous) [iterators and 
 * generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators).
 * @namespace generators
 */
let generators = {

// Sequence builders ///////////////////////////////////////////////////////////

	/** An iterator of an empty sequence.
	 * 
	 * @returns {Iterator<any>}
	 */
	empty() {
		return {
			next() { 
				return { done: true };
			},
			return() {
				return { done: true };
			}
		}; 
	},

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
	 * @see generators.range
	 */
	*enumFromThenTo(from, then, to) {
		if (typeof from === 'undefined') {
			from = 0;
		}
		if (typeof then === 'undefined') {
			then = from + 1;
		}
		if (typeof to === 'undefined') {
			to = then > from ? +Infinity : -Infinity;
		}
		let step = then - from;
		while (step > 0 ? from <= to : from >= to) {
			yield from;
			from += step;
		}
	},

	/** @see generators.enumFromThenTo  */
	*enumFromThen(from, then) {
		yield* this.enumFromThenTo(from, then, undefined);
	},

	/** @see generators.enumFromThenTo  */
	*enumFrom(from = 0) {
		yield* this.enumFromThen(from, undefined);
	},

	/** Generates a sequence that repeatedly applies the function `f` to the 
	 * value `arg`, `n` times (or indefinitely by default).
	 * 
	 * @param {function (T):T} f - The function to be called.
	 * @param {T} arg - The first argument with which to call `f`.
	 * @param {integer} [n=+Infinity] - The length of the sequence.
	 * @yields {T} 
	 */
	*iterate(f, arg, n) {
		n = isNaN(n) ? Infinity : +n;
		
		for (let i = 0; i < n; i++) {
			yield arg;
			arg = f.call(null, arg, i);
		}
	},

	/** Generates a sequence of `[key,value]` pairs, with a key taken from 
	 * `keys` and the value of the corresponding property of `obj`. If `keys` 
	 * is not given, all of the `obj`'s keys are used.
	 * 
	 * @param {object} obj - The object to take properties from.
	 * @param {string[]} [keys=null] - The keys of the properties whose values
	 * 	form the sequence.
	 * @yields {any}
	 * 
	 * @see Object.entries
	 */
	*properties(obj, keys = null) {
		if (keys) {
			for (let key of keys) {
				yield [key, obj[key]];
			}
		} else {
			for (let key in obj) {
				yield [key, obj[key]];
			}
		}
	},

	/** `range(from=0, to, step=1)` Iterates over a sequence of numbers from 
	 * `from` upto `to` with the given `step`. 
	 * 
	 * @param {number} [from=0] - The first value in the sequence.
	 * @param {number} to - The last value in the sequence.
	 * @param {number} [step=1] - The difference between each value and the 
	 * 	next in the sequence.
	 * @yields {number} 
	 * 
	 * @example <caption>Iterates over the sequence :2, 5, 8, 11.</caption>
	 * generators.range(2,12,3)
	 */
	*range(from, to, step) {
		if (typeof from === 'undefined') {
			from = 0;
		}
		if (typeof to === 'undefined') {
			to = from;
			from = 0;
		}
		if (typeof step === 'undefined') {
			step = 1;
		}
		from = +from;
		to = +to;
		step = +step;
		while (from < to) {
			yield from;
			from += step;
		}
	},

	/** Generates a sequence that repeats the given `value` `n` times (or 
	 * forever by default).
	 * 
	 * @param {T} value - The value to be repeated.
	 * @param {integer} [n=+Infinity] - The length of the sequence.
	 * @yields {T} 
	 */
	*repeat(value, n) {
		n = isNaN(n) ? Infinity : +n;
		while (i < n) {
			yield value;
		}
	},

	/** An iterator of a sequence with one `value`.
	 * 
	 * @param {T} [value] - The only value in the iterator's sequence.
	 * @yields {T} 
	 */
	*singleton(value) {
		yield value;
	},

// Operations on one sequence //////////////////////////////////////////////////

	/** Iterates over the given sequence `seq` once, storing the values in an 
	 * array. Any subsequent iteration will go over the array and not the 
	 * original sequence. It is useful to avoid recalculating the sequence's
	 * values if it is to be iterated more than once.
	 * 
	 * @param {iterable<T>} seq - The original sequence.
	 * @param {T[]} [array=null] - The buffer array. If not given a new one 
	 * 	will be created.
	 * @returns {iterable<T>}
	 */
	buffered(seq, array = null) {
		array = array || [];
		let iter = seq[Symbol.iterator]();
		return function* () {
			for (let value of array) {
				yield value;
			}
			for (let entry = iter.next(); !entry.done; entry = iter.next()) {
				array.push(entry.value);
				yield entry.value;
			}
		};
	},
	
	/** An iterator that runs over the combinations of `k` elements of the 
	 * given sequence `seq`. Combinations are generated in lexicographical 
	 * order.
	 * 
	 * _Warning!_ All `seq`'s values are stored in memory during the iteration.
	 * 
	 * @param {iterable<T>} seq - The sequence with the values to combine.
	 * @param {integer} [k=1] - The number of values in each combination.
	 * @yields {T[]}
	 * 
	 * @see generators.permutations
	 */
	*combinations(seq, k = 1) {
		let elements = [...seq],
			suffixes = Iterable.range(elements.length)
				.map((i) => new ArrayIterable(elements, i))
				.toArray(),
			emptyArray = [],
			combRec = function* (i, k) {
				if (k < 1 || i >= suffixes.length) {
					yield emptyArray;
				} else {
					let j = 0;
					for (let value of suffixes[i]) {
						if (i + j + (k - 1) < suffixes.length) {
							for (let comb of combRec(i + j + 1, k - 1)) {
								yield [value, ...comb];
							}
						} else {
							break;
						}
						j++;
					}
				}
			};
		yield* combRec(0, k);
	},

	/** As the namesake from functional programming, `cons` generates a new
	 * sequence with the `head` first and the `tail` afterwards.
	 * 
	 * @param {T} head - The first value in the new sequence.
	 * @param {iterable<T>} tail - The following values in the new sequence.
	 * @yields {T}
	 */
	*cons(head, tail) {
		yield head;
		yield *tail;
	},

	/** An iteration that loops `n` times (or forever by default) over the 
	 * elements of the given sequence `seq`.
	 * 
	 * @param {iterable<T>} seq - The values to be cycled.
	 * @param {integer} [number=+Infinity] - The number of cycles.
	 * @yields {T}
	 */
	*cycle(seq, n = +Infinity) {
		for (; n > 0; n--) {
			yield *seq;
		}
	},

	/** Iterates over a new sequence, with the values of the given sequence 
	 * `seq` which comply with the `checkFunction`, transformed by the 
	 * `valueFunction`.
	 * 
	 * @param {iterable<T>} seq - The original sequence.
	 * @param {function(T):R} [valueFunction=null] - A callback function that 
	 * 	transforms the value of `seq`.
	 * @param {function(T):boolean} [checkFunction=null] - A condition all 
	 * 	values of `seq` have to comply in order to be included in this
	 * 	iteration.
	 * @yields {R}
	 */
	*filteredMap(seq, valueFunction, checkFunction) {
		let i = 0,
			iter = seq[Symbol.iterator]();
		for (let entry = iter.next(); !entry.done; entry = iter.next()) {
			let value = entry.value;
			if (!checkFunction || checkFunction(value, i, iter)) {
				yield (valueFunction ? valueFunction(value, i, iter) : value);
			}
			i++;
		}
	},

	/** Iterates over the values of a sequence of iterables (`seq`) 
	 * recursively iterating over each one, upto `depth`.
	 * 
	 * @param {iterable<any>} seq - The sequence of values, some or all of 
	 * 	which are iterable themselves.
	 * @param {integer} [depth=+Infinity] - The maximum amount of recursive 
	 * 	calls.
	 * 
	 * @example <caption>Generates the sequence: 1, 2, 3.</caption>
	 * 	generators.flat([[1,[2]],[3]]) 
	 * @example <caption>Generates the sequence: 1, [2], 3.</caption>
	 * 	generators.flat([[1,[2]],[3]], 1) 
	 * 
	 * @see Array.flat
	 * @see generators.concat
	*/
	*flat(seq, depth = +Infinity) {
		depth = isNaN(depth) ? Infinity : +depth;
		for (let value of seq) {
			if (typeof value[Symbol.iterator] === 'function' && depth > 0) {
				yield *generators.flat(value, depth - 1);
			} else {
				yield value;
			} 
		}
	},

	/** Iterates over a new sequence, with the values of the given sequence 
	 * `seq` transformed by the `mapFunction`.
	 * 
	 * @param {iterable<T>} seq - The original sequence.
	 * @param {function(T):R} [mapFunction=null] - A callback function that 
	 * 	transforms the value of `seq`.
	 * @yields {R}
	 * 
	 * @see generators.filteredMap
	 */
	map(seq, mapFunction) {
		return generators.filteredMap(seq, mapFunction, null);
	},

	/** Iterates over the permutations of `k` elements of the given sequence 
	 * `seq`. Permutations are not generated in any particular order.
	 * 
	 * _Warning!_ All `seq`'s values are stored in memory during the iteration.
	 * 
	 * @param {iterable<T>} seq - The sequence whose values are permutated.
	 * @param {integer} [k=NaN] - The amount of values in each permutation. By
	 * 	default the length of `seq` is assumed.
	 * @yields {T[]}
	 * 
	 * @see generators.combinations
	 */
	*permutations(seq, k = NaN) { //FIXME
		let pool = [...seq],
			n = pool.length;
		k = isNaN(k) ? n : +k;
		if (k > 0 && k <= n) {
			let count = Iterable.range(n - k + 1, n + 1).multiplication(); // factorial(n) / factorial (k)
			if (count > MAX_INTEGER) {
				throw new Error(`Number of permutations cannot be greater `+
					`than ${MAX_INTEGER}, and it is ${count}!`);
			}
			let indices = [...generators.range(n)],
				result, is, i;
			for (let current = 0; current < count; current++) {
				result = new Array(k);
				is = indices.slice();
				i = current;
				for (let p = 0; p < k; ++p) {
					result[p] = pool[is.splice(i % (n - p), 1)[0]];
					i = Math.floor(i / (n - p));
				}
				yield result;
			}
		}
	},

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
	*scanl(seq, foldFunction, initial) {
		let folded = initial,
			iter = seq[Symbol.iterator](),
			i = 0;
		//FIXME If initial is not given, the first value of the sequence may be used.
		yield folded; 
		for (let value of iter) {
			folded = foldFunction(folded, value, i, iter);
			yield folded;
			i++;
		}
	},

// Operations on many sequences ////////////////////////////////////////////////

	/** Iterates over the concatenation of all the given iterables.
	 * 
	 * @param {...iterable<T>} iterables
	 * @yields {T}
	 */
	*concat(...iterables) {
		for (let iterable of iterables) {
			yield *iterable;
		}
	},

	/** Gets the iterators of an array of iterables.
	 * 
	 * @param {...iterable} iterables
	 * @returns {iterator[]}
	*/
	iterators(...iterables) {
		return iterables.map((iterable) => {
			if (typeof iterable[Symbol.iterator] !== 'function') {
				throw new Error(`Object ${iterable} is not iterable!`);
			}
			return iterable[Symbol.iterator]();
		});
	},

	/** Iterates over the [cartesian product](http://en.wikipedia.org/wiki/Cartesian_product)
	 * of the given iterables, yielding an array of the values of each.
	 * 
	 * @param {...iterable<T>} iterables
	 * @yields {T[]}
	 */
	*product(...iterables) {
		let iters = generators.iterators(...iterables),
			tuple = iters.map((iter) => iter.next()),
			length = iters.length,
			done = tuple.reduce((acc, entry) => acc || entry.done, false);
		while (!done) {
			yield tuple.map((entry) => entry.value);
			for (let i = 0; i < length; i++) {
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
	},

	/** Iterates over all the given iterables at the same time, stopping at 
	 * the first sequence that finishes. Each value in the generated sequence 
	 * is made by calling the given `zipFunction` with an array of the values 
	 * of each iterable.
	 * 
	 * @param {function(any[]):R} zipFunction - The function to combine an 
	 * 	array values into one.
	 * @param {...iterable<any>} iterables
	 * @yields {R}
	 */
	*zipWith(zipFunction, ...iterables) {
		let iters = generators.iterators(...iterables),
			done = false, 
			values;
		while (!done) {
			values = iters.map((iter) => {
				let entry = iter.next();
				done = done || entry.done;
				return entry.value;
			});
			if (!done) {
				yield zipFunction(values);
			}
		}
	}
}; // generators

exports.generators = generators;
